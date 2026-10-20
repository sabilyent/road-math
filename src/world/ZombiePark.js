import * as THREE from 'three';

export class ZombiePark {
  constructor(scene) {
    this.scene = scene;
    this.zombies = [];
    this.group = new THREE.Group();
    this.lockedZombie = null;

    this.createParkDecorations();
    this.createTargetReticleTexture();
    this.spawnTownZombies();
    this.scene.add(this.group);
  }

  createTargetReticleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    // Bulatan sasaran 🎯
    ctx.strokeStyle = '#FF1744';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(64, 64, 48, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#FF1744';
    ctx.beginPath();
    ctx.arc(64, 64, 18, 0, Math.PI * 2);
    ctx.fill();

    // Palang crosshair
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(64, 4);
    ctx.lineTo(64, 26);
    ctx.moveTo(64, 102);
    ctx.lineTo(64, 124);
    ctx.moveTo(4, 64);
    ctx.lineTo(26, 64);
    ctx.moveTo(102, 64);
    ctx.lineTo(124, 64);
    ctx.stroke();

    this.reticleTexture = new THREE.CanvasTexture(canvas);
  }

  createParkDecorations() {
    // Gerbang Taman Zombie di bahagian timur
    const archMat = new THREE.MeshLambertMaterial({ color: 0x8E24AA });
    const postGeo = new THREE.BoxGeometry(0.6, 4.0, 0.6);

    const post1 = new THREE.Mesh(postGeo, archMat);
    post1.position.set(16, 2, -18);
    this.group.add(post1);

    const post2 = new THREE.Mesh(postGeo, archMat);
    post2.position.set(22, 2, -18);
    this.group.add(post2);

    const topGeo = new THREE.BoxGeometry(7.0, 0.8, 0.8);
    const top = new THREE.Mesh(topGeo, archMat);
    top.position.set(19, 4.2, -18);
    this.group.add(top);
  }

  createZombieFace() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    // Kulit hijau kartun ceria
    ctx.fillStyle = '#7CB342';
    ctx.fillRect(0, 0, 128, 128);

    // Mata bulat besar comel
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(36, 48, 16, 0, Math.PI * 2);
    ctx.arc(92, 48, 18, 0, Math.PI * 2);
    ctx.fill();

    // Anak mata (pupil juling kartun)
    ctx.fillStyle = '#1A1A1A';
    ctx.beginPath();
    ctx.arc(42, 52, 6, 0, Math.PI * 2);
    ctx.arc(86, 44, 7, 0, Math.PI * 2);
    ctx.fill();

    // Gigi jongang kartun
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(52, 78, 10, 12);
    ctx.fillRect(66, 78, 10, 12);

    ctx.strokeStyle = '#33691E';
    ctx.lineWidth = 4;
    ctx.strokeRect(48, 76, 32, 16);

