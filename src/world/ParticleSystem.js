import * as THREE from 'three';

export class ParticleSystem {
  constructor(scene) {
    this.scene = scene;
    this.particles = [];
    this.laserBeams = [];

    // Shared particle geometries & materials for efficiency
    this.starGeo = new THREE.DodecahedronGeometry(0.18, 0);
    this.coinGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.06, 12);

    this.colors = [0xFFD700, 0xFF4081, 0x00E676, 0x2979FF, 0xFF9100, 0xEEFF41];
  }

  // Pancaran bintang dan confetti berwarna-warni
  spawnVictoryBurst(position, count = 25) {
    for (let i = 0; i < count; i++) {
      const color = this.colors[Math.floor(Math.random() * this.colors.length)];
      const mat = new THREE.MeshBasicMaterial({ color: color });
      const mesh = new THREE.Mesh(this.starGeo, mat);

      mesh.position.copy(position);
      mesh.position.y += 1.0;

      const angle = Math.random() * Math.PI * 2;
      const speed = 2.5 + Math.random() * 4.5;
      const vy = 3.5 + Math.random() * 5.0;

      this.particles.push({
        mesh: mesh,
        vx: Math.cos(angle) * speed,
        vy: vy,
        vz: Math.sin(angle) * speed,
        rotSpeed: (Math.random() - 0.5) * 15,
        life: 1.0,
        decay: 0.6 + Math.random() * 0.4
      });

      this.scene.add(mesh);
    }
  }

  // Pancaran syiling emas bertaburan
  spawnCoinBurst(position, count = 5) {
    for (let i = 0; i < count; i++) {
      const mat = new THREE.MeshLambertMaterial({ color: 0xFFC107 });
      const mesh = new THREE.Mesh(this.coinGeo, mat);

      mesh.position.copy(position);
      mesh.position.y += 0.8;

      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 2.5;

      this.particles.push({
        mesh: mesh,
        vx: Math.cos(angle) * speed,
        vy: 3.0 + Math.random() * 3.0,
        vz: Math.sin(angle) * speed,
        rotSpeed: 8,
        life: 1.0,
        decay: 0.5
      });

      this.scene.add(mesh);
    }
  }

  // Pancaran laser blaster dari avatar ke zombie
  spawnBlasterBeam(fromPos, toPos) {
    const points = [
      new THREE.Vector3(fromPos.x, fromPos.y + 1.2, fromPos.z),
      new THREE.Vector3(toPos.x, toPos.y + 1.2, toPos.z)
    ];

    const curve = new THREE.CatmullRomCurve3(points);
    const geo = new THREE.TubeGeometry(curve, 8, 0.1, 8, false);
    const mat = new THREE.MeshBasicMaterial({ color: 0x00E5FF, transparent: true, opacity: 0.9 });
    const beam = new THREE.Mesh(geo, mat);

    this.scene.add(beam);
    this.laserBeams.push({
      mesh: beam,
      life: 0.28
    });
  }

  update(delta) {
    // Kemaskini zarah
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= p.decay * delta;

      p.mesh.position.x += p.vx * delta;
      p.mesh.position.y += p.vy * delta;
      p.mesh.position.z += p.vz * delta;

      p.vy -= 9.8 * delta; // Graviti
      p.mesh.rotation.x += p.rotSpeed * delta;
      p.mesh.rotation.y += p.rotSpeed * delta;

      const scale = Math.max(0, p.life);
      p.mesh.scale.set(scale, scale, scale);

      if (p.life <= 0) {
        this.scene.remove(p.mesh);
        p.mesh.geometry.dispose();
        p.mesh.material.dispose();
        this.particles.splice(i, 1);
      }
    }

    // Kemaskini pancaran laser
    for (let i = this.laserBeams.length - 1; i >= 0; i--) {
      const b = this.laserBeams[i];
      b.life -= delta;
      b.mesh.material.opacity = b.life * 3;
      if (b.life <= 0) {
        this.scene.remove(b.mesh);
        b.mesh.geometry.dispose();
        b.mesh.material.dispose();
        this.laserBeams.splice(i, 1);
      }
    }
  }
}
