// ShopModal.js - Modal Pembelian Makanan & Cabaran Pengiraan Baki (Math Shopping)

export class ShopModal {
  constructor(saveManager, audioManager, mathEngine, onPurchased) {
    this.saveManager = saveManager;
    this.audioManager = audioManager;
    this.mathEngine = mathEngine;
    this.onPurchased = onPurchased;

    this.container = document.getElementById('shop-modal-container');
    this.currentStall = null;
    this.isOpen = false;
  }

  show(stall) {
    this.currentStall = stall;
    this.isOpen = true;

    const item = stall.item;
    const playerCoins = this.saveManager.data.player.coins;
    const canAfford = playerCoins >= item.cost;

    let question = null;
    if (canAfford) {
      question = this.mathEngine.generateShoppingQuestion(item.cost, playerCoins);
    }

    this.container.innerHTML = `
      <div class="modal-backdrop">
        <div class="shop-card bounce-in">
          <button id="shop-close-btn" class="modal-close-btn" aria-label="Tutup">✕</button>

          <div class="shop-header">
            <span class="shop-stall-name">${stall.name}</span>
            <div class="shop-item-preview">
              <span class="shop-item-emoji">${item.emoji}</span>
              <div class="shop-item-details">
                <h3 class="shop-item-title">${item.name}</h3>
                <p class="shop-item-desc">${item.desc}</p>
                <div class="shop-cost-tag">Harga: 🪙 <strong>${item.cost}</strong> Syiling</div>
              </div>
            </div>
          </div>

          <div class="shop-status-box">
            <span>Baki Syiling Anda: 🪙 <strong>${playerCoins}</strong></span>
          </div>

          ${canAfford ? `
            <!-- Cabaran Pengiraan Baki Wang -->
            <div class="shop-challenge-box">
              <p class="challenge-instruction">💡 Selesaikan kiraan baki untuk melengkapkan pembelian:</p>
              <div class="shop-formula">${question.textFormula}</div>
              <div id="shop-feedback-msg" class="math-feedback-msg">Pilih jawapan baki anda:</div>

              <div class="math-choices-grid">
                ${question.choices.map((choice, idx) => `
                  <button class="choice-btn choice-color-${idx % 4} shop-choice-btn" data-value="${choice}">
                    ${choice}
                  </button>
                `).join('')}
              </div>
            </div>
          ` : `
            <div class="shop-not-enough">
              <p>😔 Alamak, syiling anda tidak mencukupi!</p>
              <p>Terokai bandar atau cabar zombie untuk mengumpul lebih banyak syiling!</p>
              <button id="shop-ok-btn" class="shop-btn-cancel">Kembali Main</button>
            </div>
          `}
        </div>
      </div>
    `;

    this.container.classList.remove('hidden');

    document.getElementById('shop-close-btn').addEventListener('click', () => {
      this.close();
    });

    if (!canAfford) {
      document.getElementById('shop-ok-btn').addEventListener('click', () => {
        this.close();
      });
      return;
    }

    // Bind choices
    const buttons = this.container.querySelectorAll('.shop-choice-btn');
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const val = parseInt(btn.getAttribute('data-value'), 10);
        this.handleAnswer(val, question.answer, btn, buttons, item);
      });
    });
  }

  handleAnswer(selectedVal, correctVal, clickedBtn, allButtons, item) {
    const feedback = document.getElementById('shop-feedback-msg');

    if (selectedVal === correctVal) {
      clickedBtn.classList.add('btn-correct');
      feedback.textContent = '🎉 Pembelian Berjaya! Selamat Menikmati! 🎉';
      feedback.style.color = '#2E7D32';

      allButtons.forEach((b) => b.disabled = true);

      // Tolak syiling pemain secara selamat
      this.saveManager.spendCoins(item.cost);
      this.audioManager.playPurchase();

      setTimeout(() => {
        this.close();
        if (this.onPurchased) {
          this.onPurchased(item);
        }
      }, 950);

    } else {
      clickedBtn.classList.add('btn-wrong');
      clickedBtn.disabled = true;
      feedback.textContent = `💡 Kiraan baki belum tepat. Cuba tolak ${item.cost} daripada baki anda!`;
      feedback.style.color = '#E65100';
      this.audioManager.playWrong();
    }
  }

  close() {
    this.container.classList.add('hidden');
    this.isOpen = false;
    this.currentStall = null;
  }
}
