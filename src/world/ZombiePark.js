import * as THREE from 'three';

export class ZombiePark {
  constructor(scene) {
    this.scene = scene;
    this.zombies = [];
    this.group = new THREE.Group();

    this.createParkDecorations();
    this.spawnZombies();
    this.scene.add(this.group);
  }

  createParkDecorations() {
    // Pintu Gerbang Taman Zombie
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

    // Pagar comel keliling taman
    const fenceMat = new THREE.MeshLambertMaterial({ color: 0xAB47BC });
    for (let x = 14; x <= 28; x += 2) {
      const picket = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.2, 0.18), fenceMat);
      picket.position.set(x, 0.6, -26);
      this.group.add(picket);
    }
  }

  // Cipta tekstur muka zombie kartun comel (mata bulat juling lucu)
  createZombieFace() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    // Kulit hijau ceria
    ctx.fillStyle = '#7CB342';
    ctx.fillRect(0, 0, 128, 128);

    // Mata bulat besar lucu
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(36, 48, 16, 0, Math.PI * 2);
    ctx.arc(92, 48, 18, 0, Math.PI * 2);
    ctx.fill();

    // Anak mata (pupil juling comel)
    ctx.fillStyle = '#1A1A1A';
    ctx.beginPath();
    ctx.arc(42, 52, 6, 0, Math.PI * 2);
    ctx.arc(86, 44, 7, 0, Math.PI * 2);
    ctx.fill();

    // Gigi jongang kartun
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(52, 78, 10, 12);
    ctx.fillRect(66, 78, 10, 12);

    // Garisan mulut comel
    ctx.strokeStyle = '#33691E';
    ctx.lineWidth = 4;
    ctx.strokeRect(48, 76, 32, 16);

    const texture = new THREE.CanvasTexture(canvas);
    return new THREE.MeshLambertMaterial({ map: texture });
  }

  spawnZombies() {
    const zombieData = [
      { name: 'Zom-Zom', pos: new THREE.Vector3(18, 0, -22), color: 0x7CB342, op: 'addition' },
      { name: 'Glee-Glee', pos: new THREE.Vector3(23, 0, -21), color: 0x689F38, op: 'subtraction' },
      { name: 'Bobo', pos: new THREE.Vector3(20, 0, -25), color: 0x558B2F, op: 'random' }
    ];

    const faceMat = this.createZombieFace();

    zombieData.forEach((data, idx) => {
      const zGroup = new THREE.Group();
      zGroup.position.copy(data.pos);

      const skinMat = new THREE.MeshLambertMaterial({ color: data.color });
      const pantsMat = new THREE.MeshLambertMaterial({ color: 0x512DA8 });

      // Badan
      const torso = new THREE.Mesh(new THREE.BoxGeometry(0.85, 1.0, 0.5), skinMat);
      torso.position.y = 1.3;
      zGroup.add(torso);

      // Kepala
      const headMats = [skinMat, skinMat, skinMat, skinMat, faceMat, skinMat];
      const head = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), headMats);
      head.position.y = 0.9;
      torso.add(head);

      // Lengan menjulur ke hadapan (Zombie walk)
      const armGeo = new THREE.BoxGeometry(0.3, 0.9, 0.3);
      armGeo.translate(0, -0.4, 0);

      const leftArm = new THREE.Mesh(armGeo, skinMat);
      leftArm.position.set(-0.6, 0.4, 0);
      leftArm.rotation.x = -Math.PI * 0.45; // Depan
      torso.add(leftArm);

      const rightArm = new THREE.Mesh(armGeo, skinMat);
      rightArm.position.set(0.6, 0.4, 0);
      rightArm.rotation.x = -Math.PI * 0.45; // Depan
      torso.add(rightArm);

      // Seluar
      const legGeo = new THREE.BoxGeometry(0.35, 0.8, 0.35);
      legGeo.translate(0, -0.4, 0);

      const leftLeg = new THREE.Mesh(legGeo, pantsMat);
      leftLeg.position.set(-0.22, -0.5, 0);
      torso.add(leftLeg);

      const rightLeg = new THREE.Mesh(legGeo, pantsMat);
      rightLeg.position.set(0.22, -0.5, 0);
      torso.add(rightLeg);

      // Ikon soalan matematik terapung di atas kepala
      const iconCanvas = document.createElement('canvas');
      iconCanvas.width = 128;
      iconCanvas.height = 128;
      const ictx = iconCanvas.getContext('2d');
      ictx.fillStyle = '#FF9800';
      ictx.beginPath();
      ictx.arc(64, 64, 56, 0, Math.PI * 2);
      ictx.fill();
      ictx.fillStyle = '#FFFFFF';
      ictx.font = 'bold 64px Arial';
      ictx.textAlign = 'center';
      ictx.textBaseline = 'middle';
      ictx.fillText('?', 64, 64);

      const iconTex = new THREE.CanvasTexture(iconCanvas);
      const iconMat = new THREE.SpriteMaterial({ map: iconTex });
      const sprite = new THREE.Sprite(iconMat);
      sprite.position.y = 2.8;
      sprite.scale.set(0.85, 0.85, 0.85);
      zGroup.add(sprite);

      this.group.add(zGroup);

      this.zombies.push({
        id: `zombie_${idx}`,
        name: data.name,
        group: zGroup,
        torso: torso,
        leftArm: leftArm,
        rightArm: rightArm,
        sprite: sprite,
        basePos: data.pos.clone(),
        opType: data.op,
        isDefeated: false,
        respawnTimer: 0,
        animOffset: idx * 1.5
      });
    });
  }

  // Dapatkan zombie terdekat dengan avatar
  getClosestZombie(playerPos, maxDistance = 4.0) {
    let closest = null;
    let minDist = maxDistance;

    for (const z of this.zombies) {
      if (z.isDefeated) continue;
      const d = playerPos.distanceTo(z.group.position);
      if (d < minDist) {
        minDist = d;
        closest = z;
      }
    }
    return closest;
  }

  // Apabila zombie terkena blaster / jawapan betul
  defeatZombie(zombie) {
    zombie.isDefeated = true;
    zombie.respawnTimer = 6.0; // Muncul semula selepas 6 saat
    zombie.group.visible = false;
  }

  update(delta, time) {
    for (const z of this.zombies) {
      if (z.isDefeated) {
        z.respawnTimer -= delta;
        if (z.respawnTimer <= 0) {
          z.isDefeated = false;
          z.group.visible = true;
          z.group.scale.set(1, 1, 1);
        }
        continue;
      }

      // Animasi goyang comel zombie
      const t = time * 3 + z.animOffset;
      z.torso.rotation.z = Math.sin(t) * 0.12;
      z.torso.rotation.y = Math.cos(t * 0.7) * 0.18;
      z.leftArm.rotation.x = -Math.PI * 0.45 + Math.sin(t) * 0.15;
      z.rightArm.rotation.x = -Math.PI * 0.45 - Math.sin(t) * 0.15;

      // Ikon '?' terapung naik turun
      z.sprite.position.y = 2.8 + Math.sin(time * 4 + z.animOffset) * 0.12;
    }
  }
}
