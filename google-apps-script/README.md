# PANDUAN INTEGRASI GOOGLE SHEETS & GOOGLE APPS SCRIPT
## MISI NOMBOR ARAB: KELAS 1 GAMMA (EDISI TERKINI DENGAN LEADERBOARD)

Panduan ini menerangkan cara menyediakan Google Sheets dan Google Apps Script untuk merekod kemajuan murid, markah ujian akhir, dan menjana Leaderboard automatik.

---

### LANGKAH 1: CIPTA GOOGLE SPREADSHEET BAHARU

1. Buka pelayar web dan layari [Google Sheets](https://sheets.new).
2. Namakan spreadsheet tersebut:  
   **`REKOD MISI NOMBOR ARAB — 1 GAMMA`**

---

### LANGKAH 2: BUKA GOOGLE APPS SCRIPT

1. Pada menu atas Google Sheets, klik **Extensions** (Pelanjutan) > **Apps Script**.
2. Padam sebarang kod sedia ada di dalam fail `Code.gs`.
3. Buka fail `google-apps-script/Code.gs` dari projek ini, salin kesemua isinya, dan tampal ke dalam editor Apps Script.
4. Klik ikon **Simpan** (ikon cakera liut atau `Ctrl + S`).

---

### LANGKAH 3: JALANKAN SETUP TAB & LEADERBOARD

1. Pada menu dropdown fungsi di sebelah butang "Run", pilih fungsi **`setupSheet`**.
2. Klik butang **Run** (Jalankan).
3. Berikan kebenaran Google (*Review Permissions* > *Advanced* > *Go to Untitled project (unsafe)* > *Allow*).
4. Skrip akan mencipta dua tab secara automatik:
   - **`RekodPermainan`**: Merekod sesi permainan murid (15 lajur).
   - **`Leaderboard`**: Memaparkan 10 murid terbaik berdasarkan markah Ujian Akhir /10!

---

### LANGKAH 4: DEPLOY SEBAGAI WEB APP

1. Di penjuru kanan atas editor Apps Script, klik **Deploy** > **New deployment**.
2. Klik ikon gear (Select type) > Pilih **Web app**.
3. Tetapkan:
   - **Description**: `Misi Nombor Arab v2.0 Leaderboard`
   - **Execute as**: `Me` (Akaun e-mel guru)
   - **Who has access**: **`Anyone`** *(Wajib "Anyone" supaya murid boleh menghantar keputusan dan memuat turun Leaderboard tanpa perlu log masuk akaun Google).*
4. Klik **Deploy**.
5. Salin **Web App URL** yang berakhir dengan `/exec`.

---

### LANGKAH 5: TAMPAL URL DALAM PERMAINAN

1. Buka fail `src/config.js` di dalam projek permainan.
2. Tampal URL tersebut pada `appsScriptUrl`:
   ```javascript
   export const GAME_CONFIG = {
     className: "1 Gamma",
     teacherName: "Ustaz Alif",
     gameName: "Misi Nombor Arab",
     appsScriptUrl: "https://script.google.com/macros/s/AKfycb.../exec"
   };
   ```
3. Simpan fail. Semua markah dan leaderboard kini disegerakkan secara langsung!
