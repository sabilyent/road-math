import * as THREE from 'three';
import { Avatar } from './Avatar.js';
import { TownSquare } from './TownSquare.js';
import { FoodStreet } from './FoodStreet.js';
import { ZombiePark } from './ZombiePark.js';
import { ParticleSystem } from './ParticleSystem.js';

export class WorldScene {
  constructor(canvasContainer, saveData) {
    this.container = canvasContainer;
    this.saveData = saveData;

    // Parameter pergerakan pemain
    this.playerPos = new THREE.Vector3(0, 0, 5); // Titik mula berdekatan dataran
    this.playerVelocityY = 0;
    this.isGrounded = true;
    this.playerRotation = 0;
    this.baseSpeed = 7.0;
    this.speedMultiplier = 1.0;
    this.jumpMultiplier = 1.0;
    this.activeBuffTimer = 0;

    // Tetapan kamera third-person
    this.cameraDistance = 7.5;
    this.cameraHeight = 3.6;
    this.cameraYaw = 0; // Sudut pusingan horizontal
    this.cameraPitch = 0.28; // Sudut pusingan vertikal

    // Raycaster untuk Klik ke Zombie (Click-to-Aim)
    this.raycaster = new THREE.Raycaster();
    this.mouseNDC = new THREE.Vector2();

    this.initThree();
    this.buildWorld();
    this.setupResize();
  }

  initThree() {
    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x81D4FA); // Biru langit ceria
    this.scene.fog = new THREE.FogExp2(0x81D4FA, 0.016);

