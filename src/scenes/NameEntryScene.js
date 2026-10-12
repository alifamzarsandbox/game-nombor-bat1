/**
 * NameEntryScene: Skrin Pengenalan & Kemasukan Nama Murid
 * Mematuhi kriteria privasi dan pengesahan input Tahun 1
 */

import { GAME_CONFIG } from "../config.js";
import { gameStorage, sanitizeStudentName, unescapeStudentName } from "../systems/storage.js";
import { audioSystem } from "../systems/audio.js";

export class NameEntryScene extends Phaser.Scene {
  constructor() {
    super("NameEntryScene");
  }

  create() {
    this.createBackground();
    this.createDomOverlay();
  }

  createBackground() {
    const { width, height } = this.scale;

    // Latar belakang langit biru ceria sekolah
    this.add.rectangle(width / 2, height / 2, width, height, 0xcaf0f8);

    // Bangunan sekolah retro di latar belakang
    const schoolWall = this.add.rectangle(width / 2, height - 120, width, 180, 0x457b9d);
    const roof = this.add.triangle(width / 2, height - 230, 0, height - 180, width, height - 180, width / 2, height - 260, 0xe63946);
    const grass = this.add.rectangle(width / 2, height - 30, width, 60, 0x70a95b);

    // Hiasan terapung nombor Arab 1 - 10
    const arabicNums = ["١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩", "١٠"];
    for (let i = 0; i < 10; i++) {
      const x = 50 + i * (width / 10.5);
      const y = 45 + (i % 2 === 0 ? 0 : 25);
      const txt = this.add.text(x, y, arabicNums[i], {
        fontFamily: "'Noto Naskh Arabic', sans-serif",
        fontSize: "28px",
        fontStyle: "bold",
        color: "#1d3557"
      }).setOrigin(0.5);

      this.tweens.add({
        targets: txt,
        y: y + 10,
        duration: 1800 + i * 150,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut"
      });
    }

    // Watak Ustaz Alif di sebelah kanan
    const ustazSprite = this.add.sprite(width - 120, height - 140, "npc_ustaz", 0).setScale(2.5);
    ustazSprite.play("ustaz_idle");

    // Watak Murid di sebelah kiri
    const studentSprite = this.add.sprite(120, height - 140, "player", 1).setScale(2.5);
    studentSprite.play("player_idle_down");
  }

  createDomOverlay() {
    let overlay = document.getElementById("name-entry-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "name-entry-overlay";
      overlay.className = "name-entry-container";
      document.getElementById("game-container").appendChild(overlay);
    }
    overlay.style.display = "flex";

    const savedSession = gameStorage.session;
    const hasExistingSession = !!(savedSession && savedSession.studentName);
    const safeStudentName = unescapeStudentName(savedSession.studentName || "");

    overlay.innerHTML = `
      <div class="name-entry-card">
        <div class="game-badge">KELAS 1 GAMMA</div>
        <h1 class="game-title">MISI NOMBOR ARAB</h1>
        <p class="game-subtitle">Pengembaraan Bahasa Arab Tahun 1 • Bersama Ustaz Alif</p>

        <div class="greeting-box">
          <div class="greeting-bubble">
            <span class="greeting-emoji">👋</span>
            <p class="greeting-text">“Assalamualaikum! Siapakah nama kamu?”</p>
          </div>
        </div>

        <form id="form-name-entry" class="name-form" autocomplete="off">
          <label for="input-student-name" class="name-label">Nama Murid:</label>
          <div class="input-wrapper">
            <input
              type="text"
              id="input-student-name"
              class="name-input"
              maxlength="60"
              placeholder="Tulis nama kamu di sini"
              value="${hasExistingSession ? safeStudentName : ""}"
              required
              autofocus
            />
          </div>
          <div id="name-error-msg" class="name-error-message"></div>

          <div class="name-actions">
            <button type="submit" class="btn-start-game">
              <span>MULA BERMAIN 🚀</span>
            </button>
            ${
              hasExistingSession
                ? `<button type="button" id="btn-continue-session" class="btn-continue-game">
                    <span>SAMBUNG SESI: ${safeStudentName} 🔄</span>
                   </button>`
                : ""
            }
          </div>
        </form>

        <div class="privacy-note">
          🔒 Nama digunakan hanya untuk rekod pembelajaran permainan ini.
        </div>
      </div>
    `;

    const form = document.getElementById("form-name-entry");
    const input = document.getElementById("input-student-name");
    const errorMsg = document.getElementById("name-error-msg");
    const continueBtn = document.getElementById("btn-continue-session");

    const validateAndStart = (isContinue = false) => {
      let rawName = input.value.trim();

      if (!rawName) {
        errorMsg.textContent = "Sila masukkan nama kamu terlebih dahulu.";
        input.focus();
        return;
      }

      if (rawName.length > 60) {
        rawName = rawName.substring(0, 60);
      }

      audioSystem.playClick();
      errorMsg.textContent = "";

      if (isContinue && hasExistingSession) {
        // Kekalkan sesi sedia ada
      } else {
        // Sesi baharu
        gameStorage.startNewSession(rawName);
      }

      // Sembunyikan borang
      overlay.style.display = "none";

      // Mulakan penerokaan sekolah di WorldScene
      this.scene.start("WorldScene");
    };

    form.onsubmit = (e) => {
      e.preventDefault();
      validateAndStart(false);
    };

    if (continueBtn) {
      continueBtn.onclick = () => {
        validateAndStart(true);
      };
    }
  }
}
