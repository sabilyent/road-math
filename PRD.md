# PRD.md — Bijak Math: Math City Adventure

> **Versi PRD:** 1.0  
> **Status:** Draf spesifikasi MVP  
> **Bahasa:** Bahasa Melayu  
> **Platform:** Browser desktop dan mobile  
> **Teknologi:** HTML5, CSS, JavaScript, Three.js  
> **Seni bina:** Client-side, single-player, local-first  
> **Sasaran:** Kanak-kanak sekitar umur 4–7 tahun

## 1. Tujuan dokumen

Dokumen ini menetapkan keperluan produk dan kriteria penerimaan untuk membina MVP Bijak Math. Ia menjadi rujukan untuk reka bentuk, pembangunan, ujian dan penilaian skop.

## 2. Ringkasan produk

Bijak Math ialah game 3D third-person yang membolehkan pemain meneroka bandar kecil dan menyelesaikan cabaran tambah, tolak, darab serta bahagi. Matematik disepadukan ke dalam pintu bangunan, zombie kartun dan pembelian di kedai.

Versi MVP:
- Single-player.
- Tiada akaun, server permainan atau database online.
- Save disimpan pada browser/peranti.
- Offline-ready selepas aplikasi dan aset penting berjaya dicache.
- Kawalan mobile menggunakan virtual joystick dan butang tindakan.
- Desktop menggunakan papan kekunci.
- Satu mata wang: syiling.

## 3. Matlamat dan bukan matlamat

### 3.1 Matlamat
1. Menyediakan dunia 3D yang boleh diteroka.
2. Menjadikan operasi matematik asas sebagai sebahagian daripada tindakan dalam game.
3. Memberikan maklum balas yang mesra dan peluang mencuba semula.
4. Menyesuaikan kesukaran secara asas mengikut prestasi pemain.
5. Menyimpan kemajuan secara tempatan.
6. Menyokong desktop dan mobile melalui browser.
7. Membolehkan pengalaman teras dimainkan offline selepas cache awal.

### 3.2 Bukan matlamat MVP
- Multiplayer, party game, chat atau fungsi sosial.
- Akaun, cloud save atau server-side progression.
- Pembelian sebenar, iklan atau monetisasi.
- Dunia sebesar Roblox atau alat cipta dunia.
- Simulasi ekonomi kompleks.
- Sistem peperiksaan atau diagnosis kebolehan pembelajaran.
- AI generatif atau NPC berautonomi.

## 4. Pengguna dan keperluan

### Kanak-kanak
- Mahu bergerak dan meneroka dengan mudah.
- Memerlukan arahan pendek, nombor besar dan kawalan sentuh yang jelas.
- Memerlukan maklum balas positif apabila salah atau betul.
- Tidak patut kehilangan kemajuan kerana kesilapan matematik.

### Ibu bapa/penjaga
- Mahu game yang sesuai umur dan tidak mempunyai chat terbuka atau pembelian wang sebenar.
- Mahu kemajuan asas disimpan pada peranti.
- Mahu game boleh digunakan tanpa sambungan internet selepas persediaan awal.

## 5. Prinsip keutamaan

- **P0 — Wajib MVP:** tanpa fungsi ini, game tidak dianggap boleh dimainkan.
- **P1 — Penting:** disasarkan dalam MVP jika kapasiti membenarkan.
- **P2 — Kemudian:** ditangguhkan selepas MVP.

## 6. Aliran pengguna utama

1. Pengguna membuka game.
2. Game memuatkan aset tempatan/cached dan save jika tersedia.
3. Pengguna memilih New Game atau Continue.
4. Pemain mengawal avatar dalam Town Square.
5. Tutorial menunjukkan gerakan, jump dan interact.
6. Pemain mendekati pintu, kedai atau zombie.
7. UI cabaran matematik muncul.
8. Pemain memasukkan jawapan melalui pilihan nombor atau jawapan yang tersedia.
9. Game mengesahkan jawapan dan menunjukkan maklum balas.
10. Jika betul, game menjalankan hasil interaksi dan memberi ganjaran yang layak.
11. Save dikemas kini.
12. Pengguna boleh keluar dan menyambung kemudian pada browser/peranti sama.

