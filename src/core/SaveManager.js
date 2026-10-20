// SaveManager.js - Menguruskan penyimpanan data pemain dan profil berbilang pengguna (Multi-session)

const STORAGE_KEY = 'road_math_save_v2';
const LEGACY_STORAGE_KEY = 'road_math_save_v1';

const createDefaultProfile = (username = 'Hero') => ({
  username: username,
  coins: 50,  // Syiling untuk belanja di kedai makanan & kosmetik
  points: 0,  // Mata skor untuk ranking / leaderboard
  health: 100, // Darah / Kesihatan (Max: 100)
  maxHealth: 100,
  power: 100,  // Tenaga / Stamina (Max: 100)
  maxPower: 100,
  xp: 0,
  level: 1,
  avatar: {
    skin: '#FFCC80',
    shirt: '#0288D1',
    pants: '#2E7D32',
    hat: 'propeller',
    hair: '#3E2723'
  },
  inventory: [],
  progress: {
    openedDoors: [],
    completedChallenges: 0,
    defeatedZombies: 0
  },
  mathProfile: {
    level: 1,
    operations: {
      addition: { difficulty: 1, correct: 0, attempts: 0 },
      subtraction: { difficulty: 1, correct: 0, attempts: 0 },
      multiplication: { difficulty: 1, correct: 0, attempts: 0 },
      division: { difficulty: 1, correct: 0, attempts: 0 }
    }
  }
});

class SaveManager {
  constructor() {
    this.rawStore = this.loadAll();
    // Tetapkan pengguna aktif semasa
    this.currentUsername = this.rawStore.activeUser || 'Hero';
    if (!this.rawStore.users[this.currentUsername]) {
      this.rawStore.users[this.currentUsername] = createDefaultProfile(this.currentUsername);
    }
  }

