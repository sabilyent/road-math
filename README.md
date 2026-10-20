# 🚗 Road Math (Bijak Math: Math City Adventure)

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Three.js](https://img.shields.io/badge/Three.js-black?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![Platform](https://img.shields.io/badge/Platform-Web%20%7C%20Mobile%20%7C%20Desktop-blue?style=for-the-badge)](https://sabilyent.github.io/road-math)
[![Status](https://img.shields.io/badge/Status-MVP%20Development-orange?style=for-the-badge)](#)

> **Road Math** (*Bijak Math: Math City Adventure*) ialah sebuah permainan 3D pendidikan berasaskan web (HTML5) yang direka khas untuk kanak-kanak (sekitar umur 4–7 tahun). Permainan ini menggabungkan penerokaan bandar secara santai ala dunia terbuka mini dengan cabaran matematik asas (tambah, tolak, darab, dan bahagi) secara interaktif dan adaptif.

---

## 🌐 Pautan Permainan (Live Servers)

Pemain boleh mengakses dan bermain permainan ini secara terus melalui pelayar web (browser) tanpa perlu memasang sebarang aplikasi luaran:

* 🚀 **Server 1 (GitHub Pages):**  
  👉 **[https://sabilyent.github.io/road-math](https://sabilyent.github.io/road-math)**

* ⚡ **Server 2 (Cermin / Domain Rasmi):**  
  👉 **[https://road-math.sabily.info](https://road-math.sabily.info)**

> *Kedua-dua pelayan menyediakan binaan permainan terkini dan menyokong mod offline selepas aset pertama kali dimuatkan.*

---

## 🎯 Visi & Pengalaman Pemain

Bukan sekadar kuiz di atas kertas, **Road Math** menjadikan matematik sebagai kunci utama pengembaraan:
- **Belajar Sambil Meneroka:** Operasi matematik menjadi sebahagian daripada interaksi dunia (membuka pintu rahsia, membeli makanan, dan memenangi cabaran).
- **Galakan Positif (Bukan Hukuman):** Kesilapan jawapan tidak mematikan watak; sebaliknya memberikan petunjuk visual dan peluang mencuba semula.
- **Kanak-Kanak Mesra & Selamat:** Tiada keganasan, tiada iklan (ads), tiada transaksi wang sebenar, dan tiada ruang sembang terbuka (chat).
- **Single-Player & Local-First:** Tiada pendaftaran akaun atau sambungan pelayan berterusan diperlukan. Kemajuan pemain disimpan secara selamat terus di dalam peranti.

---

## ✨ Ciri-Ciri Utama

| Ciri | Penerangan |
| :--- | :--- |
| 🏙️ **Math City 3D** | Bandar 3D *low-poly* yang ceria merangkumi **Town Square**, **Food Street**, dan **Zombie Park**. |
| ➕ **Sistem Matematik Adaptif** | Meliputi operasi Tambah (+), Tolak (-), Darab (×), dan Bahagi (÷) dengan tahap kesukaran yang melaras secara automatik mengikut prestasi pemain. |
| 🧟 **Zombie Kartun Mesra** | Menghadapi zombie kartun yang comel. Apabila soalan dijawab betul, zombie akan bertukar menjadi syiling atau melarikan diri secara kelakar. |
| 🪙 **Ekonomi Satu Mata Wang** | Mengumpul syiling hasil menyelesaikan cabaran untuk membeli makanan, minuman, dan kostum avatar di kedai. |
| 📱 **Kawalan Dwi-Platform** | Sokongan penuh untuk **Desktop** (papan kekunci & tetikus) dan **Mobile/Tablet** (virtual joystick & butang sentuh pada skrin). |
| 💾 **Offline-Ready & Auto-Save** | Simpanan automatik ke *Local Storage* / *IndexedDB*. Boleh dimainkan di mana-mana sahaja walaupun tiada sambungan internet. |

---

## 🎮 Kawalan Permainan (Controls)

### 💻 Komputer / Laptop (Desktop)
| Tindakan | Kawalan Papan Kekunci |
| :--- | :--- |
| **Bergerak** | Kekunci `W`, `A`, `S`, `D` atau Anak Panah (`↑`, `←`, `↓`, `→`) |
| **Lompat (Jump)** | Bar Ruang (`Spacebar`) |
| **Interaksi (Interact)** | Kekunci `E` atau `Enter` |
| **Kawalan Kamera** | Tetikus / Sentuh & Seret |

### 📱 Telefon Pintar / Tablet (Mobile)
| Tindakan | Kawalan Skrin Sentuh |
| :--- | :--- |
| **Bergerak** | *Virtual Joystick* di bahagian kiri skrin |
| **Lompat (Jump)** | Butang ikon Lompat di bahagian kanan skrin |
| **Interaksi (Interact)** | Butang ikon Tindakan / Soalan apabila menghampiri objek |
| **Pilihan Jawapan** | Pad nombor dan pilihan jawapan bersaiz besar mesra sentuhan |

---

## 🛠️ Teknologi & Seni Bina

Projek ini dibangunkan berasaskan teknologi web standard tanpa pergantungan enjin berat:

- **Enjin Paparan 3D:** [Three.js](https://threejs.org/) (WebGL)
- **Bahasa Pembangunan:** HTML5, CSS3, JavaScript (ES6 Modules)
- **Pengurusan Aset & Bina:** [Vite](https://vitejs.dev/)
- **Seni Bina Sistem:**
  - `MathEngine`: Menguruskan penjanaan soalan, pengesahan, dan aras kesukaran secara terpisah.
  - `WorldScene` & `PlayerController`: Mengawal grafik, pergerakan watak, fizik ringkas, dan interaksi persekitaran.
  - `SaveManager`: Menyimpan data profil, syiling, dan tahap kecekapan secara setempat.
  - `Service Worker`: Menyediakan cache aset permainan untuk kegunaan luar talian (offline).

---

## 📁 Struktur Projek

```text
road-math/
├── index.html              # Pintu masuk utama aplikasi
├── package.json            # Konfigurasi dependensi dan skrip
├── vite.config.js          # Konfigurasi bundler Vite
├── README.md               # Dokumentasi projek
├── PRD.md                  # Spesifikasi keperluan produk terperinci
├── idea.md                 # Konsep reka bentuk dan visi permainan
├── Brainstorming.md        # Catatan perbincangan awal dan arkitektur
├── public/                 # Aset statik
│   ├── favicon.ico
│   ├── manifest.json       # PWA manifest
│   └── assets/
│       ├── models/         # Model 3D (.gltf / .glb)
│       ├── textures/       # Tekstur dan imej
│       └── audio/          # Kesan bunyi & muzik latar
└── src/                    # Kod sumber aplikasi
    ├── main.js             # Skrip permulaan
    ├── game/               # Logik dunia 3D & pemain
    ├── systems/            # MathEngine, DifficultyManager, SaveManager
    └── ui/                 # Paparan HUD, skrin cabaran & joystick
```

---

## 🚀 Pembangunan Tempatan (Local Development)

Sekiranya anda ingin menjalankan atau menguji projek ini di komputer tempatan:

1. **Klon Repositori:**
   ```bash
   git clone https://github.com/sabilyent/road-math.git
   cd road-math
   ```

2. **Pasang Dependensi:**
   ```bash
   npm install
   ```

3. **Jalankan Pelayan Pembangunan (Dev Server):**
   ```bash
   npm run dev
   ```
   Buka pelayar anda di alamat yang dipaparkan (kebiasaannya `http://localhost:5173`).

4. **Bina untuk Pengeluaran (Production Build):**
   ```bash
   npm run build
   ```

---

## 📚 Dokumen Berkaitan

Untuk maklumat mendalam mengenai perancangan dan spesifikasi:
- 📄 [PRD.md](file:///c:/Users/user/GitHub/road-math/PRD.md) — *Product Requirements Document* (Keperluan fungsi, formula matematik, dan kriteria penerimaan).
- 💡 [idea.md](file:///c:/Users/user/GitHub/road-math/idea.md) — Konsep reka bentuk, pengalaman pemain, dan dunia *Math City*.
- 🧠 [Brainstorming.md](file:///c:/Users/user/GitHub/road-math/Brainstorming.md) — Arkitektur modul dan cadangan fasa pembangunan.

---

## 📄 Hak Cipta & Lesen

Hak Cipta © 2026 **Sabily Enterprise (Sabilyent)**.  
Diterbitkan untuk tujuan pendidikan dan pembelajaran kanak-kanak.
