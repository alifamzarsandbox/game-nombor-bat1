/**
 * LearningScene: Modul 1 (Angka Arab) & Modul 2 (Perkataan Nombor Arab)
 * Antara muka kad pembelajaran interaktif, warna ceria dan tipografi Arab berkualiti tinggi
 */

import { ARABIC_NUMBERS } from "../data/numbers.js";
import { gameStorage, unescapeStudentName } from "../systems/storage.js";
import { sheetsSync } from "../systems/sheetsSync.js";
import { audioSystem } from "../systems/audio.js";

export class LearningScene extends Phaser.Scene {
  constructor() {
    super("LearningScene");
  }

  init(data) {
    this.currentModule = data && data.initialModule ? data.initialModule : 1;
    this.currentCardIndex = 0; // 0 hingga 9 (Nombor 1 hingga 10)
    this.totalCards = ARABIC_NUMBERS.length;
    this.studentName = unescapeStudentName(gameStorage.session.studentName || "Murid");
  }

  create() {
    // Sembunyikan kawalan maya dan HUD semasa mod pembelajaran
    const virtualControls = document.getElementById("virtual-controls");
    if (virtualControls) virtualControls.style.display = "none";

    const hud = document.getElementById("game-hud");
    if (hud) hud.style.display = "none";

    // Bina UI Pembelajaran melalui DOM Overlay untuk resolusi teks dan fon Arab sempurna
    this.createLearningDOM();
  }

  createLearningDOM() {
    let overlay = document.getElementById("learning-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "learning-overlay";
      overlay.className = "learning-container";
      document.getElementById("game-container").appendChild(overlay);
    }
    overlay.style.display = "flex";
    this.overlay = overlay;

    this.renderCurrentCard();
  }

  renderCurrentCard() {
    const item = ARABIC_NUMBERS[this.currentCardIndex];
    const isMod1 = this.currentModule === 1;
    const progressPercent = Math.round(((this.currentCardIndex + 1) / this.totalCards) * 100);

    // Ikon visual mengikut bilangan (cth: bintang / epal kecil)
    let countDotsHtml = "";
    for (let i = 0; i < item.iconCount; i++) {
      countDotsHtml += `<span class="count-dot" style="animation-delay: ${i * 0.08}s">⭐</span>`;
    }

    this.overlay.innerHTML = `
      <div class="learning-modal">
        <!-- Tajuk Modul & Tab Penukar Modul -->
        <div class="learning-header">
          <div class="module-tabs">
            <button id="tab-mod1" class="tab-btn ${isMod1 ? "active" : ""}">
              MODUL 1: ANGKA ARAB
            </button>
            <button id="tab-mod2" class="tab-btn ${!isMod1 ? "active" : ""} ${
              !gameStorage.session.module1Completed && isMod1 ? "disabled" : ""
            }">
              MODUL 2: PERKATAAN ARAB ${!gameStorage.session.module1Completed && isMod1 ? "🔒" : ""}
            </button>
          </div>
          <button id="btn-close-learning" class="btn-close-modal" title="Kembali ke Sekolah">✕</button>
        </div>

        <!-- Bar Kemajuan Kad -->
        <div class="progress-bar-container">
          <div class="progress-bar-fill" style="width: ${progressPercent}%;"></div>
        </div>
        <div class="card-progress-label">Kad ${this.currentCardIndex + 1} daripada ${this.totalCards}</div>

        <!-- Kad Pembelajaran Utama -->
        <div class="learning-card" style="border-top-color: ${item.color};">
          ${
            isMod1
              ? `
              <!-- MODUL 1: Angka Biasa -> Angka Arab -->
              <div class="card-body-mod1">
                <div class="num-comparison">
                  <div class="num-box regular">
                    <span class="num-label">Nombor Biasa</span>
                    <span class="num-val">${item.number}</span>
                  </div>
                  <div class="arrow-connector">➔</div>
                  <div class="num-box arabic" style="color: ${item.color};">
                    <span class="num-label">Angka Arab</span>
                    <span class="num-val arabic-numeral">${item.arabicNumeral}</span>
                  </div>
                </div>

                <div class="visual-counting-box">
                  <div class="count-dots">${countDotsHtml}</div>
                  <div class="count-hint">${item.hint}</div>
                </div>
              </div>
              `
              : `
              <!-- MODUL 2: Angka Arab -> Perkataan Arab dengan Baris -->
              <div class="card-body-mod2">
                <div class="arabic-word-display">
                  <div class="arabic-num-badge">${item.arabicNumeral}</div>
                  <div class="arabic-word" dir="rtl" lang="ar">${item.arabicWord}</div>
                  <div class="transliteration">"${item.transliteration}"</div>
                  <div class="meaning-malay">Maksud: <b>${item.meaningMalay} (${item.number})</b></div>
                </div>

                <div class="visual-counting-box">
                  <div class="count-dots">${countDotsHtml}</div>
                </div>
              </div>
              `
          }
        </div>

        <!-- Butang Navigasi Kad -->
        <div class="learning-nav-footer">
          <button id="btn-card-prev" class="btn-nav secondary" ${
            this.currentCardIndex === 0 ? "disabled" : ""
          }>
            ◀ SEBELUM
          </button>

          <button id="btn-card-review" class="btn-nav outline">
            🔄 ULANG KAJI
          </button>

          ${
            this.currentCardIndex < this.totalCards - 1
              ? `<button id="btn-card-next" class="btn-nav primary">
                  SETERUSNYA ▶
                 </button>`
              : `<button id="btn-card-finish" class="btn-nav success">
                  SELESAI BELAJAR ✓
                 </button>`
          }
        </div>
      </div>
    `;

    // Pasang Event Listeners
    this.bindCardEvents();
  }

