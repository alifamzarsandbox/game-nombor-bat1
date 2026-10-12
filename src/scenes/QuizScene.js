/**
 * QuizScene: Modul Kuiz Interaktif Kantin & Padang
 * 5 soalan setiap sesi, 3 pilihan jawapan mesra kanak-kanak,
 * perlindungan markah tanpa inflasi, dan penyegerakan automatik ke Google Sheets
 */

import { generateCanteenQuestions, generateFieldQuestions } from "../data/questions.js";
import { gameStorage, unescapeStudentName } from "../systems/storage.js";
import { sheetsSync } from "../systems/sheetsSync.js";
import { audioSystem } from "../systems/audio.js";

export class QuizScene extends Phaser.Scene {
  constructor() {
    super("QuizScene");
  }

  init(data) {
    this.quizType = data && data.quizType ? data.quizType : "canteen"; // "canteen" atau "field"
    this.studentName = unescapeStudentName(gameStorage.session.studentName || "Murid");
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.totalQuestions = 5;

    // Menjejak sama ada soalan ini dijawab betul pada percubaan pertama untuk elak manipulasi markah
    this.awardedQuestions = [false, false, false, false, false];
    this.hasTriedWrong = [false, false, false, false, false];

    // Jana 5 soalan unik bagi sesi ini
    this.questions =
      this.quizType === "canteen"
        ? generateCanteenQuestions()
        : generateFieldQuestions();
  }

  create() {
    // Sembunyikan kawalan maya dan HUD
    const virtualControls = document.getElementById("virtual-controls");
    if (virtualControls) virtualControls.style.display = "none";

    const hud = document.getElementById("game-hud");
    if (hud) hud.style.display = "none";

    this.createQuizDOM();
  }

  createQuizDOM() {
    let overlay = document.getElementById("quiz-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "quiz-overlay";
      overlay.className = "quiz-container";
      document.getElementById("game-container").appendChild(overlay);
    }
    overlay.style.display = "flex";
    this.overlay = overlay;

    this.renderQuestion();
  }

  renderQuestion() {
    if (this.currentQuestionIndex >= this.totalQuestions) {
      this.handleQuizFinished();
      return;
    }

    const q = this.questions[this.currentQuestionIndex];
    const isCanteen = this.quizType === "canteen";
    const themeTitle = isCanteen ? "KUIZ KANTIN : PESANAN MAKANAN" : "KUIZ PADANG : MISI MENGIRA";
    const themeColor = isCanteen ? "#F77F00" : "#2D6A4F";

    // Paparan objek untuk soalan jenis mengira (count)
    let visualItemsHtml = "";
    if (q.type === "count") {
      visualItemsHtml = `<div class="counting-items-grid">`;
      for (let i = 0; i < q.count; i++) {
        visualItemsHtml += `
          <div class="count-item-badge" style="animation-delay: ${i * 0.06}s;">
            <span class="count-item-emoji">${q.itemEmoji}</span>
          </div>
        `;
      }
      visualItemsHtml += `</div>`;
    }

    // Paparan highlight nombor (jika ada)
    let highlightHtml = "";
    if (q.promptHighlight) {
      const isArabic = q.isArabicHighlight;
      highlightHtml = `
        <div class="prompt-highlight-box ${isArabic ? "arabic-highlight" : ""}">
          <span class="highlight-val">${q.promptHighlight}</span>
        </div>
      `;
    }

    // Pilihan jawapan (3 pilihan besar)
    let optionsHtml = "";
    q.options.forEach((opt, idx) => {
      const isArabicFont = q.isOptionsArabicWords || opt.length <= 2;
      optionsHtml += `
        <button class="btn-quiz-option ${isArabicFont ? "arabic-font" : ""}" data-choice="${encodeURIComponent(opt)}">
          <span class="choice-num">${idx + 1}</span>
          <span class="choice-text" dir="auto">${opt}</span>
        </button>
      `;
    });

    this.overlay.innerHTML = `
      <div class="quiz-modal" style="border-top: 6px solid ${themeColor};">
        <div class="quiz-header">
          <div class="quiz-badge" style="background: ${themeColor};">${themeTitle}</div>
          <button id="btn-quiz-exit" class="btn-close-modal" title="Keluar ke Sekolah">✕</button>
        </div>

        <div class="quiz-progress-bar">
          <div class="quiz-progress-fill" style="width: ${((this.currentQuestionIndex + 1) / this.totalQuestions) * 100}%; background: ${themeColor};"></div>
        </div>

        <div class="quiz-meta-info">
          <span class="q-number">Soalan ${this.currentQuestionIndex + 1} daripada ${this.totalQuestions}</span>
          <span class="q-score">Markah Semasa: <b>${this.score}/5</b></span>
        </div>

        <div class="quiz-card">
          <h2 class="quiz-question-title">${q.title}</h2>
          <p class="quiz-question-text">${q.question}</p>

          ${visualItemsHtml}
          ${highlightHtml}

          <div id="quiz-feedback" class="quiz-feedback hidden"></div>

          <div class="quiz-options-container">
            ${optionsHtml}
          </div>
        </div>
      </div>
    `;

    this.bindOptionEvents(q);
  }