    // 2. Camera
    const aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(55, aspect, 0.1, 300);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);

    // 4. Pencahayaan ceria kartun
    const hemiLight = new THREE.HemisphereLight(0xFFFFFF, 0x81C784, 0.75);
    this.scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xFFF9C4, 0.95);
    sunLight.position.set(20, 35, 20);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 80;
    const d = 30;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    this.scene.add(sunLight);

    // Cahaya persekitaran lembut
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.35);
    this.scene.add(ambientLight);
  }

  buildWorld() {
    this.particleSystem = new ParticleSystem(this.scene);
    this.townSquare = new TownSquare(this.scene);
    this.foodStreet = new FoodStreet(this.scene);
    this.zombiePark = new ZombiePark(this.scene);

    // Cipta Avatar Pemain
    this.avatar = new Avatar(this.saveData);
    this.avatar.group.position.copy(this.playerPos);
    this.scene.add(this.avatar.group);
  }

  setupResize() {
    window.addEventListener('resize', () => {
      const width = this.container.clientWidth;
      const height = this.container.clientHeight;
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    });
  }

  // Gunakan buff makanan (cth. aiskrim laju atau donut lompat)
  applyFoodBuff(buffType, duration = 15.0) {
    this.activeBuffTimer = duration;
    if (buffType === 'speed') {
      this.speedMultiplier = 1.6;
      this.jumpMultiplier = 1.0;
    } else if (buffType === 'jump') {
      this.jumpMultiplier = 1.5;
      this.speedMultiplier = 1.0;
    } else if (buffType === 'sparkle') {
      this.speedMultiplier = 1.25;
      this.jumpMultiplier = 1.25;
    }
  }

  update(delta, inputManager, elapsedTime, isAiming = false, isExhausted = false) {
    // 1. Semak tamat masa buff makanan
    if (this.activeBuffTimer > 0) {
      this.activeBuffTimer -= delta;
      // Zarah berkilau semasa buff aktif
      if (Math.random() < 0.25) {
        this.particleSystem.spawnCoinBurst(this.playerPos, 1);
      }
      if (this.activeBuffTimer <= 0) {
        this.speedMultiplier = 1.0;
        this.jumpMultiplier = 1.0;
      }
    }

    // 2. Putaran Kamera melalui Mouse/Touch Drag
    const camDelta = inputManager.consumeCameraDelta();
    this.cameraYaw -= camDelta.x;
    this.cameraPitch = THREE.MathUtils.clamp(this.cameraPitch - camDelta.y, 0.05, 0.85);

    // 3. Pergerakan Pemain berasaskan arah pandangan kamera
    const move = inputManager.getMovement();
    const isMoving = Math.abs(move.x) > 0.01 || Math.abs(move.z) > 0.01;

    if (isMoving) {
      // Tukar input relative kepada orientasi kamera
      const sinYaw = Math.sin(this.cameraYaw);
      const cosYaw = Math.cos(this.cameraYaw);

      const worldX = move.x * cosYaw - move.z * sinYaw;
      const worldZ = move.x * sinYaw + move.z * cosYaw;

      const speed = this.baseSpeed * this.speedMultiplier * (isExhausted ? 0.52 : 1.0) * delta;
      this.playerPos.x += worldX * speed;
      this.playerPos.z += worldZ * speed;

      // Hadkan sempadan dunia bandar (World boundaries)
      this.playerPos.x = THREE.MathUtils.clamp(this.playerPos.x, -36, 36);
      this.playerPos.z = THREE.MathUtils.clamp(this.playerPos.z, -36, 36);

      // Pusingkan avatar menghadap arah larian
      const targetAngle = Math.atan2(worldX, worldZ);
      // Lerp putaran supaya licin
      let diff = targetAngle - this.playerRotation;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      this.playerRotation += diff * Math.min(1.0, delta * 12);
    }

    // 4. Lompatan dan Graviti (Jump & Physics)
    const canJump = !isExhausted;
    if (inputManager.isJumping && this.isGrounded && canJump) {
      this.playerVelocityY = 7.5 * this.jumpMultiplier;
      this.isGrounded = false;
    }

    if (!this.isGrounded) {
      this.playerPos.y += this.playerVelocityY * delta;
      this.playerVelocityY -= 20.0 * delta; // Graviti

      if (this.playerPos.y <= 0) {
        this.playerPos.y = 0;
        this.playerVelocityY = 0;
        this.isGrounded = true;
      }
    }

    // Kemaskini posisi & orientasi avatar mesh
    this.avatar.group.position.copy(this.playerPos);
    this.avatar.group.rotation.y = this.playerRotation;
    this.avatar.update(delta, isMoving, !this.isGrounded, this.playerVelocityY, isAiming);

    // 5. Kemaskini Kamera Third-Person licin mengekori avatar
    const camTarget = new THREE.Vector3(this.playerPos.x, this.playerPos.y + 1.3, this.playerPos.z);
    const camX = this.playerPos.x + Math.sin(this.cameraYaw) * Math.cos(this.cameraPitch) * this.cameraDistance;
    const camY = this.playerPos.y + Math.sin(this.cameraPitch) * this.cameraDistance + this.cameraHeight;
    const camZ = this.playerPos.z + Math.cos(this.cameraYaw) * Math.cos(this.cameraPitch) * this.cameraDistance;

    this.camera.position.set(camX, camY, camZ);
    this.camera.lookAt(camTarget);

    // 6. Kemaskini zon-zon dunia & gigitan zombie
    this.townSquare.update(delta, elapsedTime);
    this.foodStreet.update(delta, elapsedTime);
    const bitingZombie = this.zombiePark.update(delta, elapsedTime, this.playerPos);
    this.particleSystem.update(delta);

    // 7. Render babak
    this.renderer.render(this.scene, this.camera);

    // Semak sama ada berada dekat dengan air pancut (fountain heal)
    const isNearFountain = this.playerPos.distanceTo(new THREE.Vector3(0, 0, 0)) < 4.2;

    return {
      bitingZombie,
      isMoving,
      isJumping: inputManager.isJumping && this.isGrounded,
      isNearFountain
    };
  }

  // Pulihkan pemain ke pusat air pancut (Respawn)
  respawnAtFountain() {
    this.playerPos.set(0, 0, 0);
    this.playerVelocityY = 0;
    this.isGrounded = true;
    this.avatar.group.position.set(0, 0, 0);
  }

  // Dapatkan zombie yang diklik secara tepat menggunakan Raycaster
  getClickedZombie(clientX, clientY) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouseNDC.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    this.mouseNDC.y = -((clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouseNDC, this.camera);

    const hitTargets = [];
    for (const z of this.zombiePark.zombies) {
      if (!z.isDefeated) {
        hitTargets.push(z.torso, z.head);
      }
    }

    const intersects = this.raycaster.intersectObjects(hitTargets, false);
    if (intersects.length > 0) {
      const hitObj = intersects[0].object;
      return hitObj.userData?.zombie || null;
    }
    return null;
  }
}