## 7. Keperluan fungsian

### FR-001 — Permulaan dan save loading [P0]
**Penerangan:** Game perlu memuatkan save tempatan jika wujud atau memulakan save baharu.

**Kriteria penerimaan**
- Jika save sah wujud, pilihan Continue tersedia.
- Jika tiada save, game memulakan keadaan awal yang sah.
- Jika save rosak atau versi tidak disokong, game tidak crash; ia memaparkan mesej yang mesra dan menawarkan pemulihan/reset.
- Game tidak memerlukan login atau permintaan rangkaian untuk membaca save tempatan.

### FR-002 — Dunia 3D [P0]
**Penerangan:** Paparkan satu bandar kecil yang mempunyai Town Square, bangunan, Food Street dan Zombie Park.

**Kriteria penerimaan**
- Pemain boleh bergerak di permukaan bandar.
- Objek utama mempunyai collision atau had interaksi yang sesuai.
- Kamera tidak kerap masuk ke dalam geometri sehingga pemain hilang pandangan.
- Kawasan utama boleh dicapai tanpa memuat turun aset tambahan daripada server luar.

### FR-003 — Kawalan avatar third-person [P0]
**Penerangan:** Pemain mengawal avatar dari kamera third-person.

**Mobile**
- Virtual joystick mengawal arah pergerakan.
- Butang Jump melompat.
- Butang Interact/Collect melakukan interaksi yang sesuai.
- Butang Fire membuka atau mengesahkan tindakan blaster mengikut keadaan game.
- Input multitouch asas disokong supaya bergerak sambil melakukan tindakan boleh diuji.

**Desktop**
- WASD atau arrow keys: bergerak.
- Space: jump.
- E: interact/collect.
- F: fire.
- Mouse: kamera jika kawalan kamera mouse diaktifkan.

**Kriteria penerimaan**
- Input tidak tersangkut selepas jari/keyboard dilepaskan atau tetingkap kehilangan fokus.
- Butang UI tidak menyebabkan halaman scroll atau zoom secara tidak sengaja semasa gameplay.
- Kawalan boleh digunakan pada saiz skrin yang disokong.

### FR-004 — Orientasi dan responsif [P0]
**Penerangan:** Mobile dioptimumkan untuk landscape.

**Kriteria penerimaan**
- Pada mobile, game cuba meminta landscape melalui API yang disokong apabila dibenarkan oleh browser.
- Jika API tidak tersedia atau permintaan gagal, game menunjukkan arahan putar peranti dan menyediakan laluan untuk meneruskan.
- Desktop menggunakan layout yang sesuai untuk skrin lebar.
- UI soalan dan butang tidak terkeluar dari viewport yang disokong.

### FR-005 — Sistem interaksi [P0]
**Penerangan:** Objek interaktif boleh dicetuskan melalui jarak dan input pemain.

**Kriteria penerimaan**
- Petunjuk interaksi hanya muncul apabila pemain berada dalam jarak yang sesuai.
- Satu input tidak boleh memproses transaksi atau ganjaran yang sama lebih daripada sekali.
- Interaksi mempunyai keadaan yang jelas: tersedia, sedang diproses, selesai atau cooldown.
- Pemain boleh membatalkan/menutup panel jika tindakan itu selamat untuk dibatalkan.

### FR-006 — Math engine [P0]
**Penerangan:** Menjana dan menyemak soalan matematik bagi tambah, tolak, darab dan bahagi.

**Keperluan**
- Soalan mempunyai ID, operasi, operand, jawapan betul, julat kesukaran dan konteks.
- Penjanaan soalan menggunakan julat yang ditentukan oleh tahap.
- Tahap awal tidak menghasilkan jawapan negatif atau pecahan.
- Pembahagian awal menghasilkan jawapan integer.
- Jawapan disemak oleh kod game; UI tidak menjadi satu-satunya sumber kebenaran.
- Pilihan jawapan tidak berulang dan satu pilihan ditetapkan sebagai jawapan betul.
- Penjanaan rawak boleh menerima seed pilihan untuk tujuan ujian.

