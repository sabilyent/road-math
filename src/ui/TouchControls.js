// TouchControls.js - Kawalan Virtual Joystick dan butang sentuh untuk mobile & tablet

export class TouchControls {
  constructor(inputManager, audioManager) {
    this.inputManager = inputManager;
    this.audioManager = audioManager;
    this.container = document.getElementById('touch-controls-container');

    this.joystickActive = false;
    this.joystickPointerId = null;
    this.basePos = { x: 0, y: 0 };
    this.maxRadius = 48; // Had radius gerak kayu bedik

    this.init();
  }

  init() {
    this.container.innerHTML = `
      <!-- Virtual Joystick Zon Kiri Bawah -->
      <div id="joystick-zone" class="joystick-zone">
        <div id="joystick-base" class="joystick-base">
          <div id="joystick-knob" class="joystick-knob"></div>
        </div>
      </div>

      <!-- Butang Tindakan Kanan Bawah -->
      <div class="touch-actions-zone">
        <button id="btn-touch-blaster" class="touch-btn btn-blaster" title="Tembak Soalan">
          <span>🔫</span>
          <label>Blaster</label>
        </button>
        <button id="btn-touch-interact" class="touch-btn btn-interact" title="Interaksi">
          <span>💬</span>
          <label>Tindakan</label>
        </button>
        <button id="btn-touch-jump" class="touch-btn btn-jump" title="Lompat">
          <span>🦘</span>
          <label>Lompat</label>
        </button>
      </div>
    `;

    this.setupJoystick();
    this.setupActionButtons();

    // Tunjukkan jika peranti sentuh
    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    if (!isTouch) {
      // Pada desktop, kita kekalkan ia secara lembut atau tersembunyi kecuali diaktifkan
      this.container.classList.add('desktop-soft');
    }
  }

  setupJoystick() {
    const zone = document.getElementById('joystick-zone');
    const base = document.getElementById('joystick-base');
    const knob = document.getElementById('joystick-knob');

    const handlePointerDown = (e) => {
      if (this.joystickActive) return;
      this.joystickActive = true;
      this.joystickPointerId = e.pointerId;

      const rect = base.getBoundingClientRect();
      this.basePos = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };

      zone.setPointerCapture(e.pointerId);
      this.updateKnob(e.clientX, e.clientY, knob);
    };

    const handlePointerMove = (e) => {
      if (!this.joystickActive || e.pointerId !== this.joystickPointerId) return;
      this.updateKnob(e.clientX, e.clientY, knob);
    };

    const handlePointerUp = (e) => {
      if (e.pointerId !== this.joystickPointerId) return;
      this.joystickActive = false;
      this.joystickPointerId = null;

      // Reset knob ke tengah
      knob.style.transform = `translate(0px, 0px)`;
      this.inputManager.setTouchMove(0, 0);
    };

    zone.addEventListener('pointerdown', handlePointerDown);
    zone.addEventListener('pointermove', handlePointerMove);
    zone.addEventListener('pointerup', handlePointerUp);
    zone.addEventListener('pointercancel', handlePointerUp);
  }

  updateKnob(clientX, clientY, knob) {
    let dx = clientX - this.basePos.x;
    let dy = clientY - this.basePos.y;
    const distance = Math.hypot(dx, dy);

    if (distance > this.maxRadius) {
      const angle = Math.atan2(dy, dx);
      dx = Math.cos(angle) * this.maxRadius;
      dy = Math.sin(angle) * this.maxRadius;
    }

    knob.style.transform = `translate(${dx}px, ${dy}px)`;

    // Normalisasi input (-1 hingga 1)
    const normX = dx / this.maxRadius;
    const normZ = dy / this.maxRadius;
    this.inputManager.setTouchMove(normX, normZ);
  }

  setupActionButtons() {
    const btnJump = document.getElementById('btn-touch-jump');
    const btnInteract = document.getElementById('btn-touch-interact');
    const btnBlaster = document.getElementById('btn-touch-blaster');

    // Jump
    btnJump.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      this.inputManager.setTouchJump(true);
      this.audioManager.playJump();
    });
    btnJump.addEventListener('pointerup', () => this.inputManager.setTouchJump(false));
    btnJump.addEventListener('pointercancel', () => this.inputManager.setTouchJump(false));

    // Interact
    btnInteract.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      this.inputManager.setTouchInteract(true);
    });

    // Blaster
    btnBlaster.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      this.inputManager.setTouchBlaster(true);
    });
  }
}
