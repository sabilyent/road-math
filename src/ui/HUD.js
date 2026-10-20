// HUD.js - Paparan maklumat permainan (Username, Points Ranking, Syiling, Tahap, Butang Cepat)

export class HUD {
  constructor(saveManager, audioManager, onOpenCustomizer, onOpenSettings, onOpenLeaderboard, onOpenLogin) {
    this.saveManager = saveManager;
    this.audioManager = audioManager;
    this.onOpenCustomizer = onOpenCustomizer;
    this.onOpenSettings = onOpenSettings;
    this.onOpenLeaderboard = onOpenLeaderboard;
    this.onOpenLogin = onOpenLogin;

    this.container = document.getElementById('hud-container');
    this.buildHUD();
    this.updateHUD();
  }

  buildHUD() {
    this.container.innerHTML = `
      <div class="hud-top-bar">
        <!-- Profil Pemain & Username Semasa -->
        <div class="hud-pill hud-user-pill" id="hud-user-pill" title="Klik untuk tukar sesi pemain / Logout">
          <span class="user-avatar-icon">👤</span>
          <div class="user-text-col">
            <span id="hud-username-display" class="hud-username">Hero</span>
            <small class="user-switch-hint">Tukar Sesi ↻</small>
          </div>
        </div>

        <!-- Baki Point (Untuk Ranking) & Syiling (Untuk Belanja) -->
        <div class="hud-stats-group">
          <!-- Point (Ranking) -->
          <div class="hud-pill hud-points-pill" title="Mata Point untuk Ranking!">
            <span class="points-icon">🏆</span>
            <div class="points-text-col">
              <span id="hud-points-count" class="points-count">0</span>
              <small class="points-label">Point</small>
            </div>
          </div>

          <!-- Syiling (Kedai) -->
          <div class="hud-pill hud-coin-pill" title="Syiling untuk berbelanja di kedai!">
            <span class="coin-icon">🪙</span>
            <div class="coins-text-col">
              <span id="hud-coin-count" class="coin-count">0</span>
              <small class="coins-label">Syiling</small>
            </div>
          </div>
        </div>

        <!-- Butang Tindakan Cepat (Ranking, Almari, Tetapan, Audio) -->
        <div class="hud-actions-pill">
          <button id="btn-open-leaderboard" class="hud-btn hud-btn-leaderboard" title="Papan Ranking Math City">🏆</button>
          <button id="btn-open-wardrobe" class="hud-btn" title="Tukar Pakaian Roblox">👕</button>
          <button id="btn-toggle-music" class="hud-btn" title="Muzik BGM">🎵</button>
          <button id="btn-toggle-sfx" class="hud-btn" title="Kesan Bunyi">🔊</button>
          <button id="btn-open-settings" class="hud-btn" title="Bantuan & Tetapan">⚙️</button>
        </div>
      </div>

      <!-- Notifikasi / Toast Maklum Balas -->
      <div id="hud-toast" class="hud-toast hidden"></div>

      <!-- Petunjuk Interaksi Semasa / Auto-Aim Lockon -->
      <div id="hud-prompt" class="hud-prompt hidden">
        <div class="prompt-card" id="prompt-card">
          <span id="prompt-icon" class="prompt-icon">💬</span>
          <span id="prompt-text" class="prompt-text">Tekan E untuk berinteraksi</span>
        </div>
      </div>

      <!-- Banner Buff Makanan Aktif -->
      <div id="hud-buff" class="hud-buff hidden">
        <span id="buff-icon">🍦</span>
        <span id="buff-text">Larian Laju Aktif!</span>
      </div>
    `;

    // Event listeners
    document.getElementById('hud-user-pill').addEventListener('click', () => {
      this.audioManager.playCoin();
      if (this.onOpenLogin) this.onOpenLogin();
    });

    document.getElementById('btn-open-leaderboard').addEventListener('click', () => {
      this.audioManager.playCoin();
      if (this.onOpenLeaderboard) this.onOpenLeaderboard();
    });

    document.getElementById('btn-open-wardrobe').addEventListener('click', () => {
      this.audioManager.playCoin();
      if (this.onOpenCustomizer) this.onOpenCustomizer();
    });

    document.getElementById('btn-toggle-music').addEventListener('click', (e) => {
      const active = this.audioManager.toggleMusic();
      e.target.style.opacity = active ? '1' : '0.45';
      this.showToast(active ? 'Muzik diaktifkan 🎵' : 'Muzik dimatikan 🔇');
    });

    document.getElementById('btn-toggle-sfx').addEventListener('click', (e) => {
      const active = this.audioManager.toggleSFX();
      e.target.style.opacity = active ? '1' : '0.45';
      this.showToast(active ? 'Kesan bunyi diaktifkan 🔊' : 'Kesan bunyi dimatikan 🔇');
    });

    document.getElementById('btn-open-settings').addEventListener('click', () => {
      this.audioManager.playCoin();
      if (this.onOpenSettings) this.onOpenSettings();
    });
  }

  updateHUD() {
    const user = this.saveManager.user;
    document.getElementById('hud-username-display').textContent = user.username || 'Hero';
    document.getElementById('hud-points-count').textContent = user.points || 0;
    document.getElementById('hud-coin-count').textContent = user.coins || 0;
  }

  showToast(message, duration = 2500) {
    const toast = document.getElementById('hud-toast');
    toast.textContent = message;
    toast.classList.remove('hidden');
    toast.classList.add('fade-in');

    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      toast.classList.add('hidden');
    }, duration);
  }

  showPrompt(text, icon = '💬', isAim = false) {
    const prompt = document.getElementById('hud-prompt');
    const card = document.getElementById('prompt-card');
    document.getElementById('prompt-text').textContent = text;
    document.getElementById('prompt-icon').textContent = icon;

    if (isAim) {
      card.classList.add('prompt-aim-locked');
    } else {
      card.classList.remove('prompt-aim-locked');
    }

    prompt.classList.remove('hidden');
  }

  hidePrompt() {
    const prompt = document.getElementById('hud-prompt');
    prompt.classList.add('hidden');
  }

  showBuff(text, icon) {
    const buff = document.getElementById('hud-buff');
    document.getElementById('buff-text').textContent = text;
    document.getElementById('buff-icon').textContent = icon;
    buff.classList.remove('hidden');
  }

  hideBuff() {
    const buff = document.getElementById('hud-buff');
    buff.classList.add('hidden');
  }
}
