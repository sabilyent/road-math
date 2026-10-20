// InputManager.js - Mengendalikan input papan kekunci, tetikus dan virtual joystick

export class InputManager {
  constructor() {
    this.keys = {};
    this.moveVector = { x: 0, z: 0 };
    this.cameraDelta = { x: 0, y: 0 };
    this.isJumping = false;
    this.isInteracting = false;
    this.isBlaster = false;

    this.isMouseDown = false;
    this.lastMouseX = 0;
    this.lastMouseY = 0;

    this.setupKeyboard();
    this.setupMouse();
    this.setupWindowBlur();
  }

  setupKeyboard() {
    window.addEventListener('keydown', (e) => {
      // Jangan ganggu jika pemain sedang menaip dalam input text/modal
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

      this.keys[e.code] = true;
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault(); // Elak browser scroll
      }

      if (e.code === 'Space') {
        this.isJumping = true;
      }
      if (e.code === 'KeyE' || e.code === 'Enter') {
        this.isInteracting = true;
      }
      if (e.code === 'KeyF') {
        this.isBlaster = true;
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
      if (e.code === 'Space') {
        this.isJumping = false;
      }
      if (e.code === 'KeyE' || e.code === 'Enter') {
        this.isInteracting = false;
      }
      if (e.code === 'KeyF') {
        this.isBlaster = false;
      }
    });
  }

  setupMouse() {
    // Putaran kamera apabila klik & heret
    window.addEventListener('pointerdown', (e) => {
      // Hanya terima jika klik di atas canvas permainan (bukan modal/HUD)
      if (e.target.tagName === 'CANVAS') {
        this.isMouseDown = true;
        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;
      }
    });

    window.addEventListener('pointermove', (e) => {
      if (this.isMouseDown) {
        const dx = e.clientX - this.lastMouseX;
        const dy = e.clientY - this.lastMouseY;
        this.cameraDelta.x += dx * 0.005;
        this.cameraDelta.y += dy * 0.005;
        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;
      }
    });

    window.addEventListener('pointerup', () => {
      this.isMouseDown = false;
    });

    window.addEventListener('pointercancel', () => {
      this.isMouseDown = false;
    });
  }

  setupWindowBlur() {
    // Elak input tersangkut bila tetingkap hilang fokus
    window.addEventListener('blur', () => {
      this.keys = {};
      this.moveVector = { x: 0, z: 0 };
      this.isJumping = false;
      this.isInteracting = false;
      this.isBlaster = false;
      this.isMouseDown = false;
    });
  }

  // Dipanggil oleh Virtual Joystick
  setTouchMove(x, z) {
    this.moveVector.x = x;
    this.moveVector.z = z;
  }

  setTouchJump(active) {
    this.isJumping = active;
  }

  setTouchInteract(active) {
    this.isInteracting = active;
  }

  setTouchBlaster(active) {
    this.isBlaster = active;
  }

  // Ambil vector pergerakan terkini
  getMovement() {
    let x = this.moveVector.x;
    let z = this.moveVector.z;

    // Tambah input papan kekunci
    if (this.keys['KeyW'] || this.keys['ArrowUp']) z -= 1;
    if (this.keys['KeyS'] || this.keys['ArrowDown']) z += 1;
    if (this.keys['KeyA'] || this.keys['ArrowLeft']) x -= 1;
    if (this.keys['KeyD'] || this.keys['ArrowRight']) x += 1;

    // Normalisasikan jika bergerak senget
    const len = Math.sqrt(x * x + z * z);
    if (len > 1) {
      x /= len;
      z /= len;
    }

    return { x, z };
  }

  consumeInteract() {
    const was = this.isInteracting;
    this.isInteracting = false;
    return was;
  }

  consumeBlaster() {
    const was = this.isBlaster;
    this.isBlaster = false;
    return was;
  }

  consumeCameraDelta() {
    const delta = { ...this.cameraDelta };
    this.cameraDelta = { x: 0, y: 0 };
    return delta;
  }
}