**Kriteria penerimaan**
- Semua jawapan yang dijana sepadan dengan operasi matematik sebenar.
- Soalan yang dipaparkan sepadan dengan soalan yang disahkan.
- Soalan tidak menghasilkan keadaan tanpa jawapan yang betul.
- Operasi dan julat soalan boleh dikonfigurasi tanpa menulis semula sistem interaksi.

### FR-007 — Adaptasi kesukaran [P0]
**Penerangan:** Laraskan soalan berdasarkan prestasi ringkas pemain.

**Cadangan logik awal**
- Simpan rekod terkini bagi setiap operasi.
- Selepas beberapa jawapan betul berturut-turut, tingkatkan satu langkah kesukaran jika had maksimum belum dicapai.
- Selepas beberapa jawapan salah dalam tetingkap prestasi, kekalkan atau turunkan satu langkah kesukaran dan tawarkan petunjuk.
- Gunakan ambang yang boleh dikonfigurasi dan diuji; jangan naik/turun tahap berdasarkan satu jawapan sahaja.
- Pemain boleh menetapkan tahap permulaan dalam tetapan mudah.

**Kriteria penerimaan**
- Kesukaran berubah secara beransur-ansur.
- Prestasi untuk operasi berlainan boleh disimpan secara berasingan.
- Reset save mengembalikan profil prestasi ke nilai awal.
- Sistem tidak memaparkan label negatif atau diagnostik tentang kebolehan pemain.

### FR-008 — Math Door [P0]
**Penerangan:** Pintu bangunan mengunci akses sehingga jawapan betul diberi.

**Kriteria penerimaan**
- Soalan muncul apabila pemain mengaktifkan pintu dalam jarak interaksi.
- Jawapan betul membuka pintu atau menetapkan status pintu sebagai terbuka.
- Jawapan salah memberi maklum balas dan peluang mencuba lagi.
- Pintu yang telah dibuka kekal terbuka jika itulah keadaan reka bentuk dan save menyokongnya.
- Pemain tidak boleh memperoleh ganjaran pintu berulang kali melalui spam input.

### FR-009 — Math Blaster dan Zombie Berkeliaran Seluruh Bandar [P0]
**Penerangan:** Zombie kartun comel berkeliaran secara dinamik di serata bandar (bukan tertumpu di satu tempat). Pemain boleh mengunci sasaran secara automatik (auto-aim) atau mengklik/menyentuh terus zombie pada skrin 3D untuk memulakan cabaran soalan matematik. Selesai menjawab dengan betul, pistol blaster menembak laser dan zombie mati/menghilang dengan letupan kartun riang.

**Keperluan & Ciri:**
- Zombie mempunyai AI berkeliaran (*wandering waypoint AI*) di sekitar jalan raya, dataran dan taman.
- **Auto-Aim:** Apabila pemain berada dalam jarak tertentu (anggaran 15 unit), sasaran reticle (crosshair 🎯) akan dikunci secara automatik pada zombie terdekat dan avatar mengangkat lengan dalam pose membidik.
- **Click-to-Aim (Raycast):** Pemain boleh klik atau sentuh terus mana-mana zombie pada kanvas 3D untuk memilihnya sebagai sasaran cabaran.
- Butang Blaster (`[F]` pada papan kekunci atau butang sentuh 🔫) membuka dialog soalan matematik.
- Tembakan laser hanya dilepaskan selepas jawapan disahkan betul.
- Apabila ditembak betul, zombie mati/menghilang (*defeated*) disertai letupan zarah berwarna-warni dan taburan syiling.
- Zombie akan respawn selepas selang masa di lokasi rawak bandar supaya bandar sentiasa aktif.
- Tiada unsur darah atau keganasan grafik (100% mesra kanak-kanak).

### FR-010 — Math Shopping [P0]
**Penerangan:** Pemain membeli item menggunakan syiling dan menyelesaikan soalan jumlah atau baki.

**Kriteria penerimaan**
- Harga item dan baki dipaparkan dengan jelas.
- Game memeriksa syiling mencukupi sebelum transaksi.
- Jumlah yang betul diperlukan sebelum pembelian disahkan jika cabaran matematik digunakan.
- Syiling ditolak tepat sekali selepas transaksi sah.
- Item dimasukkan ke inventori atau kesan penggunaannya diberikan tepat sekali.
- Transaksi gagal tidak mengubah baki atau inventori.
- Tiada baki negatif dibenarkan.

