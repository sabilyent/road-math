import * as THREE from 'three';

export class TownSquare {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.coins = [];
    this.mathDoors = [];
    this.wardrobePos = new THREE.Vector3(6, 0, 8);

    this.buildGroundAndRoads();
    this.buildBuildings();
    this.buildCentralFountain();
    this.buildMathDoors();
    this.buildWardrobeStation();
    this.buildTreesAndProps();
    this.spawnScatterCoins();

    this.scene.add(this.group);
  }

  buildGroundAndRoads() {
    // 1. Tanah rumput hijau subur
    const grassGeo = new THREE.PlaneGeometry(120, 120);
    const grassMat = new THREE.MeshLambertMaterial({ color: 0x81C784 });
    const grass = new THREE.Mesh(grassGeo, grassMat);
    grass.rotation.x = -Math.PI / 2;
    grass.receiveShadow = true;
    this.group.add(grass);

    // 2. Jalan raya bertar kelabu dengan garisan putih
    // Jalan utama X (Horizontal)
    const roadMat = new THREE.MeshLambertMaterial({ color: 0x37474F });
    const lineMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });

    const roadX = new THREE.Mesh(new THREE.PlaneGeometry(100, 6), roadMat);
    roadX.rotation.x = -Math.PI / 2;
    roadX.position.set(0, 0.01, -12);
    roadX.receiveShadow = true;
    this.group.add(roadX);

    // Garisan putih bertitik jalan X
    for (let x = -45; x <= 45; x += 6) {
      const line = new THREE.Mesh(new THREE.PlaneGeometry(3, 0.35), lineMat);
      line.rotation.x = -Math.PI / 2;
      line.position.set(x, 0.02, -12);
      this.group.add(line);
    }

    // Jalan utama Z (Menghala ke Food Street & Town Square)
    const roadZ = new THREE.Mesh(new THREE.PlaneGeometry(6, 80), roadMat);
    roadZ.rotation.x = -Math.PI / 2;
    roadZ.position.set(-6, 0.01, 10);
    roadZ.receiveShadow = true;
    this.group.add(roadZ);

    // Lintasan Belang (Zebra Crossing)
    for (let i = -2; i <= 2; i++) {
      const stripe = new THREE.Mesh(new THREE.PlaneGeometry(5, 0.5), lineMat);
      stripe.rotation.x = -Math.PI / 2;
      stripe.position.set(-6, 0.02, -10 + i * 1.0);
      this.group.add(stripe);
    }

    // Dataran Plaza Town Square (Jubin warna ceria)
    const plazaGeo = new THREE.BoxGeometry(22, 0.15, 22);
    const plazaMat = new THREE.MeshLambertMaterial({ color: 0xFFF9C4 }); // Cream pastel
    const plaza = new THREE.Mesh(plazaGeo, plazaMat);
    plaza.position.set(0, 0.08, 0);
    plaza.receiveShadow = true;
    this.group.add(plaza);
  }

  buildCentralFountain() {
    this.fountainGroup = new THREE.Group();
    this.fountainGroup.position.set(0, 0.15, 0);

    // Kolam bulat
    const basinGeo = new THREE.CylinderGeometry(3.5, 3.8, 0.8, 24);
    const basinMat = new THREE.MeshLambertMaterial({ color: 0xB0BEC5 });
    const basin = new THREE.Mesh(basinGeo, basinMat);
    basin.position.y = 0.4;
    basin.castShadow = true;
    this.fountainGroup.add(basin);

    // Air berkilau biru
    const waterGeo = new THREE.CylinderGeometry(3.3, 3.3, 0.1, 24);
    const waterMat = new THREE.MeshLambertMaterial({ color: 0x29B6F6, transparent: true, opacity: 0.85 });
    this.waterMesh = new THREE.Mesh(waterGeo, waterMat);
    this.waterMesh.position.y = 0.75;
    this.fountainGroup.add(this.waterMesh);

    // Tiang tengah
    const pillarGeo = new THREE.CylinderGeometry(0.8, 1.0, 1.8, 16);
    const pillar = new THREE.Mesh(pillarGeo, basinMat);
    pillar.position.y = 1.3;
    pillar.castShadow = true;
    this.fountainGroup.add(pillar);

    // Syiling Gergasi Emas Berputar di Atas Pancutan Air
    const coinGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.18, 18);
    const coinMat = new THREE.MeshLambertMaterial({ color: 0xFFD700 });
    this.fountainCoin = new THREE.Mesh(coinGeo, coinMat);
    this.fountainCoin.position.y = 3.0;
    this.fountainCoin.rotation.x = Math.PI / 2;
    this.fountainCoin.castShadow = true;
    this.fountainGroup.add(this.fountainCoin);

    this.group.add(this.fountainGroup);
  }

  buildMathDoors() {
    // 1. Pintu Gerbang Utama (Grand Math Gate) ke Town Hall
    const door1 = this.createDoor('door_town_hall', 'Pintu Gerbang Utama', new THREE.Vector3(0, 0, -6), 0xFFB300, 'addition');
    this.mathDoors.push(door1);

    // 2. Pintu Rahsia Taman Bintang (Star Gate)
    const door2 = this.createDoor('door_star_garden', 'Pintu Rahsia Bintang', new THREE.Vector3(14, 0, 4), 0x42A5F5, 'subtraction');
    this.mathDoors.push(door2);
  }

  createDoor(id, name, position, colorHex, operation) {
    const doorGroup = new THREE.Group();
    doorGroup.position.copy(position);

    // Tiang kiri & kanan
    const frameMat = new THREE.MeshLambertMaterial({ color: colorHex });
    const postGeo = new THREE.BoxGeometry(0.7, 3.6, 0.7);

    const leftPost = new THREE.Mesh(postGeo, frameMat);
    leftPost.position.set(-1.6, 1.8, 0);
    doorGroup.add(leftPost);

    const rightPost = new THREE.Mesh(postGeo, frameMat);
    rightPost.position.set(1.6, 1.8, 0);
    doorGroup.add(rightPost);

    const topPost = new THREE.Mesh(new THREE.BoxGeometry(3.9, 0.7, 0.7), frameMat);
    topPost.position.set(0, 3.6, 0);
    doorGroup.add(topPost);

    // Daun pintu yang boleh dibuka/tertutup
    const leafGeo = new THREE.BoxGeometry(2.5, 3.0, 0.2);
    const leafMat = new THREE.MeshLambertMaterial({ color: 0xD7CCC8 });
    const doorLeaf = new THREE.Mesh(leafGeo, leafMat);
    doorLeaf.position.set(0, 1.6, 0);
    doorGroup.add(doorLeaf);

    // Kunci Mangga Emas (Lock Icon)
    const lockMat = new THREE.MeshLambertMaterial({ color: 0xFFD700 });
    const lock = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.6, 0.35), lockMat);
    lock.position.set(0, 1.6, 0.2);
    doorGroup.add(lock);

    // Peti Harta Karun di Belakang Pintu
    const chestGroup = new THREE.Group();
    const chestBox = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.8, 0.8), new THREE.MeshLambertMaterial({ color: 0x8D6E63 }));
    chestBox.position.set(0, 0.4, -1.8);
    const chestGold = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 1.2, 12, 1, false, 0, Math.PI), new THREE.MeshLambertMaterial({ color: 0xFFD700 }));
    chestGold.rotation.z = Math.PI / 2;
    chestGold.position.set(0, 0.8, -1.8);
    chestGroup.add(chestBox, chestGold);
    doorGroup.add(chestGroup);

    this.group.add(doorGroup);

    return {
      id: id,
      name: name,
      group: doorGroup,
      leaf: doorLeaf,
      lock: lock,
      pos: position,
      isOpen: false,
      operation: operation
    };
  }

  buildWardrobeStation() {
    // Stesen Almari Fesyen Roblox
    const stationGroup = new THREE.Group();
    stationGroup.position.copy(this.wardrobePos);

    // Podium Bintang Bulat
    const podiumGeo = new THREE.CylinderGeometry(1.8, 2.0, 0.3, 16);
    const podiumMat = new THREE.MeshLambertMaterial({ color: 0xAB47BC });
    const podium = new THREE.Mesh(podiumGeo, podiumMat);
    podium.position.y = 0.15;
    stationGroup.add(podium);

    // Ikon Baju & Cermin
    const mirrorGeo = new THREE.BoxGeometry(1.4, 2.2, 0.15);
    const mirrorMat = new THREE.MeshLambertMaterial({ color: 0xE1BEE7 });
    const mirror = new THREE.Mesh(mirrorGeo, mirrorMat);
    mirror.position.set(0, 1.4, -0.6);
    stationGroup.add(mirror);

    // Papan tanda comel
    const signCanvas = document.createElement('canvas');
    signCanvas.width = 256;
    signCanvas.height = 100;
    const ctx = signCanvas.getContext('2d');
    ctx.fillStyle = '#8E24AA';
    ctx.roundRect(4, 4, 248, 92, 18);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('👕 Almari Roblox', 128, 50);

    const signTex = new THREE.CanvasTexture(signCanvas);
    const signSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: signTex }));
    signSprite.position.set(0, 2.8, 0);
    signSprite.scale.set(1.6, 0.65, 1);
    stationGroup.add(signSprite);

    this.wardrobeSprite = signSprite;
    this.group.add(stationGroup);
  }

  buildBuildings() {
    // Bangunan-bangunan bandar dengan warna ceria ala mainan kanak-kanak
    const buildingsData = [
      { pos: [0, 0, -18], size: [14, 7, 7], color: 0x42A5F5, roofColor: 0x1E88E5, name: 'Dewan Bandaraya' },
      { pos: [-14, 0, -18], size: [8, 5, 6], color: 0xFFB74D, roofColor: 0xF57C00, name: 'Perpustakaan' },
      { pos: [14, 0, -8], size: [7, 5, 6], color: 0x81C784, roofColor: 0x388E3C, name: 'Kedai Mainan' },
      { pos: [14, 0, 12], size: [8, 4.5, 6], color: 0xBA68C8, roofColor: 0x7B1FA2, name: 'Rumah Ceria' }
    ];

    buildingsData.forEach((b) => {
      const bGroup = new THREE.Group();
      bGroup.position.set(b.pos[0], 0, b.pos[2]);

      // Struktur dinding
      const wallMat = new THREE.MeshLambertMaterial({ color: b.color });
      const wallMesh = new THREE.Mesh(new THREE.BoxGeometry(b.size[0], b.size[1], b.size[2]), wallMat);
      wallMesh.position.y = b.size[1] / 2;
      wallMesh.castShadow = true;
      wallMesh.receiveShadow = true;
      bGroup.add(wallMesh);

      // Bumbung prisma
      const roofGeo = new THREE.ConeGeometry(b.size[0] * 0.7, 2.5, 4);
      const roofMat = new THREE.MeshLambertMaterial({ color: b.roofColor });
      const roof = new THREE.Mesh(roofGeo, roofMat);
      roof.position.y = b.size[1] + 1.25;
      roof.rotation.y = Math.PI / 4;
      bGroup.add(roof);

      // Pintu bangunan
      const doorMesh = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.6, 0.2), new THREE.MeshLambertMaterial({ color: 0x5D4037 }));
      doorMesh.position.set(0, 1.3, b.size[2] / 2 + 0.1);
      bGroup.add(doorMesh);

      // Tingkap-tingkap comel
      const winMat = new THREE.MeshBasicMaterial({ color: 0xFFF176 });
      const winGeo = new THREE.BoxGeometry(1.0, 1.0, 0.1);

      const win1 = new THREE.Mesh(winGeo, winMat);
      win1.position.set(-b.size[0] * 0.28, b.size[1] * 0.65, b.size[2] / 2 + 0.1);
      const win2 = new THREE.Mesh(winGeo, winMat);
      win2.position.set(b.size[0] * 0.28, b.size[1] * 0.65, b.size[2] / 2 + 0.1);
      bGroup.add(win1, win2);

      this.group.add(bGroup);
    });
  }

  buildTreesAndProps() {
    const treePositions = [
      [-10, 0, -4], [-10, 0, 4], [10, 0, -4], [10, 0, 4],
      [-5, 0, 22], [5, 0, 22], [22, 0, -4], [25, 0, 4],
      [-24, 0, -22], [-22, 0, -14], [25, 0, -12]
    ];

    const trunkGeo = new THREE.CylinderGeometry(0.25, 0.35, 1.8, 8);
    const trunkMat = new THREE.MeshLambertMaterial({ color: 0x795548 });
    const leavesGeo = new THREE.DodecahedronGeometry(1.3, 1);
    const leavesMat = new THREE.MeshLambertMaterial({ color: 0x4CAF50 });

    treePositions.forEach((pos) => {
      const treeGroup = new THREE.Group();
      treeGroup.position.set(pos[0], 0, pos[2]);

      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = 0.9;
      trunk.castShadow = true;
      treeGroup.add(trunk);

      const leaves = new THREE.Mesh(leavesGeo, leavesMat);
      leaves.position.y = 2.4;
      leaves.castShadow = true;
      treeGroup.add(leaves);

      this.group.add(treeGroup);
    });
  }

  spawnScatterCoins() {
    const coinPositions = [
      [2, 0.6, 3], [-2, 0.6, 3], [3, 0.6, -2], [-3, 0.6, -2],
      [-6, 0.6, 6], [-6, 0.6, 14], [-6, 0.6, -4],
      [8, 0.6, 2], [6, 0.6, -4], [12, 0.6, -2]
    ];

    const coinGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.08, 14);
    const coinMat = new THREE.MeshLambertMaterial({ color: 0xFFC107 });

    coinPositions.forEach((p, idx) => {
      const mesh = new THREE.Mesh(coinGeo, coinMat);
      mesh.position.set(p[0], p[1], p[2]);
      mesh.rotation.x = Math.PI / 2;
      mesh.castShadow = true;
      this.group.add(mesh);

      this.coins.push({
        id: `coin_${idx}`,
        mesh: mesh,
        baseY: p[1],
        collected: false,
        respawnTimer: 0
      });
    });
  }

  // Dapatkan interaksi pintu berdekatan
  getClosestDoor(playerPos, maxDistance = 3.2) {
    let closest = null;
    let minDist = maxDistance;

    for (const d of this.mathDoors) {
      const dist = playerPos.distanceTo(d.pos);
      if (dist < minDist) {
        minDist = dist;
        closest = d;
      }
    }
    return closest;
  }

  // Buka pintu apabila soalan dijawab betul
  openDoor(door) {
    door.isOpen = true;
    door.leaf.position.y = 4.2; // Daun pintu meluncur ke atas
    door.lock.visible = false;
  }

  // Dapatkan syiling yang disentuh pemain
  checkCoinPickup(playerPos, pickupRadius = 1.2) {
    const collectedList = [];
    for (const c of this.coins) {
      if (!c.collected) {
        if (playerPos.distanceTo(c.mesh.position) < pickupRadius) {
          c.collected = true;
          c.mesh.visible = false;
          c.respawnTimer = 12.0; // Muncul semula selepas 12 saat
          collectedList.push(c);
        }
      }
    }
    return collectedList;
  }

  // Periksa jarak dengan Almari Pakaian Roblox
  isNearWardrobe(playerPos, maxDistance = 2.8) {
    return playerPos.distanceTo(this.wardrobePos) < maxDistance;
  }

  update(delta, time) {
    // Putar syiling pancutan air
    if (this.fountainCoin) {
      this.fountainCoin.rotation.z += delta * 2.0;
      this.fountainCoin.position.y = 3.0 + Math.sin(time * 3) * 0.15;
    }

    // Putar dan animasikan syiling kutipan
    for (const c of this.coins) {
      if (c.collected) {
        c.respawnTimer -= delta;
        if (c.respawnTimer <= 0) {
          c.collected = false;
          c.mesh.visible = true;
        }
      } else {
        c.mesh.rotation.z += delta * 2.5;
        c.mesh.position.y = c.baseY + Math.sin(time * 3 + c.mesh.position.x) * 0.12;
      }
    }

    // Papan tanda almari pakaian
    if (this.wardrobeSprite) {
      this.wardrobeSprite.position.y = 2.8 + Math.sin(time * 3) * 0.08;
    }
  }
}