  bindOptionEvents(q) {
    const exitBtn = document.getElementById("btn-quiz-exit");
    if (exitBtn) {
      exitBtn.onclick = () => {
        if (confirm("Adakah kamu pasti mahu keluar dari kuiz ini sekarang? Kemajuan kuiz ini tidak akan disimpan.")) {
          audioSystem.playClick();
          this.exitToWorld();
        }
      };
    }

    const optionBtns = this.overlay.querySelectorAll(".btn-quiz-option");
    const feedbackEl = document.getElementById("quiz-feedback");

    optionBtns.forEach((btn) => {
      btn.onclick = () => {
        const choice = decodeURIComponent(btn.getAttribute("data-choice"));
        const isCorrect = choice === q.correctAnswer;

        if (isCorrect) {
          // JAWAPAN BETUL
          audioSystem.playCorrect();
          btn.classList.add("correct");

          // Kunci semua butang
          optionBtns.forEach((b) => (b.disabled = true));

          // Beri 1 markah hanya jika belum pernah dihadiahkan pada soalan ini
          if (!this.awardedQuestions[this.currentQuestionIndex]) {
            // Jika dijawab tanpa salah atau percubaan pertama, dapat markah penuh
            if (!this.hasTriedWrong[this.currentQuestionIndex]) {
              this.score = Math.min(5, this.score + 1);
            }
            this.awardedQuestions[this.currentQuestionIndex] = true;
          }

          feedbackEl.className = "quiz-feedback correct-feedback";
          feedbackEl.innerHTML = `
            <span class="fb-icon">✓</span>
            <span class="fb-text">Tahniah! Jawapan kamu tepat! ${q.explanation}</span>
          `;
          feedbackEl.classList.remove("hidden");

          // Beralih ke soalan seterusnya selepas 1.6 saat
          setTimeout(() => {
            this.currentQuestionIndex++;
            this.renderQuestion();
          }, 1600);

        } else {
          // JAWAPAN SALAH (Cuba lagi tanpa hukuman kasar)
          audioSystem.playWrong();
          btn.classList.add("wrong");
          this.hasTriedWrong[this.currentQuestionIndex] = true;

          feedbackEl.className = "quiz-feedback wrong-feedback";
          feedbackEl.innerHTML = `
            <span class="fb-icon">💡</span>
            <span class="fb-text">Kurang tepat, ${this.studentName}. Cuba perhatikan semula dan cuba lagi!</span>
          `;
          feedbackEl.classList.remove("hidden");

          // Benarkan butang diklik semula selepas seketika
          setTimeout(() => {
            btn.classList.remove("wrong");
          }, 800);
        }
      };
    });
  }