### FR-011 — Dwi-Sistem Ganjaran: Point (Ranking) vs Coin (Kedai) [P0]
**Penerangan:** Permainan membezakan dengan jelas antara Point dan Coin:
1. **Point (Mata Skor 🏆):** Diperoleh khusus daripada menembak zombie dan menyelesaikan cabaran matematik. Digunakan khas untuk menentukan kedudukan pemain dalam **Papan Ranking (Leaderboard)**.
2. **Coin (Syiling 🪙):** Mata wang yang diperoleh daripada ganjaran dan kutipan di bandar, digunakan untuk transaksi membeli makanan di kedai (*Food Street*) atau membeli kosmetik.

**Kriteria penerimaan**
- HUD memaparkan kedua-dua baki Point dan Coin dengan jelas menggunakan ikon berbeza.
- Menembak zombie memberikan kedua-dua Point (cth. +20 pts) dan Coin (cth. +5 syiling).
- Transaksi kedai hanya menolak Coin dan tidak mengurangkan Point ranking pemain.
- Semua nilai menggunakan integer bukan negatif.

### FR-012 — Avatar customization [P1]
**Penerangan:** Pemain memilih rupa avatar dan membuka kosmetik asas.

**Kriteria penerimaan**
- Pilihan yang dibuka boleh digunakan.
- Item terkunci tidak boleh dipilih tanpa kos yang sah.
- Pembelian kosmetik menolak syiling sekali sahaja.
- Pilihan avatar disimpan dan dimuat semula selepas reload.
- Jika aset kosmetik gagal dimuatkan, avatar lalai digunakan.

### FR-013 — Tenaga dan item makanan [P1]
**Penerangan:** Makanan/minuman boleh memulihkan tenaga jika meter tenaga dimasukkan dalam MVP.

**Kriteria penerimaan**
- Nilai tenaga mempunyai minimum dan maksimum.
- Penggunaan item tidak melebihi nilai maksimum.
- Item ditolak daripada inventori hanya apabila penggunaan sah.
- Jika tenaga tidak dimasukkan dalam build MVP, kedai masih boleh berfungsi sebagai aktiviti matematik dan item koleksi.

### FR-014 — Save tempatan [P0]
**Penerangan:** Simpan kemajuan tanpa server.

**Data minimum**
- Versi save.
- Tetapan audio dan kawalan.
- Kedudukan respawn atau lokasi selamat.
- Pilihan avatar dan item dibuka.
- Syiling dan inventori.
- Status pintu/misi yang penting.
- Profil kesukaran dan ringkasan prestasi matematik.

**Kriteria penerimaan**
- Save dilakukan selepas perubahan penting dan pada titik selamat yang sesuai.
- Kegagalan storan tidak menyebabkan game crash; mesej ringkas ditunjukkan jika perlu.
- Save mempunyai `schemaVersion`.
- Data lama dimigrasikan jika boleh; jika tidak, pemulihan/reset dibuat dengan amaran jelas.
- Butang reset memerlukan pengesahan.
- Game tidak menyimpan nama sebenar atau maklumat peribadi yang tidak diperlukan.

### FR-015 — Offline-ready [P0]
**Penerangan:** Aplikasi boleh digunakan offline selepas cache awal lengkap.

**Keperluan teknikal**
- Sediakan web app manifest jika pengalaman pemasangan/PWA diperlukan.
- Service worker cache HTML, CSS, JavaScript, Three.js bundle dan aset teras.
- Aset runtime tidak bergantung pada CDN luar.
- Paparkan status ringkas jika cache awal belum lengkap atau pemasangan offline belum tersedia.
- Sediakan strategi cache versi dan pembersihan cache lama yang selamat.

**Kriteria penerimaan**
- Selepas lawatan online pertama dan cache lengkap, reload dalam mod offline boleh membuka game dan memainkan aliran teras.
- Tiada permintaan network yang wajib untuk dunia, soalan, interaksi atau save.
- Kemas kini aplikasi boleh mengganti cache tanpa memadam save pengguna.
- Ujian offline dibuat melalui origin HTTPS atau localhost yang menyokong service worker; membuka `file://` tidak dianggap kaedah deployment offline rasmi.

