// HUD.js - Paparan maklumat permainan (Syiling, Tahap, Butang Tindakan, Tetapan)

export class HUD {
  constructor(saveManager, audioManager, onOpenCustomizer, onOpenSettings) {
    this.saveManager = saveManager;
    this.audioManager = audioManager;
    this.onOpenCustomizer = onOpenCustomizer;
    this.onOpenSettings = onOpenSettings;

    this.container = document.getElementById('hud-container');
    this.buildHUD();
    this.updateHUD();
  }

  buildHUD() {
    this.container.innerHTML = `
      <div class="hud-top-bar">
        <!-- Profil & Tahap Pemain -->
        <div class="hud-pill hud-level-pill">
          <span class="level-icon">⭐</span>
          <div class="level-info">
            <span class="level-title">Tahap <span id="hud-level-num">1</span></span>
            <div class="xp-bar-bg">
              <div id="hud-xp-fill" class="xp-bar-fill" style="width: 20%;"></div>
            </div>
          </div>
        </div>

        <!-- Baki Syiling Emas -->
        <div class="hud-pill hud-coin-pill">
          <span class="coin-icon">🪙</span>
          <span id="hud-coin-count" class="coin-count">0</span>
        </div>

        <!-- Butang Cepat (Almari Fesyen & Audio) -->
        <div class="hud-actions-pill">
          <button id="btn-open-wardrobe" class="hud-btn" title="Tukar Pakaian Roblox">👕</button>
          <button id="btn-toggle-music" class="hud-btn" title="Muzik BGM">🎵</button>
          <button id="btn-toggle-sfx" class="hud-btn" title="Kesan Bunyi">🔊</button>
          <button id="btn-open-settings" class="hud-btn" title="Bantuan & Tetapan">⚙️</button>
        </div>
      </div>

      <!-- Notifikasi / Toast Maklum Balas -->
      <div id="hud-toast" class="hud-toast hidden"></div>

      <!-- Petunjuk Interaksi Semasa (Contoh: [E] Buka Pintu) -->
      <div id="hud-prompt" class="hud-prompt hidden">
        <div class="prompt-card">
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
    const player = this.saveManager.data.player;
    document.getElementById('hud-coin-count').textContent = player.coins;
    document.getElementById('hud-level-num').textContent = player.level;

    const xpPercent = Math.min(100, (player.xp % 100));
    document.getElementById('hud-xp-fill').style.width = `${xpPercent}%`;
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

  showPrompt(text, icon = '💬') {
    const prompt = document.getElementById('hud-prompt');
    document.getElementById('prompt-text').textContent = text;
    document.getElementById('prompt-icon').textContent = icon;
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
