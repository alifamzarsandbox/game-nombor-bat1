/**
 * CompletionScene: Skrin Khas Tamat Permainan
 * Dipaparkan HANYA apabila kedua-dua Kuiz Kantin dan Kuiz Padang selesai
 * Mengandungi Lencana "Pengembara Nombor Arab", animasi konfeti, dan ringkasan markah
 */

import { GAME_CONFIG } from "../config.js";
import { gameStorage, unescapeStudentName } from "../systems/storage.js";
import { sheetsSync } from "../systems/sheetsSync.js";
import { audioSystem } from "../systems/audio.js";

export class CompletionScene extends Phaser.Scene {
  constructor() {
    super("CompletionScene");
  }

  create() {
    // 1. Semakan Ketat Syarat Tamat Permainan
    const session = gameStorage.session;
    const isLegit = session.canteenCompleted && session.fieldCompleted;

    if (!isLegit) {
      console.warn("Syarat tamat permainan belum dipenuhi! Kembali ke WorldScene.");
      this.scene.start("WorldScene");
      return;
    }

    this.studentName = unescapeStudentName(session.studentName || "Murid");
    const canteenScore = session.canteenScore || 0;
    const fieldScore = session.fieldScore || 0;
    const totalScore = gameStorage.getTotalScore();

    // Sembunyikan kawalan & HUD
    const vControls = document.getElementById("virtual-controls");
    if (vControls) vControls.style.display = "none";
    const hud = document.getElementById("game-hud");
    if (hud) hud.style.display = "none";

    // 2. Mainkan fanfare kejayaan
    audioSystem.playFanfare();

    // 3. Pastikan penghantaran akhir ke Google Sheets dengan status SELESAI
    sheetsSync.sync();

    // 4. Latar Belakang Phaser dengan Z-depth & Bintang Konfeti
    this.createBackgroundFX();

    // 5. Bina Kad Tamat Permainan (DOM)
    this.createVictoryDOM(canteenScore, fieldScore, totalScore);
  }

  createBackgroundFX() {
    const { width, height } = this.scale;

    // Latar belakang langit sekolah cerah bersinar
    this.add.rectangle(width / 2, height / 2, width, height, 0x1d3557);

    // Emitter zarah bintang & konfeti
    for (let i = 0; i < 35; i++) {
      const x = Phaser.Math.Between(0, width);
      const y = Phaser.Math.Between(-50, height);
      const star = this.add.sprite(x, y, "particle_star").setScale(Phaser.Math.FloatBetween(1, 2));

      this.tweens.add({
        targets: star,
        y: height + 50,
        x: x + Phaser.Math.Between(-30, 30),
        duration: Phaser.Math.Between(2500, 5000),
        repeat: -1,
        delay: Phaser.Math.Between(0, 2000)
      });
    }

    // Watak Ustaz Alif di sebelah kanan
    const ustaz = this.add.sprite(width - 100, height - 120, "npc_ustaz", 0).setScale(2.5);
    ustaz.play("ustaz_idle");

    // Watak Murid di sebelah kiri
    const player = this.add.sprite(100, height - 120, "player", 0).setScale(2.5);
    player.play("player_idle_down");
  }

  createVictoryDOM(canteenScore, fieldScore, totalScore) {
    let overlay = document.getElementById("victory-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "victory-overlay";
      overlay.className = "victory-container";
      document.getElementById("game-container").appendChild(overlay);
    }
    overlay.style.display = "flex";

    overlay.innerHTML = `
      <div class="victory-card">
        <!-- Lencana Keemasan -->
        <div class="victory-badge-wrapper">
          <div class="victory-badge-img"></div>
          <div class="badge-title">PENGEMBARA NOMBOR ARAB</div>
        </div>

        <h1 class="victory-heading">TAHNIAH, ${this.studentName}!</h1>
        <h2 class="victory-subheading">ANDA TELAH MENAMATKAN MISI NOMBOR ARAB!</h2>

        <div class="victory-message-box">
          <p>“Kamu telah belajar angka Arab dan perkataan nombor 1 hingga 10.”</p>
          <p>“Kamu juga telah berjaya menyelesaikan kedua-dua misi di kantin dan padang.”</p>
          <p class="highlight-praise">“Kamu memang hebat, murid 1 Gamma!”</p>
        </div>

        <!-- Ringkasan Markah Rasmi -->
        <div class="victory-summary-table">
          <div class="summary-row">
            <span class="row-label">Nama Murid:</span>
            <span class="row-value"><b>${this.studentName}</b></span>
          </div>
          <div class="summary-row">
            <span class="row-label">Kelas:</span>
            <span class="row-value">1 Gamma</span>
          </div>
          <div class="summary-row">
            <span class="row-label">Markah Kuiz Kantin:</span>
            <span class="row-value score-pill">${canteenScore} / 5</span>
          </div>
          <div class="summary-row">
            <span class="row-label">Markah Kuiz Padang:</span>
            <span class="row-value score-pill">${fieldScore} / 5</span>
          </div>
          <div class="summary-row highlight-total">
            <span class="row-label">Jumlah Markah Terbaik:</span>
            <span class="row-value total-score-pill">${totalScore} / 10 ⭐</span>
          </div>
          <div class="summary-row">
            <span class="row-label">Status Permainan:</span>
            <span class="row-value status-completed">SELESAI ✓</span>
          </div>
        </div>

        <div id="victory-sync-banner" class="victory-sync-banner">
          ${sheetsSync.getStatusLabel().text}
        </div>

        <!-- Butang Tindakan -->
        <div class="victory-actions">
          <button id="btn-victory-replay" class="btn-vic secondary">
            🔄 MAIN SEMULA
          </button>
          <button id="btn-victory-review" class="btn-vic primary">
            📖 ULANG KAJI
          </button>
          <button id="btn-victory-menu" class="btn-vic outline">
            🏠 KEMBALI KE MENU UTAMA
          </button>
        </div>
      </div>
    `;

    // Pasang Listeners
    document.getElementById("btn-victory-replay").onclick = () => {
      audioSystem.playClick();
      if (confirm("Adakah kamu ingin memulakan sesi permainan baharu? (Rekod yang dihantar ke Google Sheets akan kekal tersimpan)")) {
        gameStorage.startNewSession(this.studentName);
        overlay.style.display = "none";
        this.scene.start("WorldScene");
      }
    };

    document.getElementById("btn-victory-review").onclick = () => {
      audioSystem.playClick();
      overlay.style.display = "none";
      this.scene.start("LearningScene", { initialModule: 1 });
    };

    document.getElementById("btn-victory-menu").onclick = () => {
      audioSystem.playClick();
      overlay.style.display = "none";
      this.scene.start("NameEntryScene");
    };
  }
}