### FR-016 — Audio dan maklum balas [P1]
- Audio boleh dimatikan.
- Maklum balas betul/salah turut ditunjukkan secara visual.
- Kesan bunyi tidak menghalang arahan penting.
- Jika aset audio gagal dimuatkan, game terus boleh dimainkan.

### FR-017 — Aksesibiliti dan keselamatan kanak-kanak [P0]
- Tiada chat terbuka, iklan atau pembelian wang sebenar.
- Teks dan nombor mempunyai kontras yang sesuai.
- Butang sentuh cukup besar dan tidak terlalu rapat.
- Jangan bergantung pada warna sahaja untuk membezakan jawapan betul/salah.
- Elakkan penalti yang menimbulkan tekanan; kesilapan memberikan peluang belajar.
- Tetapan reset save tidak boleh diaktifkan secara tidak sengaja.

### FR-018 — Sistem Sesi Berbilang Pemain dan Papan Ranking (Leaderboard) [P0]
**Penerangan:** Membolehkan beberapa pemain bermain secara bergilir-gilir (cth. adik-beradik, rakan sekelas) pada peranti yang sama dengan sistem log masuk/keluar pantas tanpa memerlukan pendaftaran rumit.

**Kriteria penerimaan:**
- Pemain hanya perlu memasukkan nama (*username*) untuk memulakan atau menyambung sesi peribadi mereka.
- Setiap sesi menyimpan profil berasingan (baki Coin, kutipan Point, tahap kesukaran matematik, dan kustomisasi avatar).
- Pemain boleh bertukar sesi (*Switch Session / Logout*) pada bila-bila masa melalui butang profil di HUD.
- **Papan Ranking (Leaderboard):** Memaparkan senarai pemain disusun mengikut jumlah Point tertinggi dengan pingat 🥇, 🥈, 🥉 serta penanda "(Anda)" bagi sesi aktif.
- Papan ranking dan semua profil disimpan secara setempat (*Local-First*) dan berfungsi sepenuhnya tanpa internet.

## 8. Peraturan permainan

### 8.1 Math Door
1. Pemain memasuki jarak interaksi.
2. Tekan Interact.
3. Paparkan soalan dan input jawapan.
4. Jika salah, tunjuk petunjuk ringkas.
5. Jika betul, buka pintu dan beri ganjaran sekali.
6. Simpan status jika pintu itu progres kekal.

### 8.2 Math Blaster
1. Zombie tersedia dan menunjukkan soalan.
2. Pemain menekan Fire atau Interact untuk membuka panel.
3. Pemain memilih digit/jawapan dan mengesahkan.
4. Sistem semak jawapan.
5. Jika salah, berikan petunjuk dan benarkan percubaan semula.
6. Jika betul, mainkan animasi blaster dan zombie lari/bertukar menjadi syiling.
7. Tandakan encounter selesai sebelum memberikan ganjaran.

### 8.3 Math Shopping
1. Pemain memilih item.
2. Paparkan harga dan jumlah pembelian.
3. Soalan jumlah/baki dijana.
4. Jika jawapan salah, tunjuk bantuan visual.
5. Jika betul dan wang mencukupi, laksanakan transaksi secara atomik.
6. Kemas kini baki dan inventori.
7. Simpan perubahan.

## 9. UX dan kawalan

### Mobile & PWA (Installable Apps)
- **PWA Standalone Mode:** Disokong sepenuhnya melalui `manifest.json` dan `sw.js` (Web Manifest & Service Worker), membolehkan pemasangan terus di Home Screen telefon pintar dan Desktop tanpa app store. Butang pemasangan khas 📲 disediakan di HUD.
- **Forced Landscape:** Mod Melintang dikuatkuasakan (*enforced*). Jika peranti dikesan dalam mod menegak (Portrait), paparan sekatan `landscape-barrier` akan muncul menghalang permainan dan membimbing pemain memutarkan skrin serta menyediakan butang fullscreen orientation lock.
- **Virtual joystick kiri:** Kawalan analog pergerakan.
- **Butang Aksi Kanan:** Jump (🦘), Interact/Collect (💬) dan Blaster (🔫).
- **Panel nombor & pilihan berganda:** Butang nombor besar berwarna-warni yang mesra sentuhan kanak-kanak.
- **Input multitouch & pointer events:** Mengelakkan cubitan zoom tidak sengaja dan menyokong sentuhan serentak.