    const texture = new THREE.CanvasTexture(canvas);
    return new THREE.MeshLambertMaterial({ map: texture });
  }

  // Cipta 8 zombie yang berkeliaran di serata bandar (Town Square, Jalan Raya, Taman)
  spawnTownZombies() {
    const zombieConfigs = [
      { name: 'Zom-Zom', startPos: [18, 0, -22], color: 0x7CB342, op: 'addition' },
      { name: 'Glee-Glee', startPos: [-12, 0, 12], color: 0x689F38, op: 'subtraction' },
      { name: 'Bobo', startPos: [8, 0, -6], color: 0x558B2F, op: 'addition' },
      { name: 'Koko', startPos: [-6, 0, -16], color: 0x43A047, op: 'multiplication' },
      { name: 'Lulu', startPos: [14, 0, 16], color: 0x66BB6A, op: 'division' },
      { name: 'Chichi', startPos: [-16, 0, -4], color: 0x81C784, op: 'subtraction' },
      { name: 'Mumu', startPos: [0, 0, 18], color: 0x4CAF50, op: 'addition' },
      { name: 'Dodo', startPos: [20, 0, 6], color: 0x388E3C, op: 'random' }
    ];

    const faceMat = this.createZombieFace();

    zombieConfigs.forEach((cfg, idx) => {
      const zGroup = new THREE.Group();
      zGroup.position.set(cfg.startPos[0], 0, cfg.startPos[2]);

      const skinMat = new THREE.MeshLambertMaterial({ color: cfg.color });
      const pantsMat = new THREE.MeshLambertMaterial({ color: 0x4527A0 });

      // Torso
      const torso = new THREE.Mesh(new THREE.BoxGeometry(0.85, 1.0, 0.5), skinMat);
      torso.position.y = 1.3;
      torso.castShadow = true;
      zGroup.add(torso);

      // Kepala
      const headMats = [skinMat, skinMat, skinMat, skinMat, faceMat, skinMat];
      const head = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), headMats);
      head.position.y = 0.9;
      head.castShadow = true;
      torso.add(head);

      // Lengan zombie
      const armGeo = new THREE.BoxGeometry(0.3, 0.9, 0.3);
      armGeo.translate(0, -0.4, 0);

      const leftArm = new THREE.Mesh(armGeo, skinMat);
      leftArm.position.set(-0.6, 0.4, 0);
      leftArm.rotation.x = -Math.PI * 0.45;
      torso.add(leftArm);

      const rightArm = new THREE.Mesh(armGeo, skinMat);
      rightArm.position.set(0.6, 0.4, 0);
      rightArm.rotation.x = -Math.PI * 0.45;
      torso.add(rightArm);

      // Kaki
      const legGeo = new THREE.BoxGeometry(0.35, 0.8, 0.35);
      legGeo.translate(0, -0.4, 0);

      const leftLeg = new THREE.Mesh(legGeo, pantsMat);
      leftLeg.position.set(-0.22, -0.5, 0);
      torso.add(leftLeg);

      const rightLeg = new THREE.Mesh(legGeo, pantsMat);
      rightLeg.position.set(0.22, -0.5, 0);
      torso.add(rightLeg);

      // Sasaran Reticle (Crosshair) 3D terapung
      const reticleMat = new THREE.SpriteMaterial({ map: this.reticleTexture, transparent: true, opacity: 0 });
      const reticle = new THREE.Sprite(reticleMat);
      reticle.position.y = 2.9;
      reticle.scale.set(1.1, 1.1, 1.1);
      zGroup.add(reticle);

      // Sprite soalan '?'
      const iconCanvas = document.createElement('canvas');
      iconCanvas.width = 128;
      iconCanvas.height = 128;
      const ictx = iconCanvas.getContext('2d');
      ictx.fillStyle = '#E91E63';
      ictx.beginPath();
      ictx.arc(64, 64, 54, 0, Math.PI * 2);
      ictx.fill();
      ictx.fillStyle = '#FFFFFF';
      ictx.font = 'bold 64px Arial';
      ictx.textAlign = 'center';
      ictx.textBaseline = 'middle';
      ictx.fillText('?', 64, 64);

      const iconTex = new THREE.CanvasTexture(iconCanvas);
      const iconSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: iconTex }));
      iconSprite.position.y = 2.4;
      iconSprite.scale.set(0.7, 0.7, 0.7);
      zGroup.add(iconSprite);

      this.group.add(zGroup);

      // Sediakan objek zombie
      const zombieObj = {
        id: `zombie_${idx}`,
        name: cfg.name,
        group: zGroup,
        torso: torso,
        head: head,
        leftArm: leftArm,
        rightArm: rightArm,
        leftLeg: leftLeg,
        rightLeg: rightLeg,
        reticle: reticle,
        iconSprite: iconSprite,
        opType: cfg.op,
        isDefeated: false,
        respawnTimer: 0,
        animOffset: Math.random() * 5,
        speed: 1.2 + Math.random() * 0.8,
        targetPos: this.getRandomTownPoint(),
        pauseTimer: Math.random() * 2,
        isWandering: true,
        biteCooldown: 0
      };

      // Simpan rujukan untuk Raycasting (Click to Aim)
      torso.userData = { zombie: zombieObj };
      head.userData = { zombie: zombieObj };

      this.zombies.push(zombieObj);
    });
  }

  // Pilih koordinat rawak dalam bandar untuk berkeliaran
  getRandomTownPoint() {
    return new THREE.Vector3(
      (Math.random() - 0.5) * 55, // Antara -27.5 dan 27.5
      0,
      (Math.random() - 0.5) * 55
    );
  }

  // Auto-Aim: Dapatkan zombie terdekat dalam radius tembakan pistol
  updateAutoAim(playerPos, maxAimRange = 15.0) {
    let closest = null;
    let minDist = maxAimRange;

    for (const z of this.zombies) {
      if (z.isDefeated) continue;
      const d = playerPos.distanceTo(z.group.position);
      if (d < minDist) {
        minDist = d;
        closest = z;
      }
    }

    // Kemaskini reticle 🎯 pada sasaran auto-aim
    for (const z of this.zombies) {
      if (z.isDefeated) {
        z.reticle.material.opacity = 0;
        continue;
      }

      if (z === closest) {
        z.reticle.material.opacity = 1.0;
        z.reticle.scale.set(1.2, 1.2, 1.2);
        z.iconSprite.visible = false;
      } else {
        z.reticle.material.opacity = 0;
        z.iconSprite.visible = true;
      }
    }

    this.lockedZombie = closest;
    return closest;
  }

  // Pilih zombie secara manual melalui klik / raycast
  setTargetDirectly(zombie) {
    if (!zombie || zombie.isDefeated) return;
    this.lockedZombie = zombie;
    for (const z of this.zombies) {
      if (z === zombie) {
        z.reticle.material.opacity = 1.0;
        z.iconSprite.visible = false;
      } else {
        z.reticle.material.opacity = 0;
        z.iconSprite.visible = true;
      }
    }
  }

  // Zombie ditembak & mati (menghilang dengan letupan kartun)
  defeatZombie(zombie) {
    zombie.isDefeated = true;
    zombie.respawnTimer = 10.0; // Muncul semula selepas 10 saat di lokasi bandar baharu
    zombie.group.visible = false;
    zombie.reticle.material.opacity = 0;

    if (this.lockedZombie === zombie) {
      this.lockedZombie = null;
    }
  }

  // Kemaskini pergerakan berkeliaran di seluruh bandar & gigitan zombie jika dekat
  update(delta, time, playerPos = null) {
    let bitingZombie = null;

    for (const z of this.zombies) {
      if (z.isDefeated) {
        z.respawnTimer -= delta;
        if (z.respawnTimer <= 0) {
          // Muncul semula di sudut bandar secara rawak
          const spawnPt = this.getRandomTownPoint();
          z.group.position.copy(spawnPt);
          z.targetPos = this.getRandomTownPoint();
          z.isDefeated = false;
          z.group.visible = true;
          z.biteCooldown = 1.0;
        }
        continue;
      }

      z.biteCooldown = Math.max(0, z.biteCooldown - delta);

      // Semak jarak dengan pemain untuk logik Kejar & Gigit (Aggro & Bite)
      let distToPlayer = 999;
      if (playerPos) {
        distToPlayer = z.group.position.distanceTo(playerPos);
      }

      // 1. ZOMBIE GIGIT PEMAIN (Jarak < 1.6 unit)
      if (distToPlayer < 1.6 && z.biteCooldown <= 0) {
        z.biteCooldown = 2.4; // Cooldown gigitan seterusnya
        bitingZombie = z;

        // Animasi melompat menggigit kartun
        z.torso.position.y = 1.6;
        setTimeout(() => { z.torso.position.y = 1.3; }, 250);
      }

      // 2. ZOMBIE MENGEJAR PEMAIN (Jarak < 8.5 unit)
      if (distToPlayer < 8.5 && playerPos) {
        // Bergerak ke arah pemain
        const dir = new THREE.Vector3().subVectors(playerPos, z.group.position);
        dir.y = 0;
        dir.normalize();

        const chaseSpeed = 1.6 * delta;
        z.group.position.addScaledVector(dir, chaseSpeed);

        const targetAngle = Math.atan2(dir.x, dir.z);
        z.group.rotation.y = THREE.MathUtils.lerp(z.group.rotation.y, targetAngle, 0.12);

        // Animasi berjalan laju mengejar
        const waddle = Math.sin(time * 8 + z.animOffset);
        z.torso.rotation.z = waddle * 0.15;
        z.leftLeg.rotation.x = waddle * 0.55;
        z.rightLeg.rotation.x = -waddle * 0.55;
        z.leftArm.rotation.x = -Math.PI * 0.45 + waddle * 0.3;
        z.rightArm.rotation.x = -Math.PI * 0.45 - waddle * 0.3;

      } else {
        // 3. Logik AI Berkeliaran Santai (Roaming AI)
        if (z.pauseTimer > 0) {
          z.pauseTimer -= delta;
          const t = time * 2.5 + z.animOffset;
          z.torso.rotation.z = Math.sin(t) * 0.05;
          z.leftLeg.rotation.x = 0;
          z.rightLeg.rotation.x = 0;
        } else {
          const currentPos = z.group.position;
          const dir = new THREE.Vector3().subVectors(z.targetPos, currentPos);
          dir.y = 0;
          const distToTarget = dir.length();

          if (distToTarget < 1.0) {
            z.pauseTimer = 1.5 + Math.random() * 2.5;
            z.targetPos = this.getRandomTownPoint();
          } else {
            dir.normalize();
            const moveSpeed = z.speed * delta;
            currentPos.addScaledVector(dir, moveSpeed);

            const targetAngle = Math.atan2(dir.x, dir.z);
            z.group.rotation.y = THREE.MathUtils.lerp(z.group.rotation.y, targetAngle, 0.1);

            const waddle = Math.sin(time * 6 + z.animOffset);
            z.torso.rotation.z = waddle * 0.12;
            z.leftLeg.rotation.x = waddle * 0.45;
            z.rightLeg.rotation.x = -waddle * 0.45;
            z.leftArm.rotation.x = -Math.PI * 0.45 + waddle * 0.2;
            z.rightArm.rotation.x = -Math.PI * 0.45 - waddle * 0.2;
          }
        }
      }

      // Animasi reticle putaran & denyutan jika dikunci
      if (z.reticle.material.opacity > 0) {
        z.reticle.position.y = 2.9 + Math.sin(time * 5) * 0.1;
      } else {
        z.iconSprite.position.y = 2.4 + Math.sin(time * 3 + z.animOffset) * 0.08;
      }
    }

    return bitingZombie;
  }
}
