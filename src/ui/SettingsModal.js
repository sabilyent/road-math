// SettingsModal.js - Modal tetapan aras pembelajaran, kawalan, dan bantuan permainan

export class SettingsModal {
  constructor(saveManager, audioManager, onLevelChanged, onReset) {
    this.saveManager = saveManager;
    this.audioManager = audioManager;
    this.onLevelChanged = onLevelChanged;
    this.onReset = onReset;

    this.container = document.getElementById('settings-modal-container');
    this.isOpen = false;
  }

  show() {
    this.isOpen = true;
    const mathProfile = this.saveManager.data.mathProfile;

    this.container.innerHTML = `
      <div class="modal-backdrop">
        <div class="settings-card bounce-in">
          <button id="set-close-btn" class="modal-close-btn" aria-label="Tutup">✕</button>

          <div class="set-header">
            <span class="set-icon">⚙️</span>
            <h2 class="set-title">Tetapan & Panduan Bermain</h2>
          </div>

          <div class="set-scroll-area">
            <!-- Pilihan Aras Matematik -->
            <div class="set-section">
              <h3 class="set-subtitle">🎓 Aras Pembelajaran Matematik:</h3>
              <div class="level-select-grid">
                <button class="level-btn ${mathProfile.level === 1 ? 'active' : ''}" data-lvl="1">
                  <strong>Aras 1 (Umur 4-5)</strong>
                  <span>Tambah & Tolak Asas (1-5) dengan Bantuan Visual</span>
                </button>
                <button class="level-btn ${mathProfile.level === 2 ? 'active' : ''}" data-lvl="2">
                  <strong>Aras 2 (Umur 5-6)</strong>
                  <span>Operasi Tambah & Tolak hingga 20</span>
                </button>
                <button class="level-btn ${mathProfile.level === 3 ? 'active' : ''}" data-lvl="3">
                  <strong>Aras 3 (Umur 6-7)</strong>
                  <span>Asas Sifir Darab & Bahagi Mudah</span>
                </button>
              </div>
            </div>

            <!-- Panduan Kawalan -->
            <div class="set-section">
              <h3 class="set-subtitle">🎮 Cara Mengawal Watak:</h3>
              <div class="controls-guide-box">
                <div class="guide-item">
                  <strong>💻 Komputer:</strong>
                  <span>WASD / Anak Panah = Gerak | Space = Lompat | E = Interaksi | F = Blaster | Klik Tetikus = Pusing Kamera</span>
                </div>
                <div class="guide-item">
                  <strong>📱 Telefon / Tablet:</strong>
                  <span>Kayu Bedik (Kiri Bawah) = Gerak | Butang 🦘 = Lompat | Butang 💬 = Tindakan | Butang 🔫 = Blaster</span>
                </div>
              </div>
            </div>

            <!-- Tetapan Set Semula Kemajuan -->
            <div class="set-section reset-section">
              <h3 class="set-subtitle">⚠️ Pengurusan Data:</h3>
              <p>Kemajuan disimpan secara automatik pada peranti ini.</p>
              <button id="btn-reset-save" class="btn-danger-reset">Mula Semula Permainan (Reset)</button>
            </div>
          </div>

          <div class="set-footer">
            <button id="set-done-btn" class="set-btn-done">Tutup Tetapan</button>
          </div>
        </div>
      </div>
    `;

    this.container.classList.remove('hidden');

    // Bind level selection
    const levelBtns = this.container.querySelectorAll('.level-btn');
    levelBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const lvl = parseInt(btn.getAttribute('data-lvl'), 10);
        levelBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        this.saveManager.data.mathProfile.level = lvl;
        this.saveManager.save();
        this.audioManager.playCoin();

        if (this.onLevelChanged) {
          this.onLevelChanged(lvl);
        }
      });
    });

    // Reset button with confirmation
    document.getElementById('btn-reset-save').addEventListener('click', () => {
      const confirmReset = window.confirm('Adakah anda pasti mahu memulakan semula permainan dari awal?');
      if (confirmReset) {
        this.saveManager.reset();
        this.audioManager.playWrong();
        this.close();
        if (this.onReset) this.onReset();
      }
    });

    document.getElementById('set-close-btn').addEventListener('click', () => this.close());
    document.getElementById('set-done-btn').addEventListener('click', () => this.close());
  }

  close() {
    this.container.classList.add('hidden');
    this.isOpen = false;
  }
}
