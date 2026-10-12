/**
 * Sistem Dialog Interaktif
 * Mengendalikan paparan kotak dialog NPC di bahagian bawah skrin
 */

import { audioSystem } from "./audio.js";
import { unescapeStudentName } from "./storage.js";

export class DialogueSystem {
  constructor(scene) {
    this.scene = scene;
    this.isOpen = false;
    this.currentLines = [];
    this.currentLineIndex = 0;
    this.typingTimer = null;
    this.onCompleteCallback = null;
    this.createDomElements();
  }

  createDomElements() {
    let container = document.getElementById("dialogue-box");
    if (!container) {
      container = document.createElement("div");
      container.id = "dialogue-box";
      container.className = "dialogue-container hidden";
      container.innerHTML = `
        <div class="dialogue-card">
          <div class="dialogue-header">
            <div class="dialogue-avatar" id="dialogue-avatar"></div>
            <div class="dialogue-speaker-name" id="dialogue-speaker">Nama NPC</div>
          </div>
          <div class="dialogue-body" id="dialogue-text">Teks dialog di sini...</div>
          <div class="dialogue-actions" id="dialogue-actions"></div>
        </div>
      `;
      document.getElementById("game-container").appendChild(container);
    }
    this.container = container;
    this.avatarEl = document.getElementById("dialogue-avatar");
    this.speakerEl = document.getElementById("dialogue-speaker");
    this.textEl = document.getElementById("dialogue-text");
    this.actionsEl = document.getElementById("dialogue-actions");
  }

  /**
   * Paparkan dialog bersiri
   * @param {Object} options { speaker, avatarKey, lines: [{text, buttons: []}], onComplete }
   */
  startDialogue({ speaker, avatarClass = "", lines = [], onComplete = null }) {
    this.isOpen = true;
    this.speaker = speaker;
    this.avatarClass = avatarClass;
    this.currentLines = lines;
    this.currentLineIndex = 0;
    this.onCompleteCallback = onComplete;

    this.container.classList.remove("hidden");
    this.speakerEl.textContent = speaker;
    this.avatarEl.className = `dialogue-avatar ${avatarClass}`;

    audioSystem.playInteract();
    this.showCurrentLine();
  }

  showCurrentLine() {
    if (this.currentLineIndex >= this.currentLines.length) {
      this.close();
      return;
    }

    const lineData = this.currentLines[this.currentLineIndex];
    const rawText = typeof lineData === "string" ? lineData : lineData.text;
    const buttons = lineData.buttons || [];

    // Hentikan sebarang typing timer sedia ada
    if (this.typingTimer) {
      clearInterval(this.typingTimer);
    }

    // Taipkan teks secara beransur-ansur
    this.textEl.textContent = "";
    this.actionsEl.innerHTML = "";

    let charIdx = 0;
    this.typingTimer = setInterval(() => {
      if (charIdx < rawText.length) {
        this.textEl.textContent += rawText.charAt(charIdx);
        charIdx++;
      } else {
        clearInterval(this.typingTimer);
        this.typingTimer = null;
        this.renderActions(buttons);
      }
    }, 18);
  }

  renderActions(buttons) {
    this.actionsEl.innerHTML = "";

    if (!buttons || buttons.length === 0) {
      // Butang lalai 'Seterusnya' atau 'Tutup'
      const isLast = this.currentLineIndex === this.currentLines.length - 1;
      const defaultBtn = document.createElement("button");
      defaultBtn.className = "btn-dialogue primary";
      defaultBtn.textContent = isLast ? "Faham / Tutup" : "Seterusnya ▶";
      defaultBtn.onclick = () => {
        audioSystem.playClick();
        if (isLast) {
          this.close();
        } else {
          this.currentLineIndex++;
          this.showCurrentLine();
        }
      };
      this.actionsEl.appendChild(defaultBtn);
      defaultBtn.focus();
    } else {
      // Butang tersuai (cth: MULA BELAJAR, ULANG KAJI)
      buttons.forEach((btnConfig, idx) => {
        const btn = document.createElement("button");
        btn.className = `btn-dialogue ${btnConfig.style || "primary"}`;
        btn.textContent = btnConfig.text;
        btn.onclick = () => {
          audioSystem.playClick();
          if (btnConfig.onClick) {
            btnConfig.onClick();
          }
          if (btnConfig.closeAfter !== false) {
            this.close();
          }
        };
        this.actionsEl.appendChild(btn);
        if (idx === 0) btn.focus();
      });
    }
  }

  advanceOrFinishTyping() {
    if (!this.isOpen) return;

    // Jika teks masih ditaip, lengkapkan serta-merta
    if (this.typingTimer) {
      clearInterval(this.typingTimer);
      this.typingTimer = null;
      const lineData = this.currentLines[this.currentLineIndex];
      const rawText = typeof lineData === "string" ? lineData : lineData.text;
      this.textEl.textContent = rawText;
      const buttons = lineData.buttons || [];
      this.renderActions(buttons);
    }
  }

  close() {
    if (!this.isOpen) return;
    if (this.typingTimer) {
      clearInterval(this.typingTimer);
      this.typingTimer = null;
    }
    this.isOpen = false;
    this.container.classList.add("hidden");
    if (this.onCompleteCallback) {
      this.onCompleteCallback();
      this.onCompleteCallback = null;
    }
  }
}