  bindCardEvents() {
    const tabMod1 = document.getElementById("tab-mod1");
    const tabMod2 = document.getElementById("tab-mod2");
    const closeBtn = document.getElementById("btn-close-learning");
    const prevBtn = document.getElementById("btn-card-prev");
    const nextBtn = document.getElementById("btn-card-next");
    const reviewBtn = document.getElementById("btn-card-review");
    const finishBtn = document.getElementById("btn-card-finish");

    if (tabMod1) {
      tabMod1.onclick = () => {
        if (this.currentModule !== 1) {
          audioSystem.playClick();
          this.currentModule = 1;
          this.currentCardIndex = 0;
          this.renderCurrentCard();
        }
      };
    }

    if (tabMod2) {
      tabMod2.onclick = () => {
        if (gameStorage.session.module1Completed) {
          if (this.currentModule !== 2) {
            audioSystem.playClick();
            this.currentModule = 2;
            this.currentCardIndex = 0;
            this.renderCurrentCard();
          }
        } else {
          audioSystem.playWrong();
          alert("Sila selesaikan Modul 1 terlebih dahulu sebelum membuka Modul 2!");
        }
      };
    }

    if (closeBtn) {
      closeBtn.onclick = () => {
        audioSystem.playClick();
        this.exitToWorld();
      };
    }

    if (prevBtn) {
      prevBtn.onclick = () => {
        if (this.currentCardIndex > 0) {
          audioSystem.playClick();
          this.currentCardIndex--;
          this.renderCurrentCard();
        }
      };
    }

    if (nextBtn) {
      nextBtn.onclick = () => {
        if (this.currentCardIndex < this.totalCards - 1) {
          audioSystem.playClick();
          this.currentCardIndex++;
          this.renderCurrentCard();
        }
      };
    }

    if (reviewBtn) {
      reviewBtn.onclick = () => {
        audioSystem.playClick();
        this.currentCardIndex = 0;
        this.renderCurrentCard();
      };
    }

    if (finishBtn) {
      finishBtn.onclick = () => {
        audioSystem.playCorrect();
        this.handleModuleCompletion();
      };
    }
  }

  handleModuleCompletion() {
    if (this.currentModule === 1) {
      // Modul 1 selesai
      gameStorage.completeModule1();
      sheetsSync.sync(); // Segerak ke Google Sheets

      // Buka modal tahniah Modul 1 dan tawarkan Modul 2
      this.overlay.innerHTML = `
        <div class="completion-mini-modal">
          <div class="star-badge">🌟</div>
          <h2>TAHNIAH, ${this.studentName}!</h2>
          <p>Kamu telah berjaya mengenali angka Arab <b>١ hingga ١٠</b> dalam Modul 1!</p>
          <div class="completion-mini-actions">
            <button id="btn-go-mod2" class="btn-nav primary">
              TERUSKAN KE MODUL 2 (PERKATAAN ARAB) ▶
            </button>
            <button id="btn-back-class" class="btn-nav secondary">
              KEMBALI KE KELAS
            </button>
          </div>
        </div>
      `;

      document.getElementById("btn-go-mod2").onclick = () => {
        audioSystem.playClick();
        this.currentModule = 2;
        this.currentCardIndex = 0;
        this.renderCurrentCard();
      };

      document.getElementById("btn-back-class").onclick = () => {
        audioSystem.playClick();
        this.exitToWorld();
      };

    } else {
      // Modul 2 selesai -> Kedua-dua modul lengkap!
      gameStorage.completeModule2();
      sheetsSync.sync(); // Segerak ke Google Sheets

      this.overlay.innerHTML = `
        <div class="completion-mini-modal">
          <div class="star-badge">🎉</div>
          <h2>TAHNIAH, ${this.studentName}!</h2>
          <p class="congrats-main-text">
            KAMU SUDAH BELAJAR NOMBOR ARAB 1–10!
          </p>
          <p class="congrats-sub-text">
            Pintu ke <b>Kantin</b> (Misi Pesanan Makanan) dan <b>Padang</b> (Misi Mengira) kini telah dibuka sepenuhnya!
          </p>
          <div class="completion-mini-actions">
            <button id="btn-explore-school" class="btn-nav success">
              TEROKA SEKOLAH SEKARANG 🏫
            </button>
            <button id="btn-review-both" class="btn-nav outline">
              ULANG KAJI DAHULU 📖
            </button>
          </div>
        </div>
      `;

      document.getElementById("btn-explore-school").onclick = () => {
        audioSystem.playClick();
        this.exitToWorld();
      };

      document.getElementById("btn-review-both").onclick = () => {
        audioSystem.playClick();
        this.currentModule = 1;
        this.currentCardIndex = 0;
        this.renderCurrentCard();
      };
    }
  }

  exitToWorld() {
    if (this.overlay) {
      this.overlay.style.display = "none";
    }
    // Pulihkan HUD dan kawalan
    const hud = document.getElementById("game-hud");
    if (hud) hud.style.display = "flex";

    const virtualControls = document.getElementById("virtual-controls");
    if (virtualControls && ("ontouchstart" in window || window.innerWidth <= 1024)) {
      virtualControls.style.display = "block";
    }

    this.scene.start("WorldScene");
  }
}