  handleQuizFinished() {
    audioSystem.playFanfare();

    const isCanteen = this.quizType === "canteen";

    // Rekod ke storage
    if (isCanteen) {
      gameStorage.recordCanteenQuiz(this.score);
    } else {
      gameStorage.recordFieldQuiz(this.score);
    }

    // Segerak ke Google Sheets
    sheetsSync.sync();

    // Semak sama ada kedua-dua kuiz telah tamat (Syarat Tamat Permainan)
    const isGameComplete = gameStorage.isGameCompleted ? gameStorage.isGameCompleted() : gameStorage.checkGameCompletion();

    const session = gameStorage.session;
    const finalScore = isCanteen ? session.canteenScore : session.fieldScore;
    const otherQuizDone = isCanteen ? session.fieldCompleted : session.canteenCompleted;

    this.overlay.innerHTML = `
      <div class="quiz-result-modal">
        <div class="result-celebration-icon">${finalScore >= 4 ? "🌟" : "👏"}</div>
        <h2 class="result-title">TAHNIAH, ${this.studentName}!</h2>
        <p class="result-mission-name">
          Kamu telah menyelesaikan ${isCanteen ? "Misi Kantin Sekolah" : "Misi Padang Sekolah"}!
        </p>

        <div class="result-score-card">
          <div class="score-display">
            <span class="score-big">${finalScore}</span>
            <span class="score-total">/ 5</span>
          </div>
          <p class="score-praise">
            ${
              finalScore === 5
                ? "Luar biasa! Markah penuh!"
                : finalScore >= 3
                ? "Bagus sekali usaha kamu!"
                : "Teruskan berusaha, kamu semakin mahir!"
            }
          </p>
        </div>

        <div class="result-status-summary">
          <div class="summary-item ${session.canteenCompleted ? "done" : "pending"}">
            <span>Kuiz Kantin:</span>
            <b>${session.canteenCompleted ? `${session.canteenScore}/5 ✓` : "Belum Selesai"}</b>
          </div>
          <div class="summary-item ${session.fieldCompleted ? "done" : "pending"}">
            <span>Kuiz Padang:</span>
            <b>${session.fieldCompleted ? `${session.fieldScore}/5 ✓` : "Belum Selesai"}</b>
          </div>
        </div>

        <div class="result-actions">
          ${
            isGameComplete
              ? `<button id="btn-go-victory" class="btn-res victory">
                  🏆 LIHAT SKRIN TAMAT PERMAINAN!
                 </button>`
              : ""
          }

          <button id="btn-quiz-retry" class="btn-res secondary">
            CUBA LAGI 🔄
          </button>

          ${
            !isGameComplete && isCanteen
              ? `<button id="btn-go-field" class="btn-res primary">
                  KE PADANG SEKARANG ⚽
                 </button>`
              : ""
          }

          ${
            !isGameComplete && !isCanteen
              ? `<button id="btn-go-canteen" class="btn-res primary">
                  KE KANTIN SEKARANG 🥟
                 </button>`
              : ""
          }

          <button id="btn-quiz-world" class="btn-res outline">
            TEROKA SEKOLAH 🚶
          </button>
        </div>
      </div>
    `;

    // Pasang actions
    const victoryBtn = document.getElementById("btn-go-victory");
    if (victoryBtn) {
      victoryBtn.onclick = () => {
        audioSystem.playClick();
        this.exitToScene("CompletionScene");
      };
    }

    document.getElementById("btn-quiz-retry").onclick = () => {
      audioSystem.playClick();
      this.init({ quizType: this.quizType });
      this.createQuizDOM();
    };

    const goFieldBtn = document.getElementById("btn-go-field");
    if (goFieldBtn) {
      goFieldBtn.onclick = () => {
        audioSystem.playClick();
        this.exitToWorld();
      };
    }

    const goCanteenBtn = document.getElementById("btn-go-canteen");
    if (goCanteenBtn) {
      goCanteenBtn.onclick = () => {
        audioSystem.playClick();
        this.exitToWorld();
      };
    }

    document.getElementById("btn-quiz-world").onclick = () => {
      audioSystem.playClick();
      this.exitToWorld();
    };
  }

  exitToWorld() {
    if (this.overlay) {
      this.overlay.style.display = "none";
    }
    const hud = document.getElementById("game-hud");
    if (hud) hud.style.display = "flex";

    const virtualControls = document.getElementById("virtual-controls");
    if (virtualControls && ("ontouchstart" in window || window.innerWidth <= 1024)) {
      virtualControls.style.display = "block";
    }

    this.scene.start("WorldScene");
  }

  exitToScene(targetSceneName) {
    if (this.overlay) {
      this.overlay.style.display = "none";
    }
    this.scene.start(targetSceneName);
  }
}
