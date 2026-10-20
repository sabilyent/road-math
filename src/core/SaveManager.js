// SaveManager.js - Menguruskan penyimpanan data pemain secara tempatan (Local-First)

const STORAGE_KEY = 'road_math_save_v1';

const DEFAULT_SAVE = {
  schemaVersion: 1,
  settings: {
    musicEnabled: true,
    sfxEnabled: true,
    controlMode: 'touch-or-keyboard',
    graphicsQuality: 'high'
  },
  player: {
    coins: 50, // Permulaan 50 syiling untuk seronok berbelanja
    xp: 0,
    level: 1,
    avatar: {
      skin: '#FFCC80', // Peach/Tan
      shirt: '#0288D1', // Cyan/Blue
      pants: '#2E7D32', // Vibrant Green
      hat: 'propeller', // propeller, crown, party, ears, none
      hair: '#3E2723'
    },
    inventory: []
  },
  progress: {
    openedDoors: [],
    completedChallenges: 0,
    defeatedZombies: 0
  },
  mathProfile: {
    level: 1, // 1 (4-5 thn), 2 (5-6 thn), 3 (6-7 thn)
    operations: {
      addition: { difficulty: 1, correct: 0, attempts: 0 },
      subtraction: { difficulty: 1, correct: 0, attempts: 0 },
      multiplication: { difficulty: 1, correct: 0, attempts: 0 },
      division: { difficulty: 1, correct: 0, attempts: 0 }
    }
  }
};

class SaveManager {
  constructor() {
    this.data = this.load();
  }

  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return JSON.parse(JSON.stringify(DEFAULT_SAVE));
      }
      const parsed = JSON.parse(raw);
      // Validasi ringkas
      if (!parsed || typeof parsed !== 'object') {
        return JSON.parse(JSON.stringify(DEFAULT_SAVE));
      }
      // Gabung dengan default sekiranya ada medan baharu
      return {
        ...DEFAULT_SAVE,
        ...parsed,
        settings: { ...DEFAULT_SAVE.settings, ...(parsed.settings || {}) },
        player: {
          ...DEFAULT_SAVE.player,
          ...(parsed.player || {}),
          avatar: { ...DEFAULT_SAVE.player.avatar, ...(parsed.player?.avatar || {}) }
        },
        progress: { ...DEFAULT_SAVE.progress, ...(parsed.progress || {}) },
        mathProfile: { ...DEFAULT_SAVE.mathProfile, ...(parsed.mathProfile || {}) }
      };
    } catch (e) {
      console.warn('Gagal membaca save data:', e);
      return JSON.parse(JSON.stringify(DEFAULT_SAVE));
    }
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.warn('Gagal menyimpan save data:', e);
    }
  }

  addCoins(amount) {
    if (amount <= 0) return;
    this.data.player.coins += amount;
    this.data.player.xp += amount * 2;
    // Check level up
    const newLevel = Math.floor(this.data.player.xp / 100) + 1;
    if (newLevel > this.data.player.level) {
      this.data.player.level = newLevel;
    }
    this.save();
    return this.data.player.coins;
  }

  spendCoins(amount) {
    if (amount <= 0) return false;
    if (this.data.player.coins >= amount) {
      this.data.player.coins -= amount;
      this.save();
      return true;
    }
    return false;
  }

  addInventory(item) {
    this.data.player.inventory.push(item);
    this.save();
  }

  updateAvatar(avatarUpdates) {
    this.data.player.avatar = { ...this.data.player.avatar, ...avatarUpdates };
    this.save();
  }

  recordDoorOpened(doorId) {
    if (!this.data.progress.openedDoors.includes(doorId)) {
      this.data.progress.openedDoors.push(doorId);
      this.data.progress.completedChallenges++;
      this.save();
    }
  }

  recordZombieDefeated() {
    this.data.progress.defeatedZombies++;
    this.data.progress.completedChallenges++;
    this.save();
  }

  recordMathAnswer(operation, isCorrect) {
    const opData = this.data.mathProfile.operations[operation];
    if (opData) {
      opData.attempts++;
      if (isCorrect) {
        opData.correct++;
        // Adaptif: Jika prestasi cemerlang (cth 5 kali betul berturut), naikkan kesukaran
        if (opData.correct % 4 === 0 && opData.difficulty < 3) {
          opData.difficulty++;
        }
      }
    }
    this.save();
  }

  reset() {
    this.data = JSON.parse(JSON.stringify(DEFAULT_SAVE));
    this.save();
  }
}

export const saveManager = new SaveManager();
