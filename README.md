# MISI NOMBOR ARAB — KELAS 1 GAMMA (EDISI 2.5D HD-2D)
### Permainan Pendidikan Bahasa Arab 2.5D RPG Isometrik untuk Murid Tahun 1 (Sekolah Rendah)

![Kelas](https://img.shields.io/badge/Kelas-1%20Gamma-blue?style=for-the-badge)
![Subjek](https://img.shields.io/badge/Subjek-Bahasa%20Arab%20Tahun%201-emerald?style=for-the-badge)
![Guru](https://img.shields.io/badge/Guru-Ustaz%20Alif-orange?style=for-the-badge)
![Pembimbing](https://img.shields.io/badge/Murid%20Pembimbing-Hana-pink?style=for-the-badge)
![Guru PJ](https://img.shields.io/badge/Guru%20PJ-Cikgu%20Amir-red?style=for-the-badge)
![Engine](https://img.shields.io/badge/Engine-Three.js%20HD--2D-purple?style=for-the-badge)
![Hosting](https://img.shields.io/badge/Hosting-GitHub%20Pages-black?style=for-the-badge)
![Database](https://img.shields.io/badge/Database-Google%20Sheets-green?style=for-the-badge)

---

## 1. JALAN CERITA & KONSEP BAHARU PERMAINAN

Pemain melakonkan watak seorang murid Tahun 1 di **Kelas 1 Gamma** yang baru kembali ke sekolah setelah tidak hadir semalam kerana demam. Hari ini, pemain perlu mengejar pembelajaran nombor Bahasa Arab yang tertinggal:

1. **Pilihan Karakter & Nama**:
   - 👦 **Murid Lelaki**: Kemeja putih sekolah rendah, seluar panjang biru gelap, kasut sekolah & tali leher.
   - 👧 **Murid Perempuan**: **Tudung putih kemas labuh menutup rambut dan dada sepenuhnya**, baju kurung putih, dan kain sarung biru tua sekolah.
2. **Kelas 1 Gamma (Lokasi Mula Permainan - Tepat 5 NPC)**:
   - **Ustaz Alif** (Guru Bahasa Arab): Mengajar **Modul A (Angka biasa 1–10 ➔ Angka Arab ١–١٠)**, diikuti **Mini Kuiz (3 Soalan)** yang wajib mencapai markah penuh 3/3 sebelum Modul A disahkan selesai.
   - **Hana** (Murid Pembimbing Bertudung): Membimbing pemain bagi **Modul B (Angka Arab ١–١٠ ➔ Perkataan Arab berbaris penuh)** seperti *وَاحِدٌ*, *اِثْنَانِ*, *ثَلَاثَةٌ*, dsb.
   - **Ali, Sarah (bertudung), Danish**: Tiga rakan sekelas yang mesra dan memberi kata semangat.
   - **SEKATAN PINTU KELAS**: Pintu keluar koridor dikunci rapat sehingga pemain menamatkan pembelajaran bersama Ustaz Alif (Modul A + Mini Kuiz 3/3) dan Hana (Modul B).
3. **Penerokaan Sekolah & Side Quests**:
   - **Kantin Sekolah (Tepat 4 NPC)**:
     - **Makcik Kantin**: Side Quest mengira pesanan makanan (*aiskrim 🍦, ayam goreng 🍗, nasi 🍚, roti 🍞, kotak minuman 🧃*) ➔ Padankan dengan angka Arab. Raih Lencana **PEMBANTU KANTIN**.
     - **Ahmad, Auni (bertudung), Farid**: Tiga murid yang sedang berehat di kantin.
   - **Padang Sukan Sekolah (Tepat 3 NPC)**:
     - **Cikgu Amir** (Guru PJ): Side Quest mengira peralatan sukan (*bola sepak ⚽, kon 🟧, raket 🏸, botol air 🍶, wisel 🎵*) ➔ Padankan dengan perkataan Bahasa Arab berbaris. Raih Lencana **WIRA PADANG**.
     - **Hariz & Hakim**: Dua murid yang sedang bermain sukan di padang.
4. **Notifikasi "SEMUA MISI SELESAI!"**:
   - Sebaik sahaja kedua-dua Side Quest di Kantin dan Padang diselesaikan, tetingkap notifikasi muncul mengajak pemain kembali ke Kelas 1 Gamma dengan butang satu klik pintas.
5. **Ujian Akhir Bahasa Arab Bersama Ustaz Alif**:
   - Mengandungi **10 soalan padanan** (angka biasa ➔ angka Arab, angka Arab ➔ angka biasa, angka Arab ➔ perkataan Arab, perkataan Arab ➔ angka Arab) tanpa gambar makanan/sukan.
   - Pilihan jawapan dikunci serta-merta selepas dipilih.
6. **Skrin Kemenangan (Grand Victory) & Papan Leaderboard**:
   - Paparan sprite chibi pemain, maklum balas motivasi berdasarkan markah /10, lencana **PEMBELAJAR CEMERLANG**, perincian markah, dan paparan **Top 10 Leaderboard** secara langsung daripada Google Sheets tab `Leaderboard`.
   - Mesej rasmi kejayaan: **“TAHNIAH, [NAMA PEMAIN]! ANDA TELAH MENAMATKAN MISI NOMBOR ARAB!”**

---

## 2. KAWALAN PERMAINAN

| Platform | Kawalan |
|---|---|
| **Laptop & PC** | **WASD** atau **Anak Panah**: Bergerak<br>**E**, **Spacebar**, atau **Enter**: Berinteraksi / Bercakap<br>**Tetikus (Heret)**: Memutarkan sudut kamera isometrik<br>**F2**: Membuka / menutup panel diagnostik debug |
| **Telefon Pintar & Tablet** | **D-Pad Maya (Kiri Bawah)**: Bergerak<br>**Butang Aksi "E" (Kanan Bawah)**: Berinteraksi / Bercakap<br>**Sentuhan Skrin**: Pilihan jawapan kuiz yang besar dan responsif |

---

## 3. CARA MENJALANKAN SECARA SETEMPAT (LOCAL)

Klik dua kali pada fail:
👉 **`start-game.bat`**

Pelayan tempatan akan dibuka secara automatik di pelayar web anda melalui `http://localhost:8080/`.

---

## 4. PENERBITAN KE GITHUB PAGES

1. Muat naik (*git push*) kod ke repositori GitHub anda:
   - `index.html`
   - `style.css`
   - `src/`
   - `google-apps-script/`
2. Di repositori GitHub: Pergi ke **Settings** ➔ **Pages** ➔ Pilih cawangan **`main`** dan folder **`/ (root)`** ➔ Tekan **Save**.
3. Permainan boleh diakses secara langsung oleh murid melalui internet!

---

## 5. INTEGRASI GOOGLE SHEETS & LEADERBOARD

1. Cipta Google Sheets baharu di [sheets.new](https://sheets.new).
2. Buka **Extensions** ➔ **Apps Script**, salin dan tampal kod dari `google-apps-script/Code.gs`.
3. Jalankan fungsi **`setupSheet()`** sekali untuk mencipta tab **`RekodPermainan`** (15 kolum) dan tab **`Leaderboard`** (5 kolum).
4. Tekan **Deploy** ➔ **New deployment** (Jenis: *Web app*, Execute as: *Me*, Who has access: *Anyone*).
5. Salin Web App URL (berakhir dengan `/exec`) dan tampal pada parameter `appsScriptUrl:` di dalam `src/config.js`.
