import * as THREE from 'three';

export class Avatar {
  constructor(saveData) {
    this.saveData = saveData;
    const avatarData = saveData?.player?.avatar || saveData?.avatar || {};
    this.avatarData = avatarData;
    this.group = new THREE.Group();
    this.animTime = 0;
    this.isMoving = false;
    this.propellerMesh = null;

    this.materials = {
      skin: new THREE.MeshLambertMaterial({ color: avatarData.skin || '#FFCC80' }),
      shirt: new THREE.MeshLambertMaterial({ color: avatarData.shirt || '#0288D1' }),
      pants: new THREE.MeshLambertMaterial({ color: avatarData.pants || '#2E7D32' }),
      shoes: new THREE.MeshLambertMaterial({ color: '#212121' }),
      hair: new THREE.MeshLambertMaterial({ color: avatarData.hair || '#3E2723' }),
      face: this.createFaceMaterial(),
      shadow: new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.28,
        depthWrite: false
      })
    };

    this.buildBody();
    this.buildHat(avatarData.hat || 'propeller');
    this.buildShadow();
  }

  // Lukis tekstur muka comel menggunakan HTML5 Canvas 2D
  createFaceMaterial() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    // Warna asas muka
    ctx.fillStyle = this.avatarData?.skin || '#FFCC80';
    ctx.fillRect(0, 0, 128, 128);

    // Mata berkilau comel (Roblox style)
    ctx.fillStyle = '#1A1A1A';
    // Mata kiri
    ctx.beginPath();
    ctx.arc(40, 52, 10, 0, Math.PI * 2);
    ctx.fill();
    // Mata kanan
    ctx.beginPath();
    ctx.arc(88, 52, 10, 0, Math.PI * 2);
    ctx.fill();

    // Kilauan putih dalam mata
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(37, 48, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(85, 48, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Pipi merah comel (blush)
    ctx.fillStyle = 'rgba(255, 112, 112, 0.45)';
    ctx.beginPath();
    ctx.arc(30, 68, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(98, 68, 8, 0, Math.PI * 2);
    ctx.fill();

    // Senyuman lebar ceria
    ctx.strokeStyle = '#212121';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(64, 68, 18, 0.15 * Math.PI, 0.85 * Math.PI, false);
    ctx.stroke();

    const texture = new THREE.CanvasTexture(canvas);
    return new THREE.MeshLambertMaterial({ map: texture });
  }

  buildBody() {
    // 1. Torso (Badan kotak Roblox)
    const torsoGeo = new THREE.BoxGeometry(0.9, 1.1, 0.5);
    this.torso = new THREE.Mesh(torsoGeo, this.materials.shirt);
    this.torso.position.y = 1.35;
    this.torso.castShadow = true;
    this.group.add(this.torso);

    // 2. Kepala (Head)
    const headGeo = new THREE.BoxGeometry(0.75, 0.75, 0.75);
    // Face material hanya pada permukaan depan
    const headMats = [
      this.materials.skin, // Kanan
      this.materials.skin, // Kiri
      this.materials.skin, // Atas
      this.materials.skin, // Bawah
      this.materials.face, // Hadapan (muka)
      this.materials.skin  // Belakang
    ];
    this.head = new THREE.Mesh(headGeo, headMats);
    this.head.position.y = 0.95;
    this.head.castShadow = true;
    this.torso.add(this.head);

    // Rambut comel
    const hairGeo = new THREE.BoxGeometry(0.8, 0.25, 0.8);
    this.hair = new THREE.Mesh(hairGeo, this.materials.hair);
    this.hair.position.y = 0.42;
    this.head.add(this.hair);

    // 3. Lengan Kiri (Left Arm)
    const armGeo = new THREE.BoxGeometry(0.35, 1.0, 0.35);
    // Offset pivot lengan di bahagian bahu
    armGeo.translate(0, -0.4, 0);

    this.leftArm = new THREE.Mesh(armGeo, this.materials.shirt);
    this.leftArm.position.set(-0.66, 0.45, 0);
    this.leftArm.castShadow = true;
    this.torso.add(this.leftArm);

    // 4. Lengan Kanan (Right Arm)
    this.rightArm = new THREE.Mesh(armGeo, this.materials.shirt);
    this.rightArm.position.set(0.66, 0.45, 0);
    this.rightArm.castShadow = true;
    this.torso.add(this.rightArm);

    // Math Blaster / Pistol Matematik Kartun
    const blasterGroup = new THREE.Group();
    const gunBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.22, 0.42),
      new THREE.MeshLambertMaterial({ color: 0x00E5FF })
    );
    const gunBarrel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.08, 0.22, 8),
      new THREE.MeshLambertMaterial({ color: 0xFF9100 })
    );
    gunBarrel.rotation.x = Math.PI / 2;
    gunBarrel.position.set(0, 0.04, 0.28);
    blasterGroup.add(gunBody, gunBarrel);
    blasterGroup.position.set(0, -0.85, 0.15);
    this.rightArm.add(blasterGroup);

    // 5. Kaki Kiri (Left Leg)
    const legGeo = new THREE.BoxGeometry(0.38, 0.9, 0.4);
    legGeo.translate(0, -0.45, 0);

    this.leftLeg = new THREE.Mesh(legGeo, this.materials.pants);
    this.leftLeg.position.set(-0.24, -0.55, 0);
    this.leftLeg.castShadow = true;
    this.torso.add(this.leftLeg);

    // 6. Kaki Kanan (Right Leg)
    this.rightLeg = new THREE.Mesh(legGeo, this.materials.pants);
    this.rightLeg.position.set(0.24, -0.55, 0);
    this.rightLeg.castShadow = true;
    this.torso.add(this.rightLeg);
  }

  buildHat(hatType) {
    if (this.hatMesh) {
      this.head.remove(this.hatMesh);
      this.hatMesh = null;
      this.propellerMesh = null;
    }

    if (hatType === 'none') return;

    this.hatMesh = new THREE.Group();

    if (hatType === 'propeller') {
      // Topi besbol biru dengan kipas berputar di atas
      const capGeo = new THREE.CylinderGeometry(0.38, 0.42, 0.25, 16);
      const capMat = new THREE.MeshLambertMaterial({ color: 0xE53935 });
      const cap = new THREE.Mesh(capGeo, capMat);
      cap.position.y = 0.45;
      this.hatMesh.add(cap);

      // Muncung topi (visor)
      const visorGeo = new THREE.BoxGeometry(0.4, 0.05, 0.25);
      const visor = new THREE.Mesh(visorGeo, capMat);
      visor.position.set(0, 0.38, 0.4);
      this.hatMesh.add(visor);

      // Rod kipas
      const rodGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.15, 8);
      const rodMat = new THREE.MeshLambertMaterial({ color: 0xFFEB3B });
      const rod = new THREE.Mesh(rodGeo, rodMat);
      rod.position.y = 0.62;
      this.hatMesh.add(rod);

      // Bilah kipas berputar
      this.propellerMesh = new THREE.Group();
      const bladeGeo = new THREE.BoxGeometry(0.65, 0.03, 0.1);
      const bladeMat1 = new THREE.MeshLambertMaterial({ color: 0x4CAF50 });
      const blade1 = new THREE.Mesh(bladeGeo, bladeMat1);
      this.propellerMesh.add(blade1);

      const bladeMat2 = new THREE.MeshLambertMaterial({ color: 0x2196F3 });
      const blade2 = new THREE.Mesh(bladeGeo, bladeMat2);
      blade2.rotation.y = Math.PI / 2;
      this.propellerMesh.add(blade2);

      this.propellerMesh.position.y = 0.7;
      this.hatMesh.add(this.propellerMesh);

    } else if (hatType === 'crown') {
      // Mahkota diraja berkilau
      const crownMat = new THREE.MeshLambertMaterial({ color: 0xFFD700 });
      const baseGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.15, 6);
      const base = new THREE.Mesh(baseGeo, crownMat);
      base.position.y = 0.5;
      this.hatMesh.add(base);

      // Permata ruby
      const gemGeo = new THREE.SphereGeometry(0.06, 8, 8);
      const gemMat = new THREE.MeshLambertMaterial({ color: 0xFF1744 });
      const gem = new THREE.Mesh(gemGeo, gemMat);
      gem.position.set(0, 0.6, 0.36);
      this.hatMesh.add(gem);

    } else if (hatType === 'party') {
      // Topi kon pesta ceria
      const coneGeo = new THREE.ConeGeometry(0.28, 0.6, 16);
      const coneMat = new THREE.MeshLambertMaterial({ color: 0xFF4081 });
      const cone = new THREE.Mesh(coneGeo, coneMat);
      cone.position.y = 0.7;
      this.hatMesh.add(cone);

      const pomGeo = new THREE.SphereGeometry(0.08, 8, 8);
      const pomMat = new THREE.MeshLambertMaterial({ color: 0xFFEB3B });
      const pom = new THREE.Mesh(pomGeo, pomMat);
      pom.position.y = 1.02;
      this.hatMesh.add(pom);

    } else if (hatType === 'ears') {
      // Telinga kucing / beruang comel
      const earMat = new THREE.MeshLambertMaterial({ color: 0x5D4037 });
      const earGeo = new THREE.ConeGeometry(0.14, 0.24, 8);

      const leftEar = new THREE.Mesh(earGeo, earMat);
      leftEar.position.set(-0.3, 0.55, 0);
      leftEar.rotation.z = 0.3;
      this.hatMesh.add(leftEar);

      const rightEar = new THREE.Mesh(earGeo, earMat);
      rightEar.position.set(0.3, 0.55, 0);
      rightEar.rotation.z = -0.3;
      this.hatMesh.add(rightEar);
    }

    this.head.add(this.hatMesh);
  }

  buildShadow() {
    const shadowGeo = new THREE.CircleGeometry(0.65, 16);
    this.shadowMesh = new THREE.Mesh(shadowGeo, this.materials.shadow);
    this.shadowMesh.rotation.x = -Math.PI / 2;
    this.shadowMesh.position.y = 0.02;
    this.group.add(this.shadowMesh);
  }

  // Kemaskini warna avatar secara langsung
  updateCustomization(avatarData) {
    if (!avatarData) return;
    this.avatarData = { ...this.avatarData, ...avatarData };
    if (avatarData.shirt) this.materials.shirt.color.set(avatarData.shirt);
    if (avatarData.pants) this.materials.pants.color.set(avatarData.pants);
    if (avatarData.skin) {
      this.materials.skin.color.set(avatarData.skin);
      this.materials.face = this.createFaceMaterial();
      this.head.material[4] = this.materials.face;
    }
    if (avatarData.hair) this.materials.hair.color.set(avatarData.hair);
    if (avatarData.hat) this.buildHat(avatarData.hat);
  }

  // Update animasi pergerakan setiap frame
  update(delta, isMoving, isJumping, velocityY, isAiming = false) {
    this.animTime += delta * 8;

    // Putar kipas jika memakai topi kipas
    if (this.propellerMesh) {
      this.propellerMesh.rotation.y += delta * 12;
    }

    if (isJumping) {
      // Pose lompat gembira: tangan naik ke atas, kaki bengkok sedikit
      this.leftArm.rotation.x = -Math.PI * 0.7;
      this.rightArm.rotation.x = isAiming ? -Math.PI * 0.45 : -Math.PI * 0.7;
      this.leftLeg.rotation.x = 0.35;
      this.rightLeg.rotation.x = 0.35;
      this.torso.position.y = 1.35;

      // Bayang mengecil mengikut ketinggian
      const height = Math.max(0, this.group.position.y);
      const scale = Math.max(0.3, 1 - height * 0.25);
      this.shadowMesh.scale.set(scale, scale, 1);
      this.materials.shadow.opacity = Math.max(0.08, 0.28 - height * 0.08);

    } else if (isMoving) {
      // Ayunan berjalan/berlari ceria Roblox
      const swing = Math.sin(this.animTime) * 0.75;
      this.leftArm.rotation.x = swing;
      this.rightArm.rotation.x = isAiming ? -Math.PI * 0.45 : -swing;
      this.leftLeg.rotation.x = -swing * 0.85;
      this.rightLeg.rotation.x = swing * 0.85;

      // Sedikit pantulan badan naik turun semasa berlari
      this.torso.position.y = 1.35 + Math.abs(Math.sin(this.animTime * 2)) * 0.08;

      this.shadowMesh.scale.set(1, 1, 1);
      this.materials.shadow.opacity = 0.28;

    } else {
      // Keadaan santai (Idle breathing)
      const breath = Math.sin(this.animTime * 0.35) * 0.03;
      this.torso.position.y = 1.35 + breath;
      this.leftArm.rotation.x = THREE.MathUtils.lerp(this.leftArm.rotation.x, 0, 0.1);
      this.rightArm.rotation.x = isAiming ? -Math.PI * 0.45 : THREE.MathUtils.lerp(this.rightArm.rotation.x, 0, 0.1);
      this.leftLeg.rotation.x = THREE.MathUtils.lerp(this.leftLeg.rotation.x, 0, 0.1);
      this.rightLeg.rotation.x = THREE.MathUtils.lerp(this.rightLeg.rotation.x, 0, 0.1);

      this.shadowMesh.scale.set(1, 1, 1);
      this.materials.shadow.opacity = 0.28;
    }
  }

  // Kesan kilauan merah apabila terkena gigitan
  flashHurt() {
    const origShirt = this.materials.shirt.color.getHex();
    const origSkin = this.materials.skin.color.getHex();
    this.materials.shirt.color.setHex(0xFF1744);
    this.materials.skin.color.setHex(0xFF8A80);
    setTimeout(() => {
      this.materials.shirt.color.setHex(origShirt);
      this.materials.skin.color.setHex(origSkin);
    }, 280);
  }
}
