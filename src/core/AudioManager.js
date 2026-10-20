// Web Audio API Synthesizer - 100% Client-side, offline, no external audio files required!

class AudioManager {
  constructor() {
    this.ctx = null;
    this.sfxEnabled = true;
    this.musicEnabled = true;
    this.bgmOscillators = [];
    this.bgmInterval = null;
    this.bgmPlaying = false;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play Cartoon Jump (Boing sound)
  playJump() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(380, now + 0.15);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  // Play Shiny Coin Collect
  playCoin() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // First high note
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(987.77, now); // B5
    gain1.gain.setValueAtTime(0.2, now);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    osc1.connect(gain1);
    gain1.connect(this.ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.1);

    // Second higher note (E6)
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1318.51, now + 0.08); // E6
    gain2.gain.setValueAtTime(0.25, now + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
    osc2.connect(gain2);
    gain2.connect(this.ctx.destination);
    osc2.start(now + 0.08);
    osc2.stop(now + 0.35);
  }

  // Play Victory / Correct Answer Jingle (Fanfare)
  playCorrect() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    const now = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      const startTime = now + idx * 0.09;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      const duration = (idx === notes.length - 1) ? 0.35 : 0.12;
      gain.gain.setValueAtTime(0.22, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  }

  // Play Gentle Encouraging Wrong Sound ("Uh-oh", not harsh)
  playWrong() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.25);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  }

  // Play Math Blaster Beam
  playBlaster() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.2);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.22);
  }

  // Play Cash Register / Shop purchase
  playPurchase() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.setValueAtTime(1174.66, now + 0.08);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.26);
  }

  // Bunyi digigit zombie / tercedera (Ouch / Cartoon Thud)
  playHurt() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.2);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.25);
  }

  // Bunyi makan & minum di kedai (Chomp / Gulp)
  playEat() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    [0, 0.08, 0.16].forEach((delay, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(350 + i * 120, now + delay);
      gain.gain.setValueAtTime(0.2, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.07);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + delay);
      osc.stop(now + delay + 0.07);
    });
  }

  // Bunyi pengsan / fainted
  playDefeat() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.linearRampToValueAtTime(120, now + 0.6);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.65);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.65);
  }

  // Toggle Music
  toggleMusic() {
    this.musicEnabled = !this.musicEnabled;
    if (this.musicEnabled) {
      this.startBGM();
    } else {
      this.stopBGM();
    }
    return this.musicEnabled;
  }

  toggleSFX() {
    this.sfxEnabled = !this.sfxEnabled;
    return this.sfxEnabled;
  }

  // Cheerful, gentle procedural 8-bit BGM for kids
  startBGM() {
    if (!this.musicEnabled || this.bgmPlaying) return;
    this.init();
    if (!this.ctx) return;

    this.bgmPlaying = true;
    const melody = [
      261.63, 329.63, 392.00, 523.25, 392.00, 329.63, // C4 E4 G4 C5 G4 E4
      293.66, 349.23, 440.00, 587.33, 440.00, 349.23, // D4 F4 A4 D5 A4 F4
      329.63, 392.00, 493.88, 659.25, 493.88, 392.00, // E4 G4 B4 E5 B4 G4
      261.63, 392.00, 523.25, 659.25, 523.25, 392.00  // C4 G4 C5 E5 C5 G4
    ];
    let noteIndex = 0;

    const playNextNote = () => {
      if (!this.bgmPlaying || !this.musicEnabled || !this.ctx) return;
      const freq = melody[noteIndex % melody.length];
      noteIndex++;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.04, now); // Gentle background volume
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    };

    this.bgmInterval = setInterval(playNextNote, 320);
  }

  stopBGM() {
    this.bgmPlaying = false;
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }
}

export const audio = new AudioManager();