### Desktop
- WASD/arrow keys: pergerakan.
- Space: jump.
- E: interact/collect.
- F: fire.
- Mouse: kamera jika dilaksanakan.
- UI panel boleh digunakan dengan tetikus dan keyboard.

### Soalan dan maklum balas
- Satu soalan utama pada satu masa.
- Nombor besar dan ruang kosong yang mencukupi.
- Arahan ringkas, tidak lebih daripada yang diperlukan.
- Berikan peluang mencuba lagi.
- Petunjuk visual seperti objek boleh dikira untuk tahap awal.

## 10. Cadangan seni bina teknikal

### 10.1 Lapisan aplikasi
- **Presentation/UI:** menu, HUD, dialog matematik, inventori dan tetapan.
- **Game loop/rendering:** Three.js scene, renderer, camera dan animation loop.
- **World/interactions:** peta, collision, trigger, pintu, kedai dan zombie.
- **Gameplay systems:** math engine, adaptive difficulty, coins, inventory, avatar dan progression.
- **Persistence:** save/load tempatan dan migrasi versi.
- **Offline/PWA:** manifest, service worker dan cache aset.

### 10.2 Modul cadangan
- `GameApp`: lifecycle aplikasi dan state global.
- `WorldScene`: scene Three.js dan penciptaan dunia.
- `PlayerController`: input, gerakan, jump dan collision.
- `CameraController`: kamera third-person.
- `InputManager`: abstraksi input mobile/desktop.
- `InteractionSystem`: jarak interaksi dan trigger.
- `MathEngine`: penjanaan dan semakan soalan.
- `DifficultyManager`: pelarasan tahap mengikut prestasi.
- `DoorController`: keadaan dan ganjaran pintu.
- `ZombieController`: state machine zombie dan blaster.
- `ShopSystem`: harga, transaksi dan baki.
- `InventorySystem`: item dan kosmetik.
- `ProgressionSystem`: syiling, XP dan misi.
- `SaveManager`: penyimpanan, versi dan migrasi.
- `AudioManager`: muzik dan kesan bunyi.
- `ServiceWorker`: caching dan kemas kini offline.

Nama modul ialah cadangan struktur; susunan fail sebenar boleh berubah asalkan tanggungjawab kekal jelas.

### 10.3 Teknologi
- HTML5 semantik untuk struktur.
- CSS untuk HUD dan layout responsif.
- JavaScript moden atau TypeScript jika projek memilih type safety.
- Three.js untuk rendering 3D.
- IndexedDB untuk save berstruktur; LocalStorage untuk tetapan kecil.
- Service worker dan manifest untuk pengalaman PWA/offline.
- Bundler seperti Vite boleh digunakan untuk mengurus modul dan aset.

### 10.4 Prinsip prestasi
- Aset low-poly dan tekstur bersaiz munasabah.
- Hadkan bayang-bayang masa nyata dan lampu mahal pada peranti rendah.
- Gunakan semula geometri/material untuk objek berulang.
- Elakkan terlalu banyak draw calls.
- Kurangkan kerja pengiraan yang tidak perlu dalam game loop.
- Sediakan tetapan grafik jika ujian peranti menunjukkan keperluan.
- Sasaran FPS dan peranti minimum ditentukan selepas ujian prototaip pada peranti sebenar.

## 11. Model data tempatan

Contoh struktur konseptual save; ini bukan API awam dan boleh disesuaikan semasa implementasi:

```json
{
  "schemaVersion": 1,
  "settings": {
    "musicEnabled": true,
    "sfxEnabled": true,
    "controlMode": "virtual-joystick",
    "graphicsQuality": "auto"
  },
  "player": {
    "coins": 100,
    "xp": 0,
    "level": 1,
    "safeSpawn": "town-square",
    "avatar": {
      "skin": "default",
      "hair": "default",
      "top": "default",
      "bottom": "default",
      "accessories": [],
      "unlockedCosmetics": ["default"]
    },
    "inventory": []
  },
  "progress": {
    "openedDoors": [],
    "completedMissions": [],
    "defeatedOrEscapedEncounters": []
  },
  "mathProfile": {
    "startingLevel": 1,
    "operations": {
      "addition": {
        "difficulty": 1,
        "recentCorrect": 0,
        "recentIncorrect": 0
      },
      "subtraction": {
        "difficulty": 1,
        "recentCorrect": 0,
        "recentIncorrect": 0
      },
      "multiplication": {
        "difficulty": 1,
        "recentCorrect": 0,
        "recentIncorrect": 0
      },
      "division": {
        "difficulty": 1,
        "recentCorrect": 0,
        "recentIncorrect": 0
      }
    }
  }
}
```

### Peraturan integriti data
- Semua jumlah syiling dan harga ialah integer bukan negatif.
- Transaksi kedai disahkan sebelum save dikemas kini.
- Ganjaran encounter ditandakan selesai sebelum boleh dituntut semula.
- Save divalidasi ketika dibaca; data yang tidak sah tidak boleh menyebabkan crash.
- Jangan simpan data peribadi yang tidak diperlukan.
- Save tempatan bukan sistem keselamatan anti-cheat; pengguna yang mengubah storan browser boleh mengubah kemajuan sendiri.

## 12. Model kandungan soalan

Setiap soalan sekurang-kurangnya mempunyai:
- `id`
- `operation`
- `operandA`
- `operandB`
- `answer`
- `difficulty`
- `context`
- `hintType` pilihan
- `choices` jika soalan pilihan berganda digunakan

### Peraturan mengikut operasi
- **Tambah:** operand dan julat hasil dikawal oleh tahap.
- **Tolak:** operand awal disusun supaya hasil tidak negatif.
- **Darab:** bermula dengan fakta darab kecil dan hasil terhad.
- **Bahagi:** divisor bukan sifar dan hasil integer untuk tahap awal.
- **Shopping:** jumlah harga dan baki tidak boleh melebihi atau menghasilkan baki negatif tanpa reka bentuk eksplisit.

## 13. Keperluan bukan fungsian

### Prestasi
- Masa mula dan sasaran FPS perlu diukur melalui prototaip pada peranti sasaran.
- Elakkan kebocoran memori daripada objek Three.js yang dicipta/dimusnah berulang kali.
- Animasi dan input kekal responsif semasa panel soalan dibuka.

### Kebolehgunaan
- Pemain baharu boleh memulakan pergerakan tanpa membaca manual panjang.
- Semua tindakan utama mempunyai maklum balas visual.
- Kesalahan tidak menyebabkan kehilangan progres.

### Kebolehpercayaan
- Save/load diuji merentasi reload dan penutupan browser biasa.
- Aset yang gagal dimuatkan mempunyai fallback jika sesuai.
- Game tidak memerlukan rangkaian untuk gameplay teras selepas cache lengkap.

### Privasi
- Tiada akaun atau penghantaran data pemain ke server dalam MVP.
- Tiada chat, iklan atau tracking pihak ketiga diperlukan.
- Nama avatar pilihan hendaklah disimpan secara tempatan sahaja.

### Keserasian
- Uji browser desktop dan mobile moden yang menyokong WebGL.
- Tetapkan senarai browser minimum selepas prototaip dan ujian sebenar.
- Service worker diuji pada HTTPS atau localhost.

## 14. Kriteria penerimaan MVP keseluruhan

MVP boleh dianggap sedia untuk ujian pengguna apabila:

1. Pengguna boleh memulakan game, mengawal avatar dan meneroka bandar kecil.
2. Kawalan mobile virtual joystick dan kawalan desktop berfungsi.
3. Math Door, Math Blaster dan Math Shopping boleh diselesaikan dari awal hingga akhir.
4. Jawapan disemak dengan betul untuk keempat-empat operasi yang dibenarkan oleh tahap.
5. Sistem adaptif melaras kesukaran mengikut peraturan yang boleh diuji.
6. Jawapan salah tidak menolak syiling atau memadam progres.
7. Syiling dan item tidak berubah secara berganda akibat input berulang.
8. Save kekal selepas reload dalam keadaan storan browser biasa.
9. Game boleh dimuatkan dan dimainkan offline selepas cache awal lengkap.
10. Tiada akaun, server, chat terbuka, iklan atau pembelian sebenar diperlukan.
11. UI boleh dibaca dan digunakan pada saiz skrin sasaran.
12. Game tidak crash apabila save tiada, rosak atau tidak serasi.

