// MathModal.js - Modal cabaran soalan matematik dengan bantuan visual dan butang pilihan mesra kanak-kanak

export class MathModal {
  constructor(audioManager, onAnswered) {
    this.audioManager = audioManager;
    this.onAnswered = onAnswered;
    this.container = document.getElementById('math-modal-container');
    this.currentQuestion = null;
    this.contextData = null;
    this.isOpen = false;
  }

  show(question, contextData = {}) {
    this.currentQuestion = question;
    this.contextData = contextData;
    this.isOpen = true;

    const titleText = contextData.title || 'Cabaran Matematik Pintar! 🌟';

    this.container.innerHTML = `
      <div class="modal-backdrop">
        <div class="math-card bounce-in">
          <!-- Butang Tutup -->
          <button id="modal-close-btn" class="modal-close-btn" aria-label="Tutup">✕</button>

          <!-- Tajuk & Ikon -->
          <div class="math-modal-header">
            <span class="math-header-icon">${contextData.icon || '🎯'}</span>
            <h2 class="math-header-title">${titleText}</h2>
          </div>

          <!-- Formula Soalan Besar -->
          <div class="math-formula-box">
            <span class="math-formula-text">${question.textFormula}</span>
          </div>

          <!-- Bantuan Visual Emoji untuk Kiraan -->
          <div class="math-visual-aid">
            <span class="visual-aid-content">${question.visualAid}</span>
          </div>

          <!-- Mesej Maklum Balas / Petunjuk -->
          <div id="math-feedback-msg" class="math-feedback-msg">Pilih jawapan yang betul:</div>

          <!-- Pilihan Jawapan (Butang Besar Berwarna) -->
          <div class="math-choices-grid">
            ${question.choices.map((choice, idx) => `
              <button class="choice-btn choice-color-${idx % 4}" data-value="${choice}">
                ${choice}
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    this.container.classList.remove('hidden');

    // Bind event butang pilihan
    const buttons = this.container.querySelectorAll('.choice-btn');
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const selectedValue = parseInt(btn.getAttribute('data-value'), 10);
        this.handleChoice(selectedValue, btn, buttons);
      });
    });

    document.getElementById('modal-close-btn').addEventListener('click', () => {
      this.close();
    });
  }

  handleChoice(selectedValue, clickedBtn, allButtons) {
    const feedback = document.getElementById('math-feedback-msg');

    if (selectedValue === this.currentQuestion.answer) {
      // JAWAPAN BETUL!
      clickedBtn.classList.add('btn-correct');
      feedback.textContent = '🎉 TAHNIAH! JAWAPAN TEPAT! 🎉';
      feedback.style.color = '#2E7D32';
      this.audioManager.playCorrect();

      // Lumpuhkan butang lain untuk elak spam
      allButtons.forEach((b) => b.disabled = true);

      setTimeout(() => {
        this.close();
        if (this.onAnswered) {
          this.onAnswered(true, this.currentQuestion, this.contextData);
        }
      }, 900);

    } else {
      // JAWAPAN SALAH - Galakan untuk cuba lagi
      clickedBtn.classList.add('btn-wrong');
      clickedBtn.disabled = true; // Lumpuhkan pilihan yang salah
      feedback.textContent = `💡 Belum tepat, cuba lagi! ${this.currentQuestion.hint || ''}`;
      feedback.style.color = '#E65100';
      this.audioManager.playWrong();

      if (this.onAnswered) {
        this.onAnswered(false, this.currentQuestion, this.contextData);
      }
    }
  }

  close() {
    this.container.classList.add('hidden');
    this.isOpen = false;
    this.currentQuestion = null;
    this.contextData = null;
  }
}
