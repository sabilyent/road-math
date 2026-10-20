import * as THREE from 'three';

export class FoodStreet {
  constructor(scene) {
    this.scene = scene;
    this.stalls = [];
    this.group = new THREE.Group();

    this.buildStalls();
    this.scene.add(this.group);
  }

  buildStalls() {
    const stallsData = [
      {
        id: 'stall_icecream',
        name: 'Aiskrim Pelangi Pak Mat',
        item: { name: 'Aiskrim Pelangi', cost: 10, buff: 'speed', emoji: '🍦', desc: 'Larian Laju (+50% Laju)!' },
        pos: new THREE.Vector3(-18, 0, -8),
        color: 0xF48FB1, // Pink pastel
        awningColor: 0x80DEEA, // Cyan pastel
        propType: 'icecream'
      },
      {
        id: 'stall_donut',
        name: 'Donut Ceria Kak Siti',
        item: { name: 'Donut Ceria', cost: 15, buff: 'jump', emoji: '🍩', desc: 'Lompatan Super (+50% Tinggi)!' },
        pos: new THREE.Vector3(-18, 0, 0),
        color: 0xFFD54F, // Yellow
        awningColor: 0x8D6E63, // Brown chocolate
        propType: 'donut'
      },
      {
        id: 'stall_burger',
        name: 'Burger Juara',
        item: { name: 'Burger Juara', cost: 20, buff: 'sparkle', emoji: '🍔', desc: 'Jejak Bintang Berkilau!' },
        pos: new THREE.Vector3(-18, 0, 8),
        color: 0xEF5350, // Red
        awningColor: 0xFFFFFF,
        propType: 'burger'
      }
    ];

    stallsData.forEach((data) => {
      const stallGroup = new THREE.Group();
      stallGroup.position.copy(data.pos);

      // Kiosk Asas
      const baseGeo = new THREE.BoxGeometry(3.5, 2.2, 2.5);
      const baseMat = new THREE.MeshLambertMaterial({ color: data.color });
      const base = new THREE.Mesh(baseGeo, baseMat);
      base.position.y = 1.1;
      base.castShadow = true;
      stallGroup.add(base);

      // Bumbung / Awning Berjalur
      const roofGeo = new THREE.ConeGeometry(2.6, 1.2, 4);
      const roofMat = new THREE.MeshLambertMaterial({ color: data.awningColor });
      const roof = new THREE.Mesh(roofGeo, roofMat);
      roof.position.y = 2.8;
      roof.rotation.y = Math.PI / 4;
      stallGroup.add(roof);

      // Meja Kaunter
      const counterGeo = new THREE.BoxGeometry(2.8, 0.9, 0.6);
      const counterMat = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
      const counter = new THREE.Mesh(counterGeo, counterMat);
      counter.position.set(0, 0.9, 1.35);
      stallGroup.add(counter);

      // Props gergasi di atas bumbung
      let propMesh = null;
      if (data.propType === 'icecream') {
        propMesh = new THREE.Group();
        // Kon
        const coneGeo = new THREE.ConeGeometry(0.35, 0.9, 12);
        const coneMat = new THREE.MeshLambertMaterial({ color: 0xD7CCC8 });
        const cone = new THREE.Mesh(coneGeo, coneMat);
        cone.rotation.x = Math.PI;
        propMesh.add(cone);
        // Scoop Aiskrim
        const scoopGeo = new THREE.SphereGeometry(0.42, 12, 12);
        const scoopMat = new THREE.MeshLambertMaterial({ color: 0xFF4081 });
        const scoop = new THREE.Mesh(scoopGeo, scoopMat);
        scoop.position.y = 0.55;
        propMesh.add(scoop);
      } else if (data.propType === 'donut') {
        const torusGeo = new THREE.TorusGeometry(0.55, 0.24, 12, 24);
        const donutMat = new THREE.MeshLambertMaterial({ color: 0x5D4037 });
        propMesh = new THREE.Mesh(torusGeo, donutMat);
      } else if (data.propType === 'burger') {
        propMesh = new THREE.Group();
        const bunMat = new THREE.MeshLambertMaterial({ color: 0xFFA726 });
        const pattyMat = new THREE.MeshLambertMaterial({ color: 0x4E342E });
        const cheeseMat = new THREE.MeshLambertMaterial({ color: 0xFFEB3B });

        const bottomBun = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.15, 16), bunMat);
        const patty = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.52, 0.12, 16), pattyMat);
        patty.position.y = 0.14;
        const cheese = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.05, 0.7), cheeseMat);
        cheese.position.y = 0.22;
        cheese.rotation.y = 0.4;
        const topBun = new THREE.Mesh(new THREE.SphereGeometry(0.52, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), bunMat);
        topBun.position.y = 0.25;

        propMesh.add(bottomBun, patty, cheese, topBun);
      }

      if (propMesh) {
        propMesh.position.y = 3.9;
        stallGroup.add(propMesh);
      }

      // Papan Tanda Sprite Interaksi
      const signCanvas = document.createElement('canvas');
      signCanvas.width = 256;
      signCanvas.height = 100;
      const sctx = signCanvas.getContext('2d');
      sctx.fillStyle = '#FF9800';
      sctx.roundRect(4, 4, 248, 92, 18);
      sctx.fill();
      sctx.fillStyle = '#FFFFFF';
      sctx.font = 'bold 30px Arial';
      sctx.textAlign = 'center';
      sctx.textBaseline = 'middle';
      sctx.fillText(`${data.item.emoji} Beli`, 128, 50);

      const signTex = new THREE.CanvasTexture(signCanvas);
      const signSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: signTex }));
      signSprite.position.set(0, 2.5, 1.8);
      signSprite.scale.set(1.4, 0.55, 1);
      stallGroup.add(signSprite);

      this.group.add(stallGroup);

      this.stalls.push({
        id: data.id,
        name: data.name,
        item: data.item,
        group: stallGroup,
        pos: data.pos,
        propMesh: propMesh,
        sprite: signSprite
      });
    });
  }

  getClosestStall(playerPos, maxDistance = 3.5) {
    let closest = null;
    let minDist = maxDistance;

    for (const stall of this.stalls) {
      // Periksa jarak dari hadapan kaunter
      const counterPos = new THREE.Vector3(stall.pos.x, stall.pos.y, stall.pos.z + 1.2);
      const d = playerPos.distanceTo(counterPos);
      if (d < minDist) {
        minDist = d;
        closest = stall;
      }
    }
    return closest;
  }

  update(delta, time) {
    // Putar prop gergasi di atas bumbung
    for (const stall of this.stalls) {
      if (stall.propMesh) {
        stall.propMesh.rotation.y += delta * 1.5;
      }
      // Sedikit pantulan papan tanda
      stall.sprite.position.y = 2.5 + Math.sin(time * 3) * 0.08;
    }
  }
}
