import { audio } from './core/AudioManager.js';
import { saveManager } from './core/SaveManager.js';
import { InputManager } from './core/InputManager.js';
import { MathEngine } from './core/MathEngine.js';
import { WorldScene } from './world/WorldScene.js';

import { HUD } from './ui/HUD.js';
import { MathModal } from './ui/MathModal.js';
import { ShopModal } from './ui/ShopModal.js';
import { CustomizerModal } from './ui/CustomizerModal.js';
import { SettingsModal } from './ui/SettingsModal.js';
import { TouchControls } from './ui/TouchControls.js';

class GameApp {
  constructor() {
    this.canvasContainer = document.getElementById('canvas-container');

    // 1. Inisialisasi Enjin & Sistem Teras
    this.audio = audio;
    this.saveManager = saveManager;
    this.inputManager = new InputManager();
    this.mathEngine = new MathEngine(this.saveManager);

    // 2. Inisialisasi Dunia 3D
    this.worldScene = new WorldScene(this.canvasContainer, this.saveManager.data);

    // 3. Inisialisasi Modals & UI
    this.initUI();

    // 4. Pasang Service Worker untuk Sokongan Luar Talian (Offline / PWA)
    this.registerServiceWorker();

    // 5. Mulakan Gelung Permainan (Game Loop)
    this.lastTime = performance.now();
    this.elapsedTime = 0;
    this.activeInteractable = null;

    requestAnimationFrame(this.gameLoop.bind(this));
  }

  initUI() {
    // Customizer Modal
    this.customizerModal = new CustomizerModal(this.saveManager, this.audio, (newAvatar) => {
      this.worldScene.avatar.updateCustomization(newAvatar);
    });

    // Settings Modal
    this.settingsModal = new SettingsModal(
      this.saveManager,
      this.audio,
      (newLevel) => {
        this.hud.showToast(`Aras Pembelajaran: Aras ${newLevel} ⭐`);
      },
      () => {
        // Reset save
        this.worldScene.avatar.updateCustomization(this.saveManager.data.player.avatar);
        this.hud.updateHUD();
        this.hud.showToast('Permainan telah dimulakan semula!');
      }
    );

    // HUD
    this.hud = new HUD(
      this.saveManager,
      this.audio,
      () => this.customizerModal.show(),
      () => this.settingsModal.show()
    );

    // Math Modal
    this.mathModal = new MathModal(this.audio, (isCorrect, question, context) => {
      this.handleMathResult(isCorrect, question, context);
    });

    // Shop Modal
    this.shopModal = new ShopModal(this.saveManager, this.audio, this.mathEngine, (item) => {
      this.handleItemPurchased(item);
    });

    // Mobile Virtual Joystick & Touch Buttons
    this.touchControls = new TouchControls(this.inputManager, this.audio);
  }

  // Pengendali Keputusan Cabaran Matematik
  handleMathResult(isCorrect, question, context) {
    this.saveManager.recordMathAnswer(question.operation, isCorrect);

    if (!isCorrect) return;

    if (context.type === 'zombie') {
      const zombie = context.target;
      // 1. Tembak pancaran blaster laser dari avatar ke zombie
      this.worldScene.particleSystem.spawnBlasterBeam(this.worldScene.playerPos, zombie.group.position);
      this.audio.playBlaster();

      // 2. Kalahkan zombie dengan letupan zarah & syiling
      setTimeout(() => {
        this.worldScene.zombiePark.defeatZombie(zombie);
        this.worldScene.particleSystem.spawnVictoryBurst(zombie.group.position, 20);
        this.worldScene.particleSystem.spawnCoinBurst(zombie.group.position, 6);
        this.audio.playCoin();

        const rewardCoins = 10;
        this.saveManager.addCoins(rewardCoins);
        this.saveManager.recordZombieDefeated();
        this.hud.updateHUD();
        this.hud.showToast(`🎉 Hebat! ${zombie.name} bertukar jadi syiling! +${rewardCoins} Syiling 🪙`);
      }, 300);

    } else if (context.type === 'door') {
      const door = context.target;
      this.worldScene.townSquare.openDoor(door);
      this.worldScene.particleSystem.spawnVictoryBurst(door.pos, 35);
      this.audio.playCorrect();

      const rewardCoins = 25;
      this.saveManager.addCoins(rewardCoins);
      this.saveManager.recordDoorOpened(door.id);
      this.hud.updateHUD();
      this.hud.showToast(`🚪 ${door.name} Terbuka! Harta karun diperoleh! +${rewardCoins} Syiling 🪙`);
    }
  }