## 15. Pelan ujian

### Ujian fungsi
- Gerakan, jump, collision dan kamera.
- Interaksi pintu, zombie dan kedai.
- Jawapan betul dan salah bagi setiap operasi.
- Adaptasi kesukaran selepas urutan jawapan yang ditetapkan.
- Ganjaran dan transaksi sekali sahaja.
- Customization serta item terkunci.

### Ujian save
- Save baharu.
- Save/load selepas reload.
- Data tidak lengkap atau rosak.
- Versi schema lama.
- Reset save dan pengesahan.
- Storan penuh atau gagal jika boleh disimulasikan.

### Ujian offline
- Cache lengkap ketika online.
- Tutup browser dan buka semula.
- Putuskan rangkaian.
- Reload dan jalankan gameplay teras.
- Pastikan tiada aset kritikal diminta daripada CDN.
- Kemas kini versi aplikasi tanpa memadam save.

### Ujian peranti
- Desktop dengan keyboard dan mouse.
- Telefon dengan sentuhan multitouch.
- Orientasi landscape dan keadaan apabila permintaan orientasi tidak disokong.
- Prestasi pada peranti berkuasa rendah dan sederhana.
- Paparan UI pada nisbah skrin berlainan.

### Ujian kesesuaian umur
- Minta kanak-kanak/penjaga mencuba di bawah pengawasan yang sesuai.
- Perhatikan sama ada arahan dan kawalan mudah difahami.
- Pastikan zombie tidak menakutkan dan maklum balas salah tidak memalukan.
- Gunakan dapatan ujian untuk melaras saiz UI, petunjuk dan tahap soalan.

## 16. Risiko dan keputusan terbuka

| Perkara | Keputusan/ tindakan |
|---|---|
| Skop peta MVP | Satu bandar kecil yang bersambung. |
| Kamera | Third-person. |
| Zombie | Lari atau bertukar menjadi syiling selepas jawapan betul. |
| Kesukaran | Adaptif, dengan tahap permulaan yang boleh dikonfigurasi. |
| Mata wang | Syiling sahaja. |
| Kawalan mobile | Virtual joystick. |
| Orientasi | Landscape diutamakan; fallback jika lock tidak disokong. |
| Sistem tenaga | P1; boleh ditangguh tanpa menghalang kedai matematik. |
| Interior bangunan | Tidak wajib untuk semua bangunan dalam MVP. |
| Target FPS/peranti minimum | Tetapkan selepas prototaip dan ujian peranti sebenar. |
| Multiplayer | Di luar skop MVP. |

## 17. Pelan pelaksanaan berfasa

### Fasa 1 — Technical prototype
- Scene Three.js.
- Bandar blockout.
- Avatar, kamera, pergerakan, jump dan collision.
- Kawalan desktop dan virtual joystick.

### Fasa 2 — Math interaction prototype
- UI soalan.
- Math engine.
- Math Door.
- Math Blaster dengan satu zombie.
- Math Shopping dengan beberapa item.

### Fasa 3 — Progression and save
- Syiling, inventori, kosmetik asas dan adaptasi.
- SaveManager dan migrasi schema.
- Maklum balas audio/visual.

### Fasa 4 — Offline and polish
- Service worker, manifest dan cache aset.
- UI responsif dan fallback orientasi.
- Pengoptimuman prestasi.
- Ujian offline dan ujian peranti.

### Fasa 5 — MVP validation
- Ujian aliran penuh.
- Ujian save dan transaksi.
- Ujian dengan penjaga/kanak-kanak secara sesuai.
- Baiki isu kritikal sebelum menambah kandungan.

---

**Definisi siap:** MVP siap apabila satu pemain boleh meneroka bandar, menjawab soalan pada pintu/zombie/kedai, menerima ganjaran yang sah, menyimpan kemajuan pada peranti dan memainkan aliran teras tanpa internet selepas cache awal lengkap.
