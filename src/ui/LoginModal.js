// LoginModal.js - Modal Login / Tukar Pemain Mudah (Hanya Masukkan Username)

export class LoginModal {
  constructor(saveManager, audioManager, onLoginSuccess) {
    this.saveManager = saveManager;
    this.audioManager = audioManager;
    this.onLoginSuccess = onLoginSuccess;

    this.container = document.getElementById('login-modal-container');
    this.isOpen = false;
  }

  show(canClose = true) {
    this.isOpen = true;
    const existingUsers = this.saveManager.getAllUsernames();
    const currentName = this.saveManager.currentUsername || '';

    this.container.innerHTML = `
      <div class="modal-backdrop">
        <div class="login-card bounce-in">
          ${canClose ? '<button id="login-close-btn" class="modal-close-btn" aria-label="Tutup">✕</button>' : ''}

          <div class="login-header">
            <span class="login-icon">🎮</span>
            <h2 class="login-title">Siapakah Sedang Bermain?</h2>
            <p class="login-subtitle">Masukkan nama anda tanpa pendaftaran rumit untuk menyimpan skor ranking anda!</p>
          </div>

          <!-- Input Nama Baharu -->
          <form id="login-form" class="login-form">
            <div class="login-input-group">
              <label for="username-input">Nama / Username Anda:</label>
              <input type="text" id="username-input" class="username-input" 
                     placeholder="Contoh: Ali, Aisyah, Adam..." 
                     maxlength="15" 
                     value="${currentName !== 'Hero' ? currentName : ''}" required />
            </div>
            <button type="submit" class="login-submit-btn">Mula Main Sesi Anda! 🚀</button>
          </form>

          ${existingUsers.length > 0 ? `
            <div class="existing-profiles-section">
              <span class="existing-label">Atau pilih profil sedia ada:</span>
              <div class="profiles-list-grid">
                ${existingUsers.map((u) => {
                  const profile = this.saveManager.rawStore.users[u];
                  return `
                    <button class="profile-chip-btn ${u === currentName ? 'active-chip' : ''}" data-name="${u}">
                      <span class="chip-avatar">👤</span>
                      <div class="chip-info">
                        <strong>${u}</strong>
                        <small>🏆 ${profile.points || 0} pts | 🪙 ${profile.coins || 0}</small>
                      </div>
                    </button>
                  `;
                }).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `;

    this.container.classList.remove('hidden');

    const input = document.getElementById('username-input');
    input.focus();

    // Submit form
    document.getElementById('login-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const name = input.value.trim();
      if (name) {
        this.performLogin(name);
      }
    });

    // Pilih daripada profil sedia ada
    const chips = this.container.querySelectorAll('.profile-chip-btn');
    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        const name = chip.getAttribute('data-name');
        if (name) {
          this.performLogin(name);
        }
      });
    });

    if (canClose) {
      document.getElementById('login-close-btn')?.addEventListener('click', () => this.close());
    }
  }

  performLogin(name) {
    this.saveManager.login(name);
    this.audioManager.playCoin();
    this.close();

    if (this.onLoginSuccess) {
      this.onLoginSuccess(this.saveManager.user);
    }
  }

  close() {
    this.container.classList.add('hidden');
    this.isOpen = false;
  }
}