  // Pengendali Pembelian Makanan di Kedai
  handleItemPurchased(item) {
    this.worldScene.applyFoodBuff(item.buff, 18.0);
    this.worldScene.particleSystem.spawnVictoryBurst(this.worldScene.playerPos, 15);
    this.hud.updateHUD();
    this.hud.showBuff(`${item.name} Aktif!`, item.emoji);
    this.hud.showToast(`Mmm sedapnya! ${item.desc} 😋`);

    // Tamat buff selepas 18 saat
    setTimeout(() => {
      this.hud.hideBuff();
    }, 18000);
  }

  // Pendaftaran Service Worker
  registerServiceWorker() {
    if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch((err) => {
          console.log('SW registration note:', err);
        });
      });
    }
  }

  // Gelung Permainan Utama (Animation Frame Loop)
  gameLoop(now) {
    const delta = Math.min((now - this.lastTime) / 1000, 0.1);
    this.lastTime = now;
    this.elapsedTime += delta;

    const isModalOpen = this.mathModal.isOpen || this.shopModal.isOpen || this.customizerModal.isOpen || this.settingsModal.isOpen;

    // Jika modal terbuka, rehatkan pergerakan pemain
    if (!isModalOpen) {
      this.worldScene.update(delta, this.inputManager, this.elapsedTime);
      this.checkInteractions();
    } else {
      // Hanya kemaskini animasi dunia secara pasif
      this.worldScene.renderer.render(this.worldScene.scene, this.worldScene.camera);
    }

    requestAnimationFrame(this.gameLoop.bind(this));
  }

  // Semakan Interaksi dengan Objek Berdekatan
  checkInteractions() {
    const playerPos = this.worldScene.playerPos;

    // 1. Kutipan Syiling Bertaburan
    const collectedCoins = this.worldScene.townSquare.checkCoinPickup(playerPos, 1.4);
    if (collectedCoins.length > 0) {
      for (const coin of collectedCoins) {
        this.audio.playCoin();
        this.worldScene.particleSystem.spawnCoinBurst(coin.mesh.position, 3);
        this.saveManager.addCoins(2);
      }
      this.hud.updateHUD();
    }

    // 2. Semak Zombie Park
    const closestZombie = this.worldScene.zombiePark.getClosestZombie(playerPos, 3.8);
    if (closestZombie) {
      this.hud.showPrompt(`Lawan ${closestZombie.name}! Tekan [F] atau Butang Blaster 🔫`, '🧟');

      if (this.inputManager.consumeBlaster() || this.inputManager.consumeInteract()) {
        const question = this.mathEngine.generateQuestion(closestZombie.opType);
        this.mathModal.show(question, {
          type: 'zombie',
          target: closestZombie,
          title: `Cabar ${closestZombie.name}! 🧟`,
          icon: '🔫'
        });
      }
      return;
    }

    // 3. Semak Food Street Stalls
    const closestStall = this.worldScene.foodStreet.getClosestStall(playerPos, 3.5);
    if (closestStall) {
      this.hud.showPrompt(`Beli di ${closestStall.name}! Tekan [E] atau Butang Tindakan 💬`, closestStall.item.emoji);

      if (this.inputManager.consumeInteract()) {
        this.shopModal.show(closestStall);
      }
      return;
    }

    // 4. Semak Pintu Rahsia Matematik (Math Doors)
    const closestDoor = this.worldScene.townSquare.getClosestDoor(playerPos, 3.2);
    if (closestDoor && !closestDoor.isOpen) {
      this.hud.showPrompt(`Buka ${closestDoor.name}! Tekan [E] atau Butang Tindakan 💬`, '🚪');

      if (this.inputManager.consumeInteract()) {
        const question = this.mathEngine.generateQuestion(closestDoor.operation, 2);
        this.mathModal.show(question, {
          type: 'door',
          target: closestDoor,
          title: `Buka ${closestDoor.name}! 🚪`,
          icon: '⭐'
        });
      }
      return;
    }

    // 5. Semak Stesen Almari Fesyen Roblox
    if (this.worldScene.townSquare.isNearWardrobe(playerPos, 2.8)) {
      this.hud.showPrompt('Tukar Pakaian Roblox! Tekan [E] atau Butang Tindakan 💬', '👕');

      if (this.inputManager.consumeInteract()) {
        this.customizerModal.show();
      }
      return;
    }

    // Jika tiada apa-apa berdekatan, sembunyikan petunjuk
    this.hud.hidePrompt();
  }
}

// Mulakan aplikasi apabila DOM sedia
window.addEventListener('DOMContentLoaded', () => {
  new GameApp();
});
