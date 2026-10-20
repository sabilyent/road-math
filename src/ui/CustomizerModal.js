// CustomizerModal.js - Almari Penyesuaian Avatar Roblox untuk Kanak-Kanak

export class CustomizerModal {
  constructor(saveManager, audioManager, onAvatarUpdated) {
    this.saveManager = saveManager;
    this.audioManager = audioManager;
    this.onAvatarUpdated = onAvatarUpdated;

    this.container = document.getElementById('customizer-modal-container');
    this.isOpen = false;
  }

  show() {
    this.isOpen = true;
    const avatar = this.saveManager.data.player.avatar;

    const shirtColors = [
      { name: 'Biru Cerah', hex: '#0288D1' },
      { name: 'Merah Berani', hex: '#D32F2F' },
      { name: 'Hijau Daun', hex: '#2E7D32' },
      { name: 'Kuning Mentari', hex: '#FBC02D' },
      { name: 'Ungu Ajaib', hex: '#7B1FA2' },
      { name: 'Jingga Segar', hex: '#F57C00' },
      { name: 'Hitam Bergaya', hex: '#212121' },
      { name: 'Merah Jambu', hex: '#EC407A' }
    ];

    const pantsColors = [
      { name: 'Jeans Biru', hex: '#1976D2' },
      { name: 'Kelabu Gelap', hex: '#37474F' },
      { name: 'Coklat Khaki', hex: '#8D6E63' },
      { name: 'Merah Crimson', hex: '#C62828' },
      { name: 'Hijau Zaitun', hex: '#558B2F' }
    ];

    const skinTones = [
      { name: 'Cerah', hex: '#FFE0B2' },
      { name: 'Peach', hex: '#FFCC80' },
      { name: 'Sawo Matang', hex: '#D7CCC8' },
      { name: 'Karamel', hex: '#BCAAA4' }
    ];

    const hats = [
      { id: 'propeller', name: 'Topi Kipas Berputar', icon: '🧢' },
      { id: 'crown', name: 'Mahkota Emas Diraja', icon: '👑' },
      { id: 'party', name: 'Topi Parti Ceria', icon: '🥳' },
      { id: 'ears', name: 'Telinga Kucing Comel', icon: '🐱' },
      { id: 'none', name: 'Tiada Topi', icon: '❌' }
    ];

    this.container.innerHTML = `
      <div class="modal-backdrop">
        <div class="customizer-card bounce-in">
          <button id="cust-close-btn" class="modal-close-btn" aria-label="Tutup">✕</button>

          <div class="cust-header">
            <span class="cust-icon">👕</span>
            <h2 class="cust-title">Almari Fesyen Roblox</h2>
          </div>

          <div class="cust-scroll-area">
            <!-- Pilihan Warna Baju -->
            <div class="cust-section">
              <label class="cust-label">Warna Baju (Shirt):</label>
              <div class="color-swatches-grid">
                ${shirtColors.map((c) => `
                  <button class="color-swatch-btn ${avatar.shirt === c.hex ? 'active' : ''}" 
                          style="background-color: ${c.hex};" 
                          data-type="shirt" 
                          data-hex="${c.hex}" 
                          title="${c.name}"></button>
                `).join('')}
              </div>
            </div>

            <!-- Pilihan Warna Seluar -->
            <div class="cust-section">
              <label class="cust-label">Warna Seluar (Pants):</label>
              <div class="color-swatches-grid">
                ${pantsColors.map((c) => `
                  <button class="color-swatch-btn ${avatar.pants === c.hex ? 'active' : ''}" 
                          style="background-color: ${c.hex};" 
                          data-type="pants" 
                          data-hex="${c.hex}" 
                          title="${c.name}"></button>
                `).join('')}
              </div>
            </div>

            <!-- Pilihan Tona Kulit -->
            <div class="cust-section">
              <label class="cust-label">Tona Kulit (Skin):</label>
              <div class="color-swatches-grid">
                ${skinTones.map((c) => `
                  <button class="color-swatch-btn ${avatar.skin === c.hex ? 'active' : ''}" 
                          style="background-color: ${c.hex};" 
                          data-type="skin" 
                          data-hex="${c.hex}" 
                          title="${c.name}"></button>
                `).join('')}
              </div>
            </div>

            <!-- Pilihan Topi & Aksesori -->
            <div class="cust-section">
              <label class="cust-label">Aksesori Kepala (Hat):</label>
              <div class="hats-options-grid">
                ${hats.map((h) => `
                  <button class="hat-option-btn ${avatar.hat === h.id ? 'active' : ''}" data-hat="${h.id}">
                    <span class="hat-icon">${h.icon}</span>
                    <span class="hat-name">${h.name}</span>
                  </button>
                `).join('')}
              </div>
            </div>
          </div>

          <div class="cust-footer">
            <button id="cust-done-btn" class="cust-btn-done">Selesai Berfesyen! ✨</button>
          </div>
        </div>
      </div>
    `;

    this.container.classList.remove('hidden');

    // Bind color buttons
    const swatches = this.container.querySelectorAll('.color-swatch-btn');
    swatches.forEach((btn) => {
      btn.addEventListener('click', () => {
        const type = btn.getAttribute('data-type');
        const hex = btn.getAttribute('data-hex');

        // Update active class
        this.container.querySelectorAll(`.color-swatch-btn[data-type="${type}"]`).forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const update = {};
        update[type] = hex;
        this.saveManager.updateAvatar(update);
        this.audioManager.playCoin();

        if (this.onAvatarUpdated) {
          this.onAvatarUpdated(this.saveManager.data.player.avatar);
        }
      });
    });

    // Bind hat buttons
    const hatBtns = this.container.querySelectorAll('.hat-option-btn');
    hatBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const hatId = btn.getAttribute('data-hat');

        hatBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        this.saveManager.updateAvatar({ hat: hatId });
        this.audioManager.playCoin();

        if (this.onAvatarUpdated) {
          this.onAvatarUpdated(this.saveManager.data.player.avatar);
        }
      });
    });

    document.getElementById('cust-close-btn').addEventListener('click', () => this.close());
    document.getElementById('cust-done-btn').addEventListener('click', () => this.close());
  }

  close() {
    this.container.classList.add('hidden');
    this.isOpen = false;
  }
}
