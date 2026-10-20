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
import { LoginModal } from './ui/LoginModal.js';
import { LeaderboardModal } from './ui/LeaderboardModal.js';

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

    // 4. Pengesanan Klik / Tap Terus ke Zombie (Raycast Click-to-Aim)
    this.setupZombieClickTargeting();

    // 5. Pasang Service Worker & Prompter PWA
    this.setupPWA();

    // 6. Penguatkuasaan Mod Melintang (Force Landscape Orientation)
    this.setupLandscapeOrientation();

    // 7. Mulakan Gelung Permainan (Game Loop)
    this.lastTime = performance.now();
    this.elapsedTime = 0;

    requestAnimationFrame(this.gameLoop.bind(this));
  }

  initUI() {
    // Login / Switch Player Modal
    this.loginModal = new LoginModal(this.saveManager, this.audio, (newUser) => {
      this.worldScene.avatar.updateCustomization(newUser.avatar);
      this.hud.updateHUD();
      this.hud.showToast(`Selamat Datang, ${newUser.username}! Sesi anda sedia 🎮`);
    });

    // Leaderboard Modal
    this.leaderboardModal = new LeaderboardModal(this.saveManager, this.audio);

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
        // Reset save profil semasa
        this.saveManager.resetCurrentPlayer();
        this.worldScene.avatar.updateCustomization(this.saveManager.user.avatar);
        this.hud.updateHUD();
        this.hud.showToast('Profil semasa telah dimulakan semula!');
      }
    );

    // HUD
    this.hud = new HUD(
      this.saveManager,
      this.audio,
      () => this.customizerModal.show(),
      () => this.settingsModal.show(),
      () => this.leaderboardModal.show(),
      () => this.loginModal.show(true)
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

  // Pengesanan Klik / Sentuh Terus pada Zombie di skrin
  setupZombieClickTargeting() {
    let downX = 0;
    let downY = 0;

    window.addEventListener('pointerdown', (e) => {
      if (e.target.tagName === 'CANVAS') {
        downX = e.clientX;
        downY = e.clientY;
      }
    });

    window.addEventListener('pointerup', (e) => {
      if (e.target.tagName !== 'CANVAS') return;

      // Jika seretan tetikus terlalu jauh, anggap pusingan kamera, bukan klik sasaran
      const dist = Math.hypot(e.clientX - downX, e.clientY - downY);
      if (dist < 8) {
        const clickedZombie = this.worldScene.getClickedZombie(e.clientX, e.clientY);
        if (clickedZombie && !clickedZombie.isDefeated) {
          // Kunci sasaran terus kepada zombie ini
          this.worldScene.zombiePark.setTargetDirectly(clickedZombie);
          this.audio.playCoin();
          this.triggerZombieChallenge(clickedZombie);
        }
      }
    });
  }

  // Lancarkan cabaran matematik untuk zombie yang disasarkan
  triggerZombieChallenge(zombie) {
    if (!zombie || zombie.isDefeated) return;
    const question = this.mathEngine.generateQuestion(zombie.opType);
    this.mathModal.show(question, {
      type: 'zombie',
      target: zombie,
      title: `Tembak ${zombie.name}! 🎯🔫`,
      icon: '🧟'
    });
  }

  // Pengendali Keputusan Cabaran Matematik
  handleMathResult(isCorrect, question, context) {
    if (question && question.operation) {
      this.saveManager.recordMathAnswer(question.operation, isCorrect);
    }

    if (!isCorrect || !context) return;

    if (context.type === 'zombie') {
      const zombie = context.target;
      // 1. Tembak pancaran laser dari pistol avatar ke zombie
      this.worldScene.particleSystem.spawnBlasterBeam(this.worldScene.playerPos, zombie.group.position);
      this.audio.playBlaster();

      // 2. Kalahkan zombie: mati, berpusing dan hilang dengan letupan zarah & syiling
      setTimeout(() => {
        this.worldScene.zombiePark.defeatZombie(zombie);
        this.worldScene.particleSystem.spawnVictoryBurst(zombie.group.position, 25);
        this.worldScene.particleSystem.spawnCoinBurst(zombie.group.position, 6);
        this.audio.playCoin();

        // Ganjaran berasingan: Points untuk Ranking 🏆, Coins untuk Belanja 🪙!
        this.saveManager.recordZombieDefeated();
        this.hud.updateHUD();
        this.hud.showToast(`🎯 Tembakan Tepat! ${zombie.name} mati! +20 Point (Ranking) 🏆 & +5 Syiling 🪙`);
      }, 300);

    } else if (context.type === 'door') {
      const door = context.target;
      this.worldScene.townSquare.openDoor(door);
      this.worldScene.particleSystem.spawnVictoryBurst(door.pos, 35);
      this.audio.playCorrect();

      this.saveManager.recordDoorOpened(door.id);
      this.hud.updateHUD();
      this.hud.showToast(`🚪 ${door.name} Terbuka! Harta karun diperoleh! +50 Point 🏆 & +25 Syiling 🪙`);
    }
  }

  // Pengendali Pembelian Makanan & Minuman di Kedai
  handleItemPurchased(item) {
    const healHp = item.health || 25;
    const healPw = item.power || 40;
    this.saveManager.restoreHealth(healHp);
    this.saveManager.restorePower(healPw);
    this.audio.playEat();

    this.worldScene.applyFoodBuff(item.buff, 18.0);
    this.worldScene.particleSystem.spawnVictoryBurst(this.worldScene.playerPos, 15);
    this.hud.updateHUD();
    this.hud.showBuff(`${item.name} Aktif!`, item.emoji);
    this.hud.showToast(`😋 Sedapnya ${item.name}! +${healPw} Tenaga ⚡ & +${healHp} Darah ❤️!`);

    setTimeout(() => {
      this.hud.hideBuff();
    }, 18000);
  }

  // Konfigurasi PWA & Pengesanan Pemasangan (Install Prompt)
  setupPWA() {
    this.registerServiceWorker();

    this.deferredInstallPrompt = null;
    window.addEventListener('beforeinstallprompt', (e) => {
      // Halang pelayar daripada memaparkan default banner mini serta-merta
      e.preventDefault();
      this.deferredInstallPrompt = e;
      // Paparkan butang pasang PWA di HUD
      this.hud.showInstallButton(async () => {
        if (!this.deferredInstallPrompt) return;
        this.deferredInstallPrompt.prompt();
        const { outcome } = await this.deferredInstallPrompt.userChoice;
        if (outcome === 'accepted') {
          this.hud.showToast('🚀 Pemasangan Road Math sedang dimulakan...');
        }
        this.deferredInstallPrompt = null;
        this.hud.hideInstallButton();
      });
    });

    window.addEventListener('appinstalled', () => {
      this.deferredInstallPrompt = null;
      this.hud.hideInstallButton();
      this.hud.showToast('🎉 Aplikasi Road Math berjaya dipasang pada peranti!');
    });
  }

  // Pendaftaran Service Worker untuk Keupayaan Offline (Luar Talian)
  registerServiceWorker() {
    if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
      const doRegister = () => {
        navigator.serviceWorker.register('./sw.js', { scope: './' })
          .then((reg) => {
            console.log('Road Math SW registered successfully. Scope:', reg.scope);
          })
          .catch((err) => {
            console.log('SW registration note:', err);
          });
      };

      if (document.readyState === 'complete') {
        doRegister();
      } else {
        window.addEventListener('load', doRegister);
      }
    }
  }

  // Penguatkuasaan Orientasi Skrin Melintang (Force Landscape Mode)
  setupLandscapeOrientation() {
    const barrier = document.getElementById('landscape-barrier');
    const btnFullscreen = document.getElementById('btn-force-fullscreen');

    const updateOrientationState = () => {
      // Skrin dianggap portrait jika ketinggian lebih besar daripada kelebaran
      const isPortrait = window.innerHeight > window.innerWidth;
      if (isPortrait) {
        if (barrier) barrier.classList.remove('hidden');
      } else {
        if (barrier) barrier.classList.add('hidden');
      }
    };

    // Jalankan semakan semasa permulaan
    updateOrientationState();

    // Pantau perubahan saiz viewport dan putaran skrin peranti
    window.addEventListener('resize', updateOrientationState);
    window.addEventListener('orientationchange', () => {
      setTimeout(updateOrientationState, 150);
    });

    if (screen.orientation) {
      screen.orientation.addEventListener('change', updateOrientationState);
    }

    // Butang untuk memohon Skrin Penuh (Fullscreen) & Kunci Skrin Landscape
    if (btnFullscreen) {
      btnFullscreen.addEventListener('click', async () => {
        this.audio.playCoin();
        try {
          const docEl = document.documentElement;
          if (docEl.requestFullscreen) {
            await docEl.requestFullscreen();
          } else if (docEl.webkitRequestFullscreen) {
            await docEl.webkitRequestFullscreen();
          }
        } catch (err) {
          console.log('Fullscreen request note:', err);
        }

        try {
          if (screen.orientation && screen.orientation.lock) {
            await screen.orientation.lock('landscape');
          }
        } catch (err) {
          console.log('Screen orientation lock note:', err);
        }

        setTimeout(updateOrientationState, 200);
      });
    }
  }

  // Gelung Permainan Utama (Animation Frame Loop)
  gameLoop(now) {
    const delta = Math.min((now - this.lastTime) / 1000, 0.1);
    this.lastTime = now;
    this.elapsedTime += delta;

    const isModalOpen = this.mathModal.isOpen || this.shopModal.isOpen || 
                        this.customizerModal.isOpen || this.settingsModal.isOpen ||
                        this.loginModal.isOpen || this.leaderboardModal.isOpen;

    // Jika modal terbuka, rehatkan pergerakan pemain
    if (!isModalOpen) {
      // Semak auto-aim untuk menentukan sama ada avatar dalam mod membidik
      const playerPos = this.worldScene.playerPos;
      const lockedZombie = this.worldScene.zombiePark.updateAutoAim(playerPos, 15.0);
      const isAiming = lockedZombie !== null;
      const isExhausted = this.saveManager.power <= 0;

      const updateResult = this.worldScene.update(delta, this.inputManager, this.elapsedTime, isAiming, isExhausted);

      // 1. Logik Gigitan Zombie
      if (updateResult && updateResult.bitingZombie) {
        this.handleZombieBite(updateResult.bitingZombie);
      }

      // 2. Pemulihan automatik di Air Pancut (Fountain of Health & Power)
      if (updateResult && updateResult.isNearFountain) {
        this.saveManager.restoreHealth(delta * 10.0);
        this.saveManager.restorePower(delta * 15.0);
        this.hud.updateHUD();
      }

      // 3. Pengurangan / Pemulihan Tenaga Berjalan
      if (updateResult && updateResult.isMoving) {
        this.saveManager.consumePower(delta * 2.2);
        this.hud.updateHUD();
      } else {
        // Berehat secara santai memulihkan sedikit tenaga
        this.saveManager.restorePower(delta * 1.5);
        this.hud.updateHUD();
      }

      this.checkInteractions(lockedZombie);
    } else {
      // Render secara pasif
      this.worldScene.renderer.render(this.worldScene.scene, this.worldScene.camera);
    }

    requestAnimationFrame(this.gameLoop.bind(this));
  }

  // Pengendali Serangan Gigitan Zombie
  handleZombieBite(zombie) {
    this.saveManager.damageHealth(15);
    this.audio.playHurt();
    this.worldScene.avatar.flashHurt();
    this.hud.flashDamage();
    this.hud.updateHUD();

    if (this.saveManager.health <= 0) {
      // Hero Pengsan & Pulih di Air Pancut
      this.audio.playDefeat();
      this.worldScene.respawnAtFountain();
      this.saveManager.restoreFull();
      this.hud.updateHUD();
      this.hud.showToast('😵 Hero pengsan digigit zombie! Anda pulih di Air Pancut ❤️⚡', 3500);
    } else {
      this.hud.showToast(`⚠️ ${zombie.name} gigit anda! -15 Darah ❤️ (Baki: ${Math.round(this.saveManager.health)}%)`, 1800);
    }
  }

  // Semakan Interaksi dengan Objek Berdekatan & Auto-Aim Blaster
  checkInteractions(lockedZombie) {
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

    // 2. Semak Auto-Aim Pistol ke Zombie Berkeliaran (Prompt Ramping & Tidak Mengganggu)
    if (lockedZombie) {
      this.hud.showPrompt(`🎯 Sasaran: ${lockedZombie.name}! Tekan [F] / 🔫 Blaster (atau Tap Zombie)`, '🎯', true);

      if (this.inputManager.consumeBlaster()) {
        this.triggerZombieChallenge(lockedZombie);
        return;
      }
    }

    // 3. Semak Food Street Stalls (Makanan & Minuman)
    const closestStall = this.worldScene.foodStreet.getClosestStall(playerPos, 3.5);
    if (closestStall) {
      this.hud.showPrompt(`Beli di ${closestStall.name}! Tekan [E] / 💬`, closestStall.item.emoji);

      if (this.inputManager.consumeInteract()) {
        this.shopModal.show(closestStall);
      }
      return;
    }

    // 4. Semak Pintu Rahsia Matematik (Math Doors)
    const closestDoor = this.worldScene.townSquare.getClosestDoor(playerPos, 3.2);
    if (closestDoor && !closestDoor.isOpen) {
      this.hud.showPrompt(`Buka ${closestDoor.name}! Tekan [E] / 💬`, '🚪');

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
      this.hud.showPrompt('Tukar Pakaian Roblox! Tekan [E] / 💬', '👕');

      if (this.inputManager.consumeInteract()) {
        this.customizerModal.show();
      }
      return;
    }

    // Jika tiada sasaran atau interaksi, sembunyikan petunjuk
    if (!lockedZombie) {
      this.hud.hidePrompt();
    }
  }
}

// Mulakan aplikasi secara selamat sama ada sebelum atau selepas DOM sedia
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new GameApp());
} else {
  new GameApp();
}