  loadAll() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.users && typeof parsed.users === 'object') {
          return parsed;
        }
      }

      // Migrasi daripada versi 1 jika ada
      const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (legacyRaw) {
        const legacy = JSON.parse(legacyRaw);
        const legacyUser = createDefaultProfile('Hero');
        if (legacy.player) {
          legacyUser.coins = legacy.player.coins || 50;
          legacyUser.points = (legacy.player.xp || 0) * 5; // Convert legacy XP to initial points
          legacyUser.level = legacy.player.level || 1;
          legacyUser.avatar = { ...legacyUser.avatar, ...(legacy.player.avatar || {}) };
        }
        return {
          activeUser: 'Hero',
          users: { 'Hero': legacyUser }
        };
      }
    } catch (e) {
      console.warn('Gagal membaca data save:', e);
    }

    return {
      activeUser: 'Hero',
      users: {
        'Hero': createDefaultProfile('Hero')
      }
    };
  }

  save() {
    try {
      this.rawStore.activeUser = this.currentUsername;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.rawStore));
    } catch (e) {
      console.warn('Gagal menyimpan save data:', e);
    }
  }

  // Pengguna aktif sekarang
  get user() {
    if (!this.rawStore.users[this.currentUsername]) {
      this.rawStore.users[this.currentUsername] = createDefaultProfile(this.currentUsername);
    }
    return this.rawStore.users[this.currentUsername];
  }

  // Kompatibiliti ke belakang untuk rujukan saveManager.data.player
  get data() {
    return {
      player: this.user,
      mathProfile: this.user.mathProfile,
      progress: this.user.progress,
      settings: {
        musicEnabled: true,
        sfxEnabled: true
      }
    };
  }

  // Login dengan hanya memasukkan username (tanpa password/register rumit)
  login(username) {
    const cleanName = (username || '').trim();
    if (!cleanName) return false;

    this.currentUsername = cleanName;
    if (!this.rawStore.users[cleanName]) {
      // Profil baharu dicipta secara automatik
      this.rawStore.users[cleanName] = createDefaultProfile(cleanName);
    }
    this.rawStore.activeUser = cleanName;
    this.save();
    return true;
  }

  // Logout / Tamatkan sesi semasa
  logout() {
    // Apabila logout, kita simpan keadaan terakhir
    this.save();
  }

  // Senarai ranking / leaderboard berasaskan Points
  getLeaderboard() {
    const list = Object.values(this.rawStore.users).map((u) => ({
      username: u.username,
      points: u.points || 0,
      coins: u.coins || 0,
      level: u.level || 1,
      zombiesDefeated: u.progress?.defeatedZombies || 0
    }));

    // Susun daripada markah tertinggi ke terendah
    list.sort((a, b) => b.points - a.points);
    return list;
  }

  // Senarai semua username yang pernah bermain
  getAllUsernames() {
    return Object.keys(this.rawStore.users);
  }

  // Tambah Points (Mata Skor untuk Ranking)
  addPoints(amount) {
    if (amount <= 0) return 0;
    this.user.points = (this.user.points || 0) + amount;
    this.user.xp = (this.user.xp || 0) + amount;

    // Semak kenaikan tahap (Level Up)
    const newLevel = Math.floor(this.user.points / 100) + 1;
    if (newLevel > this.user.level) {
      this.user.level = newLevel;
    }
    this.save();
    return this.user.points;
  }

  // Tambah Coins (Syiling untuk Belanja)
  addCoins(amount) {
    if (amount <= 0) return 0;
    this.user.coins = (this.user.coins || 0) + amount;
    this.save();
    return this.user.coins;
  }

  // Pengurusan Kesihatan (❤️ Health)
  get health() {
    if (this.user.health === undefined) this.user.health = 100;
    return this.user.health;
  }

  get maxHealth() {
    return this.user.maxHealth || 100;
  }

  damageHealth(amount) {
    if (amount <= 0) return this.health;
    this.user.health = Math.max(0, this.health - amount);
    this.save();
    return this.user.health;
  }

  restoreHealth(amount) {
    if (amount <= 0) return this.health;
    this.user.health = Math.min(this.maxHealth, this.health + amount);
    this.save();
    return this.user.health;
  }

  // Pengurusan Tenaga (⚡ Power / Stamina)
  get power() {
    if (this.user.power === undefined) this.user.power = 100;
    return this.user.power;
  }

  get maxPower() {
    return this.user.maxPower || 100;
  }

  consumePower(amount) {
    if (amount <= 0) return this.power;
    this.user.power = Math.max(0, this.power - amount);
    return this.user.power;
  }

  restorePower(amount) {
    if (amount <= 0) return this.power;
    this.user.power = Math.min(this.maxPower, this.power + amount);
    return this.user.power;
  }

  restoreFull() {
    this.user.health = 100;
    this.user.power = 100;
    this.save();
  }

  // Belanja Coins
  spendCoins(amount) {
    if (amount <= 0) return false;
    if (this.user.coins >= amount) {
      this.user.coins -= amount;
      this.save();
      return true;
    }
    return false;
  }

  updateAvatar(avatarUpdates) {
    this.user.avatar = { ...this.user.avatar, ...avatarUpdates };
    this.save();
  }

  recordDoorOpened(doorId) {
    if (!this.user.progress.openedDoors.includes(doorId)) {
      this.user.progress.openedDoors.push(doorId);
      this.user.progress.completedChallenges++;
      this.addPoints(50); // Mata skor tinggi untuk buka pintu rahsia!
      this.addCoins(25);
      this.save();
    }
  }

  recordZombieDefeated() {
    this.user.progress.defeatedZombies++;
    this.user.progress.completedChallenges++;
    this.addPoints(20); // +20 Points untuk ranking!
    this.addCoins(5);   // +5 Syiling untuk belanja!
    this.save();
  }

  recordMathAnswer(operation, isCorrect) {
    const opData = this.user.mathProfile.operations[operation];
    if (opData) {
      opData.attempts++;
      if (isCorrect) {
        opData.correct++;
        if (opData.correct % 4 === 0 && opData.difficulty < 3) {
          opData.difficulty++;
        }
      }
    }
    this.save();
  }

  resetCurrentPlayer() {
    this.rawStore.users[this.currentUsername] = createDefaultProfile(this.currentUsername);
    this.save();
  }
}

export const saveManager = new SaveManager();
