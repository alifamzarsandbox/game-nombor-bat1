/**
 * =========================================================================
 * MISI NOMBOR ARAB : KELAS 1 GAMMA
 * EDISI 2.5D HD-2D (THREE.JS WEBGL & PROCEDURAL PIXEL ART)
 * =========================================================================
 */

import { GAME_CONFIG } from "./config.js";
import { ARABIC_NUMBERS } from "./data/numbers.js";
import {
  generateMiniQuizUstaz,
  generateCanteenFoodQuestions,
  generateFieldSportsQuestions,
  generateFinalExamQuestions
} from "./data/questions.js";
import { gameStorage, unescapeStudentName, sanitizeStudentName } from "./systems/storage.js";
import { sheetsSync } from "./systems/sheetsSync.js";

// ==========================================================================
// 1. PROCEDURAL WEB AUDIO API SYNTHESIZER
// ==========================================================================
const Sound = {
  ctx: null,
  enabled: true,

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  },

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  },

  playInteract() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(659.25, now);
      osc.frequency.setValueAtTime(987.77, now + 0.08);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.22);
    } catch (e) {}
  },

  playTextAdvance() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(360, now + 0.1);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.11);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    } catch (e) {}
  },

  playTypeChar() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(560 + (Math.random() * 20 - 10), now);
      gain.gain.setValueAtTime(0.024, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.02);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.022);
    } catch (e) {}
  },

  playDoorWarp() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.5];
      const now = this.ctx.currentTime;
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);
        gain.gain.setValueAtTime(0.18, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.16);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.17);
      });
    } catch (e) {}
  },

  playCorrect() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51];
      const now = this.ctx.currentTime;
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);
        gain.gain.setValueAtTime(0.22, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.32);
      });
    } catch (e) {}
  },

  playWrong() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.linearRampToValueAtTime(180, now + 0.22);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } catch (e) {}
  },

  playFanfare() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const notes = [
        { f: 523.25, d: 0.12 },
        { f: 523.25, d: 0.12 },
        { f: 523.25, d: 0.12 },
        { f: 659.25, d: 0.32 },
        { f: 783.99, d: 0.32 },
        { f: 1046.5, d: 0.6 }
      ];
      const now = this.ctx.currentTime;
      let cur = now;
      notes.forEach((n) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(n.f, cur);
        gain.gain.setValueAtTime(0.28, cur);
        gain.gain.exponentialRampToValueAtTime(0.001, cur + n.d);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(cur);
        osc.stop(cur + n.d);
        cur += n.d + 0.03;
      });
    } catch (e) {}
  }
};

window.addEventListener("pointerdown", () => Sound.init(), { once: true });
window.addEventListener("keydown", () => Sound.init(), { once: true });

// ==========================================================================
// 2. PROCEDURAL 16-BIT CHIBI SPRITE GENERATOR (4 Arah x 3 Frame)
// ==========================================================================
function generateChibiCanvas(charType, direction, frame) {
  const canvas = document.createElement("canvas");
  canvas.width = 48;
  canvas.height = 48;
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;

  let hairColor = "#1c1917";
  let skinColor = "#fed7aa";
  let shirtColor = "#ffffff";
  let pantsColor = "#14532d"; // Hijau / Biru Sekolah Rendah
  let tieColor = null;
  let tudungColor = null;

  if (charType === "player_male" || charType === "student_male") {
    hairColor = "#78350f";
    pantsColor = "#1e3a8a"; // Seluar biru sekolah
    shirtColor = "#ffffff";
    tieColor = "#1e3a8a"; // Tali leher biru
  } else if (charType === "player_female" || charType === "student_female" || charType === "hana") {
    // 👧 PEREMPUAN: Memakai Tudung Putih Kemas Labuh Menutup Rambut & Dada!
    tudungColor = "#ffffff";
    shirtColor = "#ffffff"; // Baju kurung putih
    pantsColor = "#1e3a8a"; // Kain sarung biru tua sekolah
  } else if (charType === "teacher_ustaz") {
    // 👳 Ustaz Alif: Jubah Putih Bersih & Songkok Hitam Baldu
    hairColor = "#1f2937";
    shirtColor = "#f8fafc";
    pantsColor = "#f8fafc";
  } else if (charType === "npc_kantin") {
    // 👩‍🍳 Makcik Kantin: Baju Kurung Oren, Tudung Kuning & Apron Putih
    tudungColor = "#fbbf24";
    shirtColor = "#ea580c";
    pantsColor = "#ea580c";
  } else if (charType === "teacher_pe" || charType === "npc_sukan") {
    // 🏃 Cikgu Amir: Baju Trek Sukan Merah, Wisel & Topi Sukan
    hairColor = "#1f2937";
    shirtColor = "#dc2626";
    pantsColor = "#18181b";
  }

  // Offset langkah kaki berjalan
  let legOffset = 0;
  let armOffset = 0;
  if (frame === 0) {
    legOffset = 2;
    armOffset = -2;
  } else if (frame === 2) {
    legOffset = -2;
    armOffset = 2;
  }

  // 1. Kaki / Seluar / Kain
  ctx.fillStyle = pantsColor;
  const isFemale = (charType === "player_female" || charType === "student_female" || charType === "hana");
  if (direction === "down" || direction === "up") {
    if (isFemale) {
      // Kain sarung labuh perempuan
      ctx.fillRect(17, 34, 14, 8);
      ctx.fillStyle = "#0f172a"; // Kasut
      ctx.fillRect(18, 42, 4, 3);
      ctx.fillRect(26, 42, 4, 3);
    } else {
      // Seluar murid / jubah
      ctx.fillRect(18, 34, 5, 8 + (frame === 0 ? 1 : 0));
      ctx.fillRect(25, 34, 5, 8 + (frame === 2 ? 1 : 0));
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(17, 42, 6, 4);
      ctx.fillRect(25, 42, 6, 4);
    }
  } else {
    // Pandangan sisi
    ctx.fillRect(20 - legOffset, 34, 8, 8);
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(19 - legOffset, 42, 9, 4);
  }

  // 2. Badan / Baju
  ctx.fillStyle = shirtColor;
  ctx.fillRect(17, 22, 14, 13);

  // Butiran khas watak
  if (charType === "teacher_ustaz") {
    ctx.fillStyle = "#fbbf24"; // Jalur jubah emas
    ctx.fillRect(23, 20, 2, 18);
  } else if (charType === "npc_kantin" && direction === "down") {
    // Apron putih kantin dengan poket merah
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(19, 24, 10, 11);
    ctx.fillStyle = "#dc2626";
    ctx.fillRect(22, 29, 4, 4);
  } else if ((charType === "teacher_pe" || charType === "npc_sukan") && direction === "down") {
    // Jalur putih & wisel sukan
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(17, 27, 14, 2);
    ctx.fillStyle = "#fbbf24"; // Wisel
    ctx.fillRect(23, 23, 2, 4);
  }

  // Tali leher murid lelaki
  if (tieColor && direction === "down") {
    ctx.fillStyle = tieColor;
    ctx.fillRect(23, 23, 2, 7);
  }

  // Tangan
  ctx.fillStyle = skinColor;
  if (direction === "down" || direction === "up") {
    ctx.fillStyle = shirtColor;
    ctx.fillRect(13, 22 + armOffset, 4, 8);
    ctx.fillRect(31, 22 - armOffset, 4, 8);
    ctx.fillStyle = skinColor;
    ctx.fillRect(13, 30 + armOffset, 4, 3);
    ctx.fillRect(31, 30 - armOffset, 4, 3);
  } else {
    ctx.fillStyle = shirtColor;
    ctx.fillRect(22, 22, 5, 8);
    ctx.fillStyle = skinColor;
    ctx.fillRect(22, 30, 5, 3);
  }

  // 3. Kepala & Rambut / Tudung / Songkok
  if (tudungColor) {
    // ==========================================
    // TUDUNG PUTIH LABUH MENUTUP RAMBUT & DADA
    // ==========================================
    ctx.fillStyle = tudungColor;
    // Kubah kepala tudung
    ctx.fillRect(15, 7, 18, 19);
    ctx.fillRect(13, 10, 22, 16);
    // Labuh tudung menutup dada
    ctx.fillRect(16, 25, 16, 6);

    // Bayang awning tudung
    ctx.fillStyle = "rgba(0,0,0,0.08)";
    ctx.fillRect(16, 7, 16, 2);

    if (direction === "down") {
      // Wajah bujur di sebalik tudung
      ctx.fillStyle = skinColor;
      ctx.fillRect(18, 13, 12, 11);
      // Mata bersinar comel
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(20, 16, 2, 3);
      ctx.fillRect(26, 16, 2, 3);
      // Pipi merah
      ctx.fillStyle = "rgba(244, 114, 182, 0.7)";
      ctx.fillRect(19, 19, 2, 2);
      ctx.fillRect(27, 19, 2, 2);
      // Pin kerongsang di bawah dagu
      ctx.fillStyle = charType === "hana" ? "#10b981" : "#fbbf24";
      ctx.fillRect(23, 24, 2, 2);
    } else if (direction === "left") {
      ctx.fillStyle = skinColor;
      ctx.fillRect(16, 13, 8, 11);
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(18, 16, 2, 3);
    } else if (direction === "right") {
      ctx.fillStyle = skinColor;
      ctx.fillRect(24, 13, 8, 11);
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(28, 16, 2, 3);
    }
  } else if (charType === "teacher_ustaz") {
    // ==========================================
    // USTAZ ALIF (Songkok Baldu Hitam & Janggut Kemas)
    // ==========================================
    ctx.fillStyle = skinColor;
    ctx.fillRect(16, 11, 16, 13);

    // Songkok Hitam Tinggi
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(15, 3, 18, 9);
    // Lilitan sulaman emas songkok
    ctx.fillStyle = "#fbbf24";
    ctx.fillRect(15, 10, 18, 1.5);

    if (direction === "down") {
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(19, 15, 2, 2);
      ctx.fillRect(27, 15, 2, 2);
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(22, 20, 4, 3);
      ctx.fillRect(23, 23, 2, 2);
    } else if (direction === "up") {
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(15, 3, 18, 16);
    } else if (direction === "left") {
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(18, 15, 2, 2);
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(18, 20, 3, 3);
    } else if (direction === "right") {
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(28, 15, 2, 2);
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(27, 20, 3, 3);
    }
  } else {
    // ==========================================
    // LELAKI / MURID LELAKI / CIKGU AMIR
    // ==========================================
    ctx.fillStyle = skinColor;
    ctx.fillRect(16, 10, 16, 14);

    if (charType === "teacher_pe" || charType === "npc_sukan") {
      // Topi Sukan Biru
      ctx.fillStyle = "#003049";
      ctx.fillRect(14, 5, 20, 7);
      ctx.fillRect(direction === "left" ? 11 : 21, 10, 16, 2);
    } else {
      // Rambut Pendek Kemas
      ctx.fillStyle = hairColor;
      ctx.fillRect(15, 7, 18, 7);
      ctx.fillRect(14, 9, 3, 7);
      ctx.fillRect(31, 9, 3, 7);
    }

    if (direction === "down") {
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(19, 16, 2, 3);
      ctx.fillRect(27, 16, 2, 3);
      ctx.fillStyle = "#d97706";
      ctx.fillRect(22, 20, 4, 1);
    } else if (direction === "up") {
      ctx.fillStyle = hairColor;
      ctx.fillRect(15, 7, 18, 15);
    } else if (direction === "left") {
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(18, 16, 2, 3);
    } else if (direction === "right") {
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(28, 16, 2, 3);
    }
  }

  return canvas;
}

const spriteAtlas = {};
function getChibiTexture(charType, direction, frame) {
  const key = `${charType}_${direction}_${frame}`;
  if (!spriteAtlas[key]) {
    const cvs = generateChibiCanvas(charType, direction, frame);
    const tex = new THREE.CanvasTexture(cvs);
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.NearestFilter;
    spriteAtlas[key] = tex;
  }
  return spriteAtlas[key];
}

// ==========================================================================
// 3. VISUAL NOVEL (VN) HIGH-RES PORTRAIT GENERATOR
// ==========================================================================
function drawVNPortrait(canvas, charType) {
  const ctx = canvas.getContext("2d");
  const w = 280;
  const h = 320;
  ctx.clearRect(0, 0, w, h);

  const cx = 140;
  const cy = 126;

  // Latar Gradien Zamrud Gelap Elegan
  const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
  bgGrad.addColorStop(0, "#042a20");
  bgGrad.addColorStop(0.5, "#064e3b");
  bgGrad.addColorStop(1, "#021812");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // Halo Cahaya
  const halo = ctx.createRadialGradient(cx, cy, 20, cx, cy, 140);
  halo.addColorStop(0, "rgba(52, 211, 153, 0.28)");
  halo.addColorStop(0.65, "rgba(16, 185, 129, 0.08)");
  halo.addColorStop(1, "rgba(6, 78, 59, 0)");
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, w, h);

  function drawDot(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const isGirl = (charType === "player_female" || charType === "student_female" || charType === "hana" || charType === "npc_kantin");

  if (isGirl) {
    // =========================================================================
    // A. WATAK PEREMPUAN BERTUDUNG PUTIH LABUH / MAK CIK KANTIN
    // =========================================================================
    const isKantin = charType === "npc_kantin";
    const tudungCol = isKantin ? "#fbbf24" : "#ffffff";
    const tudungShadow = isKantin ? "#d97706" : "#e2e8f0";
    const bajuCol = isKantin ? "#ea580c" : "#ffffff";

    // 1. Bahu & Baju Kurung
    ctx.fillStyle = bajuCol;
    ctx.beginPath();
    ctx.moveTo(cx - 36, 225);
    ctx.quadraticCurveTo(cx - 80, 240, 0, 320);
    ctx.lineTo(w, 320);
    ctx.quadraticCurveTo(cx + 80, 240, cx + 36, 225);
    ctx.closePath();
    ctx.fill();

    // 2. Labuh Tudung Labuh Menutup Dada
    ctx.fillStyle = tudungCol;
    ctx.beginPath();
    ctx.moveTo(cx - 52, 160);
    ctx.quadraticCurveTo(cx - 65, 235, cx - 45, 275);
    ctx.quadraticCurveTo(cx, 290, cx + 45, 275);
    ctx.quadraticCurveTo(cx + 65, 235, cx + 52, 160);
    ctx.closePath();
    ctx.fill();

    // Lipatan Tudung Labuh
    ctx.strokeStyle = tudungShadow;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(cx - 15, 215);
    ctx.quadraticCurveTo(cx - 20, 255, cx, 280);
    ctx.stroke();

    // 3. Kepala & Awning Tudung
    ctx.fillStyle = tudungCol;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 62, 74, 0, 0, Math.PI * 2);
    ctx.fill();

    // 4. Muka Bujur di sebalik Tudung
    ctx.fillStyle = "#fed7aa";
    ctx.beginPath();
    ctx.ellipse(cx, cy + 8, 38, 46, 0, 0, Math.PI * 2);
    ctx.fill();

    // Awning Bayang
    ctx.fillStyle = tudungShadow;
    ctx.beginPath();
    ctx.ellipse(cx, cy - 36, 42, 12, 0, 0, Math.PI);
    ctx.fill();

    // Pin Kerongsang
    drawDot(cx, cy + 54, 4.5, isKantin ? "#dc2626" : (charType === "hana" ? "#10b981" : "#fbbf24"));

    // Mata Murid Perempuan yang Cantik & Bersinar
    drawDot(cx - 16, cy + 6, 5.5, "#0f172a");
    drawDot(cx + 16, cy + 6, 5.5, "#0f172a");
    drawDot(cx - 17.5, cy + 4.5, 2, "#ffffff");
    drawDot(cx + 14.5, cy + 4.5, 2, "#ffffff");

    // Pipi Merah
    drawDot(cx - 24, cy + 18, 6.5, "rgba(244, 114, 182, 0.45)");
    drawDot(cx + 24, cy + 18, 6.5, "rgba(244, 114, 182, 0.45)");

    // Senyuman
    ctx.strokeStyle = "#e11d48";
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.arc(cx, cy + 24, 7, 0.2, Math.PI - 0.2);
    ctx.stroke();

  } else if (charType === "teacher_ustaz") {
    // =========================================================================
    // B. USTAZ ALIF (GURU BAHASA ARAB)
    // =========================================================================
    // Jubah Putih & Bahu
    ctx.fillStyle = "#f8fafc";
    ctx.beginPath();
    ctx.moveTo(cx - 40, 215);
    ctx.quadraticCurveTo(cx - 80, 235, 0, 320);
    ctx.lineTo(w, 320);
    ctx.quadraticCurveTo(cx + 80, 235, cx + 40, 215);
    ctx.closePath();
    ctx.fill();

    // Jalur Emas Jubah
    ctx.fillStyle = "#fbbf24";
    ctx.fillRect(cx - 3, 210, 6, 110);

    // Leher & Muka
    ctx.fillStyle = "#fed7aa";
    ctx.beginPath();
    ctx.ellipse(cx, cy + 12, 42, 50, 0, 0, Math.PI * 2);
    ctx.fill();

    // Songkok Baldu Hitam Elegan
    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.roundRect(cx - 52, cy - 88, 104, 58, [12, 12, 0, 0]);
    ctx.fill();

    // Sulaman Emas Songkok
    ctx.fillStyle = "#fbbf24";
    ctx.fillRect(cx - 52, cy - 35, 104, 5);

    // Kening
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 3.2;
    ctx.beginPath();
    ctx.moveTo(cx - 32, cy - 4);
    ctx.lineTo(cx - 10, cy - 8);
    ctx.moveTo(cx + 10, cy - 8);
    ctx.lineTo(cx + 32, cy - 4);
    ctx.stroke();

    // Mata Bijaksana & Mesra
    drawDot(cx - 18, cy + 6, 5, "#0f172a");
    drawDot(cx + 18, cy + 6, 5, "#0f172a");
    drawDot(cx - 19.5, cy + 4.5, 1.8, "#ffffff");
    drawDot(cx + 16.5, cy + 4.5, 1.8, "#ffffff");

    // Janggut Kemas Ustaz
    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.ellipse(cx, cy + 50, 16, 12, 0, 0, Math.PI);
    ctx.fill();

    // Senyuman
    ctx.strokeStyle = "#d97706";
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.arc(cx, cy + 28, 9, 0.2, Math.PI - 0.2);
    ctx.stroke();

  } else {
    // =========================================================================
    // C. WATAK LELAKI (MURID LELAKI / CIKGU AMIR GURU SUKAN)
    // =========================================================================
    const isPe = (charType === "teacher_pe" || charType === "npc_sukan");
    const shirtCol = isPe ? "#dc2626" : "#ffffff";

    // Bahu
    ctx.fillStyle = shirtCol;
    ctx.beginPath();
    ctx.moveTo(cx - 40, 220);
    ctx.quadraticCurveTo(cx - 80, 240, 0, 320);
    ctx.lineTo(w, 320);
    ctx.quadraticCurveTo(cx + 80, 240, cx + 40, 220);
    ctx.closePath();
    ctx.fill();

    // Tali Leher (Murid) atau Wisel (Cikgu Amir)
    if (isPe) {
      ctx.fillStyle = "#fbbf24";
      ctx.fillRect(cx - 4, 222, 8, 18); // Wisel
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.strokeRect(cx - 4, 222, 8, 18);
    } else {
      ctx.fillStyle = "#1e3a8a";
      ctx.beginPath();
      ctx.moveTo(cx, 220);
      ctx.lineTo(cx - 8, 280);
      ctx.lineTo(cx, 305);
      ctx.lineTo(cx + 8, 280);
      ctx.closePath();
      ctx.fill();
    }

    // Leher & Muka
    ctx.fillStyle = "#fed7aa";
    ctx.beginPath();
    ctx.ellipse(cx, cy + 10, 42, 50, 0, 0, Math.PI * 2);
    ctx.fill();

    if (isPe) {
      // Topi Sukan Cikgu Amir
      ctx.fillStyle = "#003049";
      ctx.beginPath();
      ctx.arc(cx, cy - 25, 48, Math.PI, 0);
      ctx.fill();
      ctx.fillRect(cx - 62, cy - 25, 124, 12);
    } else {
      // Rambut Murid Lelaki Kemas
      ctx.fillStyle = "#78350f";
      ctx.beginPath();
      ctx.arc(cx, cy - 10, 46, Math.PI * 0.9, Math.PI * 2.1);
      ctx.fill();
    }

    // Mata Murid Lelaki
    drawDot(cx - 18, cy + 10, 5, "#0f172a");
    drawDot(cx + 18, cy + 10, 5, "#0f172a");
    drawDot(cx - 19.5, cy + 8.5, 1.8, "#ffffff");
    drawDot(cx + 16.5, cy + 8.5, 1.8, "#ffffff");

    // Senyuman
    ctx.strokeStyle = "#d97706";
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.arc(cx, cy + 30, 9, 0.2, Math.PI - 0.2);
    ctx.stroke();
  }
}

// ==========================================================================
// 4. PROCEDURAL 3D TEXTURES & MATERIALS
// ==========================================================================
function createMarbleTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  const tileSize = 64;
  for (let y = 0; y < 256; y += tileSize) {
    for (let x = 0; x < 256; x += tileSize) {
      const alt = ((x / tileSize) + (y / tileSize)) % 2 === 0;
      ctx.fillStyle = alt ? "#f0fdf4" : "#dcfce7";
      ctx.fillRect(x, y, tileSize, tileSize);
      ctx.strokeStyle = "#bbf7d0";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, tileSize, tileSize);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.magFilter = THREE.NearestFilter;
  return tex;
}

function createParquetTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  const plankH = 32;
  const plankW = 128;
  for (let y = 0; y < 256; y += plankH) {
    const row = y / plankH;
    const offset = row % 2 === 0 ? 0 : plankW / 2;
    for (let x = -offset; x < 256; x += plankW) {
      ctx.fillStyle = ((row + Math.floor(x / plankW)) % 2 === 0) ? "#d97706" : "#b45309";
      ctx.fillRect(x, y, plankW, plankH);
      ctx.strokeStyle = "#92400e";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x, y, plankW, plankH);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.magFilter = THREE.NearestFilter;
  return tex;
}

function createGrassTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#15803d";
  ctx.fillRect(0, 0, 256, 256);
  ctx.fillStyle = "#16a34a";
  for (let i = 0; i < 80; i++) {
    const rx = Math.floor(Math.random() * 240);
    const ry = Math.floor(Math.random() * 240);
    ctx.fillRect(rx, ry, 14, 14);
  }
  ctx.fillStyle = "#22c55e";
  for (let i = 0; i < 300; i++) {
    const x = Math.floor(Math.random() * 254);
    const y = Math.floor(Math.random() * 254);
    ctx.fillRect(x, y, 2, 4);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.magFilter = THREE.NearestFilter;
  return tex;
}

function createBlackboardArabicTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");

  // Papan Hitam Zamrud Klasik
  ctx.fillStyle = "#064e3b";
  ctx.fillRect(0, 0, 512, 256);

  // Bingkai Kayu Jati
  ctx.strokeStyle = "#78350f";
  ctx.lineWidth = 12;
  ctx.strokeRect(6, 6, 500, 244);

  // Tajuk Papan Putih
  ctx.fillStyle = "#fef08a";
  ctx.font = 'bold 24px "Segoe UI", sans-serif';
  ctx.textAlign = "center";
  ctx.fillText("KELAS 1 GAMMA : BAHASA ARAB", 256, 52);

  // Garis Emas
  ctx.strokeStyle = "#fbbf24";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(80, 72);
  ctx.lineTo(432, 72);
  ctx.stroke();

  // Nombor Arab 1 hingga 10 Besar dan Cantik
  ctx.fillStyle = "#ffffff";
  ctx.font = 'bold 36px "Noto Naskh Arabic", sans-serif';
  ctx.fillText("١  ٢  ٣  ٤  ٥  ٦  ٧  ٨  ٩  ١٠", 256, 138);

  // Subteks
  ctx.fillStyle = "#a7f3d0";
  ctx.font = 'bold 18px "Segoe UI", sans-serif';
  ctx.fillText("Tajuk: Nombor 1 Hingga 10", 256, 195);

  const tex = new THREE.CanvasTexture(canvas);
  tex.magFilter = THREE.LinearFilter;
  return tex;
}

function createDoorSignTexture(title, subtitle) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 190;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#064e3b";
  ctx.fillRect(0, 0, 512, 190);
  ctx.strokeStyle = "#34d399";
  ctx.lineWidth = 8;
  ctx.strokeRect(6, 6, 500, 178);
  ctx.strokeStyle = "#fbbf24";
  ctx.lineWidth = 4;
  ctx.strokeRect(16, 16, 480, 158);

  ctx.fillStyle = "#ffffff";
  ctx.font = 'bold 36px "Segoe UI", sans-serif';
  ctx.textAlign = "center";
  ctx.fillText(title, 256, 75);

  ctx.fillStyle = "#fef08a";
  ctx.font = 'bold 22px "Segoe UI", sans-serif';
  ctx.fillText(subtitle, 256, 130);

  const tex = new THREE.CanvasTexture(canvas);
  tex.magFilter = THREE.LinearFilter;
  return tex;
}

function createSoccerNetTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, 64, 64);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.75)";
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(8, 8);
  return tex;
}

// ==========================================================================
// 5. THREE.JS INITIALIZATION (2.5D ISOMETRIC ENGINE)
// ==========================================================================
const canvasElem = document.getElementById("webgl-canvas");
const renderer = new THREE.WebGLRenderer({
  canvas: canvasElem,
  antialias: true,
  alpha: false,
  powerPreference: "high-performance"
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x02140e);

// Kamera Isometrik 2.5D Nintendo DS
const camera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.1, 120);
const cameraTarget = new THREE.Vector3(0, 1.2, 0);
const camAngleY = 0;

// Pencahayaan Lembut & Hangat
const ambientLight = new THREE.AmbientLight(0xfffaed, 0.95);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xfff7ed, 0.85);
dirLight.position.set(16, 26, 18);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 1024;
dirLight.shadow.mapSize.height = 1024;
dirLight.shadow.camera.near = 0.5;
dirLight.shadow.camera.far = 60;
dirLight.shadow.camera.left = -20;
dirLight.shadow.camera.right = 20;
dirLight.shadow.camera.top = 20;
dirLight.shadow.camera.bottom = -20;
scene.add(dirLight);

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// ==========================================================================
// 6. GAME STATE & INPUT SYSTEM
// ==========================================================================
const GameState = {
  currentRoom: "classroom",
  studentName: "",
  gender: "male", // "male" atau "female"
  isTransitioning: false,
  isVNActive: false,
  isModalActive: false,
  debugMode: false
};

const Input = {
  keys: {},
  touchVector: { x: 0, z: 0 },

  init() {
    window.addEventListener("keydown", (e) => {
      this.keys[e.key.toLowerCase()] = true;
      if (e.key === "F2") {
        e.preventDefault();
        GameState.debugMode = !GameState.debugMode;
        document.getElementById("debug-panel").classList.toggle("active", GameState.debugMode);
      }
      // Navigasi Pilihan Jawapan Kuiz menggunakan WASD / Anak Panah / Nombor 1,2,3
      if (typeof quizModal !== "undefined" && quizModal && quizModal.classList.contains("active")) {
        const optBtns = quizOptionsGrid ? quizOptionsGrid.querySelectorAll(".quiz-opt-btn") : [];
        if (!isAnswerLocked && optBtns.length > 0) {
          const key = e.key.toLowerCase();

          if (key === "a" || e.key === "ArrowLeft") {
            e.preventDefault();
            quizSelectedIndex = (quizSelectedIndex - 1 + optBtns.length) % optBtns.length;
            Sound.playTextAdvance();
            updateQuizFocusVisuals();
            return;
          } else if (key === "d" || e.key === "ArrowRight") {
            e.preventDefault();
            quizSelectedIndex = (quizSelectedIndex + 1) % optBtns.length;
            Sound.playTextAdvance();
            updateQuizFocusVisuals();
            return;
          } else if (key === "w" || e.key === "ArrowUp") {
            e.preventDefault();
            quizSelectedIndex = (quizSelectedIndex - 1 + optBtns.length) % optBtns.length;
            Sound.playTextAdvance();
            updateQuizFocusVisuals();
            return;
          } else if (key === "s" || e.key === "ArrowDown") {
            e.preventDefault();
            quizSelectedIndex = (quizSelectedIndex + 1) % optBtns.length;
            Sound.playTextAdvance();
            updateQuizFocusVisuals();
            return;
          } else if (e.key === "1" && optBtns[0]) {
            e.preventDefault();
            quizSelectedIndex = 0;
            updateQuizFocusVisuals();
            optBtns[0].click();
            return;
          } else if (e.key === "2" && optBtns[1]) {
            e.preventDefault();
            quizSelectedIndex = 1;
            updateQuizFocusVisuals();
            optBtns[1].click();
            return;
          } else if (e.key === "3" && optBtns[2]) {
            e.preventDefault();
            quizSelectedIndex = 2;
            updateQuizFocusVisuals();
            optBtns[2].click();
            return;
          }
        }
      }

      if (e.key.toLowerCase() === "e" || e.key === " " || e.key === "Enter") {
        if (document.activeElement && document.activeElement.tagName === "INPUT") {
          return;
        }
        e.preventDefault();
        handleActionInput();
      }

      // Navigasi papan kekunci tambahan untuk kad pembelajaran
      if (typeof learningModal !== "undefined" && learningModal && learningModal.classList.contains("active")) {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          if (currentCardIndex < 9) btnLearnNext.click();
          else btnLearnFinish.click();
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          if (currentCardIndex > 0) btnLearnPrev.click();
        }
      }
    });

    window.addEventListener("keyup", (e) => {
      this.keys[e.key.toLowerCase()] = false;
    });

    this.bindTouchButton("btn-up", 0, -1);
    this.bindTouchButton("btn-down", 0, 1);
    this.bindTouchButton("btn-left", -1, 0);
    this.bindTouchButton("btn-right", 1, 0);

    const btnAction = document.getElementById("btn-touch-action");
    btnAction.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      handleActionInput();
    });
  },

  bindTouchButton(id, vx, vz) {
    const btn = document.getElementById(id);
    if (!btn) return;
    const start = (e) => {
      e.preventDefault();
      this.touchVector.x = vx;
      this.touchVector.z = vz;
      btn.classList.add("active");

      // Sentuh maya D-pad untuk navigasi kuiz jika kuiz aktif
      if (typeof quizModal !== "undefined" && quizModal && quizModal.classList.contains("active") && !isAnswerLocked) {
        const optBtns = quizOptionsGrid ? quizOptionsGrid.querySelectorAll(".quiz-opt-btn") : [];
        if (optBtns.length > 0) {
          if (vx < 0 || vz < 0) {
            quizSelectedIndex = (quizSelectedIndex - 1 + optBtns.length) % optBtns.length;
          } else if (vx > 0 || vz > 0) {
            quizSelectedIndex = (quizSelectedIndex + 1) % optBtns.length;
          }
          Sound.playTextAdvance();
          updateQuizFocusVisuals();
        }
      }
    };
    const end = (e) => {
      e.preventDefault();
      if (this.touchVector.x === vx && this.touchVector.z === vz) {
        this.touchVector.x = 0;
        this.touchVector.z = 0;
      }
      btn.classList.remove("active");
    };
    btn.addEventListener("pointerdown", start);
    btn.addEventListener("pointerup", end);
    btn.addEventListener("pointercancel", end);
  },

  getMovementVector() {
    let x = 0;
    let z = 0;
    if (this.keys["arrowup"] || this.keys["w"]) z -= 1;
    if (this.keys["arrowdown"] || this.keys["s"]) z += 1;
    if (this.keys["arrowleft"] || this.keys["a"]) x -= 1;
    if (this.keys["arrowright"] || this.keys["d"]) x += 1;

    if (this.touchVector.x !== 0 || this.touchVector.z !== 0) {
      x = this.touchVector.x;
      z = this.touchVector.z;
    }

    const len = Math.hypot(x, z);
    if (len > 0) {
      x /= len;
      z /= len;
    }
    return { x, z };
  }
};
Input.init();

// ==========================================================================
// 7. PLAYER CLASS & 3D BILLBOARD SPRITE
// ==========================================================================
const colliders = [];

class Player {
  constructor() {
    this.position = new THREE.Vector3(0, 1.4, 3.5);
    this.speed = 6.8;
    this.radius = 0.55;
    this.facing = "down";
    this.walkFrame = 1;
    this.animTimer = 0;
    this.isMoving = false;

    this.geometry = new THREE.PlaneGeometry(2.8, 2.8);
    this.material = new THREE.MeshBasicMaterial({
      map: getChibiTexture(this.getPlayerSpriteKey(), "down", 1),
      transparent: true,
      alphaTest: 0.1
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.copy(this.position);
    this.mesh.castShadow = true;
    scene.add(this.mesh);

    const shadowGeo = new THREE.CircleGeometry(0.72, 20);
    shadowGeo.rotateX(-Math.PI / 2);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.38
    });
    this.shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    this.shadowMesh.position.set(this.position.x, 0.02, this.position.z);
    scene.add(this.shadowMesh);

    this.updateTexture();
  }

  getPlayerSpriteKey() {
    return GameState.gender === "female" ? "player_female" : "player_male";
  }

  updateTexture() {
    this.material.map = getChibiTexture(this.getPlayerSpriteKey(), this.facing, this.walkFrame);
    this.material.needsUpdate = true;
  }

  update(delta) {
    if (GameState.isTransitioning || GameState.isVNActive || GameState.isModalActive) {
      if (this.walkFrame !== 1) {
        this.walkFrame = 1;
        this.updateTexture();
      }
      this.mesh.quaternion.copy(camera.quaternion);
      return;
    }

    const move = Input.getMovementVector();
    this.isMoving = move.x !== 0 || move.z !== 0;

    if (this.isMoving) {
      if (Math.abs(move.x) > Math.abs(move.z)) {
        this.facing = move.x > 0 ? "right" : "left";
      } else {
        this.facing = move.z > 0 ? "down" : "up";
      }

      this.animTimer += delta * 9;
      const frameIdx = Math.floor(this.animTimer) % 4;
      this.walkFrame = frameIdx === 3 ? 1 : frameIdx;
      this.updateTexture();

      const stepX = move.x * this.speed * delta;
      const stepZ = move.z * this.speed * delta;

      if (!this.checkCollision(this.position.x + stepX, this.position.z)) {
        this.position.x += stepX;
      }
      if (!this.checkCollision(this.position.x, this.position.z + stepZ)) {
        this.position.z += stepZ;
      }
    } else {
      this.walkFrame = 1;
      this.updateTexture();
    }

    // Semak pintu automatik bila menghampiri ambang pintu
    if (!GameState.isTransitioning) {
      for (let i = 0; i < activeDoors.length; i++) {
        const d = activeDoors[i];
        if (this.position.distanceTo(d.position) < 1.35) {
          tryPassDoor(d);
          break;
        }
      }
    }

    // Boundary Clamping
    this.clampWithinBounds();

    this.mesh.position.set(this.position.x, 1.4, this.position.z);
    this.mesh.quaternion.copy(camera.quaternion);
    this.shadowMesh.position.set(this.position.x, 0.02, this.position.z);
  }

  clampWithinBounds() {
    if (GameState.currentRoom === "classroom") {
      this.position.x = Math.max(-12.2, Math.min(12.2, this.position.x));
      this.position.z = Math.max(-10.2, Math.min(10.4, this.position.z));
    } else if (GameState.currentRoom === "canteen") {
      this.position.x = Math.max(-14.2, Math.min(14.2, this.position.x));
      this.position.z = Math.max(-12.2, Math.min(12.2, this.position.z));
    } else if (GameState.currentRoom === "padang") {
      this.position.x = Math.max(-19.2, Math.min(19.2, this.position.x));
      this.position.z = Math.max(-14.2, Math.min(14.2, this.position.z));
    }
  }

  checkCollision(tx, tz) {
    for (let i = 0; i < colliders.length; i++) {
      const c = colliders[i];
      const cx = Math.max(c.minX, Math.min(tx, c.maxX));
      const cz = Math.max(c.minZ, Math.min(tz, c.maxZ));
      const dx = tx - cx;
      const dz = tz - cz;
      if (dx * dx + dz * dz < this.radius * this.radius) {
        return true;
      }
    }
    return false;
  }
}

// ==========================================================================
// 8. DIALOGUE FORMATTER & NPC CLASS
// ==========================================================================
function getPlayerName() {
  return unescapeStudentName(GameState.studentName) || "kamu";
}

function formatDialogueLine(text) {
  if (!text) return "";
  let clean = text;
  const currentName = unescapeStudentName(GameState.studentName);
  if (currentName) {
    clean = clean.replace(/{PLAYER_NAME}/g, currentName);
    clean = clean.replace(/murid 1 Gamma/gi, currentName);
    clean = clean.replace(/murid hebat/gi, currentName);
  } else {
    clean = clean.replace(/{PLAYER_NAME}/g, "kamu");
  }
  // Buang sebarang tanda petikan serta ruang kosong berlebihan di awal dan akhir teks
  clean = clean.replace(/^[“"'\s\u00A0\u3000]+|[”"'\s\u00A0\u3000]+$/g, "").trim();
  clean = clean.replace(/^\s+/, "");
  return clean;
}

class NPC {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.role = data.role;
    this.charType = data.charType;
    this.position = new THREE.Vector3(data.x, 1.4, data.z);
    this.facing = data.facing || "down";
    this.dialogue = data.dialogue;

    this.geometry = new THREE.PlaneGeometry(2.8, 2.8);
    this.material = new THREE.MeshBasicMaterial({
      map: getChibiTexture(this.charType, this.facing, 1),
      transparent: true,
      alphaTest: 0.1
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.copy(this.position);
    scene.add(this.mesh);

    const shadowGeo = new THREE.CircleGeometry(0.68, 20);
    shadowGeo.rotateX(-Math.PI / 2);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.35
    });
    this.shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    this.shadowMesh.position.set(this.position.x, 0.02, this.position.z);
    scene.add(this.shadowMesh);

    colliders.push({
      minX: this.position.x - 0.65,
      maxX: this.position.x + 0.65,
      minZ: this.position.z - 0.65,
      maxZ: this.position.z + 0.65
    });
  }

  update() {
    this.mesh.quaternion.copy(camera.quaternion);
  }

  destroy() {
    scene.remove(this.mesh);
    scene.remove(this.shadowMesh);
  }
}

const activeNPCs = [];
const activeDoors = [];
const roomMeshes = [];

function clearRoom() {
  for (const m of roomMeshes) scene.remove(m);
  roomMeshes.length = 0;
  for (const n of activeNPCs) n.destroy();
  activeNPCs.length = 0;
  activeDoors.length = 0;
  colliders.length = 0;
}

function addBoxCollider(x, z, width, depth) {
  colliders.push({
    minX: x - width / 2,
    maxX: x + width / 2,
    minZ: z - depth / 2,
    maxZ: z + depth / 2
  });
}

function createTube(p1, p2, radius, mat) {
  const dir = new THREE.Vector3().subVectors(p2, p1);
  const len = dir.length();
  const geo = new THREE.CylinderGeometry(radius, radius, len, 12);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.copy(p1).addScaledVector(dir, 0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
  mesh.castShadow = true;
  return mesh;
}

function createNetQuad(p1, p2, p3, p4, mat, uRep = 6, vRep = 4) {
  const geo = new THREE.BufferGeometry();
  const vertices = new Float32Array([
    p1.x, p1.y, p1.z,  p2.x, p2.y, p2.z,  p3.x, p3.y, p3.z,
    p1.x, p1.y, p1.z,  p3.x, p3.y, p3.z,  p4.x, p4.y, p4.z
  ]);
  const uvs = new Float32Array([
    0, 0,  0, vRep,  uRep, vRep,
    0, 0,  uRep, vRep,  uRep, 0
  ]);
  geo.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
  geo.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
  geo.computeVertexNormals();
  return new THREE.Mesh(geo, mat);
}

// ==========================================================================
// 9. PEMBINA BILIK 3D (KELAS 1 GAMMA, KANTIN, PADANG)
// ==========================================================================

// A. KELAS 1 GAMMA (LOKASI PERMULAAN RASMI - TEPAT 5 NPC)
function buildClassroomScene() {
  clearRoom();
  GameState.currentRoom = "classroom";
  document.getElementById("hud-location-name").innerText = "Kelas 1 Gamma";

  // 1. Lantai Parquet Kayu (26 x 22 unit)
  const parquetTex = createParquetTexture();
  parquetTex.repeat.set(5, 4);
  const floorGeo = new THREE.PlaneGeometry(26, 22);
  floorGeo.rotateX(-Math.PI / 2);
  const floorMat = new THREE.MeshStandardMaterial({
    map: parquetTex,
    roughness: 0.65
  });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.receiveShadow = true;
  scene.add(floor);
  roomMeshes.push(floor);

  // 2. Dinding Perimeter Kelas
  const wallMat = new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.9 });
  const skirtMat = new THREE.MeshStandardMaterial({ color: 0x78350f });

  const buildWall = (x, z, w, d, h = 4.8) => {
    const wall = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), wallMat);
    wall.position.set(x, h / 2, z);
    wall.receiveShadow = true;
    scene.add(wall);
    roomMeshes.push(wall);

    const skirt = new THREE.Mesh(new THREE.BoxGeometry(w + 0.02, 0.4, d + 0.02), skirtMat);
    skirt.position.set(x, 0.2, z);
    scene.add(skirt);
    roomMeshes.push(skirt);

    addBoxCollider(x, z, w, d);
  };

  buildWall(0, -11, 26, 0.8); // Dinding Hadapan
  buildWall(-13, 0, 0.8, 22); // Kiri
  buildWall(13, 0, 0.8, 22);  // Kanan
  buildWall(-7.5, 11, 11, 0.8); // Belakang Kiri
  buildWall(7.5, 11, 11, 0.8);  // Belakang Kanan

  // Pintu Keluar ke Kantin & Padang (Selatan)
  const doorFrame = new THREE.Mesh(
    new THREE.BoxGeometry(4.2, 4.4, 0.6),
    new THREE.MeshStandardMaterial({ color: 0x78350f })
  );
  doorFrame.position.set(0, 2.2, 11);
  scene.add(doorFrame);
  roomMeshes.push(doorFrame);

  const signTex = createDoorSignTexture("KORIDOR SEKOLAH", "KE KANTIN & PADANG");
  const sign = new THREE.Mesh(
    new THREE.PlaneGeometry(2.4, 0.9),
    new THREE.MeshBasicMaterial({ map: signTex, transparent: true })
  );
  sign.rotation.y = Math.PI;
  sign.position.set(0, 3.8, 10.65);
  scene.add(sign);
  roomMeshes.push(sign);

  activeDoors.push({
    name: "Kantin Sekolah",
    targetRoom: "canteen",
    spawnPos: new THREE.Vector3(0, 1.4, -9.5),
    position: new THREE.Vector3(0, 1.4, 9.8),
    radius: 2.2
  });
  addBoxCollider(0, 11.5, 4.4, 0.8);

  // 3. Papan Putih Nombor Arab 1-10 (Hadapan Kelas)
  const bbTex = createBlackboardArabicTexture();
  const blackboard = new THREE.Mesh(
    new THREE.PlaneGeometry(9.6, 3.4),
    new THREE.MeshBasicMaterial({ map: bbTex })
  );
  blackboard.position.set(0, 2.5, -10.55);
  scene.add(blackboard);
  roomMeshes.push(blackboard);

  // 4. Meja Guru Ustaz Alif dengan Laptop Bercahaya
  const teacherDeskGroup = new THREE.Group();
  teacherDeskGroup.position.set(5.5, 0, -8.0);
  const deskTop = new THREE.Mesh(
    new THREE.BoxGeometry(3.6, 0.2, 1.6),
    new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.6 })
  );
  deskTop.position.y = 1.1;
  deskTop.castShadow = true;
  teacherDeskGroup.add(deskTop);

  const deskLegGeo = new THREE.BoxGeometry(0.15, 1.1, 1.4);
  const deskLegMat = new THREE.MeshStandardMaterial({ color: 0x451a03 });
  const legL = new THREE.Mesh(deskLegGeo, deskLegMat); legL.position.set(-1.6, 0.55, 0);
  const legR = new THREE.Mesh(deskLegGeo, deskLegMat); legR.position.set(1.6, 0.55, 0);
  teacherDeskGroup.add(legL, legR);

  const laptopBase = new THREE.Mesh(
    new THREE.BoxGeometry(0.9, 0.05, 0.65),
    new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.3 })
  );
  laptopBase.position.set(0, 1.23, 0);
  teacherDeskGroup.add(laptopBase);

  const laptopScreen = new THREE.Mesh(
    new THREE.BoxGeometry(0.9, 0.6, 0.05),
    new THREE.MeshBasicMaterial({ color: 0x93c5fd })
  );
  laptopScreen.position.set(0, 1.55, -0.3);
  laptopScreen.rotation.x = 0.15;
  teacherDeskGroup.add(laptopScreen);

  scene.add(teacherDeskGroup);
  roomMeshes.push(teacherDeskGroup);
  addBoxCollider(5.5, -8.0, 3.8, 1.8);

  // 5. Set Meja Murid Kelas
  const createStudentDesk = (x, z) => {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    const table = new THREE.Mesh(
      new THREE.BoxGeometry(3.2, 0.15, 1.3),
      new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.7 })
    );
    table.position.y = 0.95;
    table.castShadow = true;
    group.add(table);

    const legGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.95, 8);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, metalness: 0.5 });
    const p1 = new THREE.Mesh(legGeo, legMat); p1.position.set(-1.4, 0.47, -0.5);
    const p2 = new THREE.Mesh(legGeo, legMat); p2.position.set(1.4, 0.47, -0.5);
    const p3 = new THREE.Mesh(legGeo, legMat); p3.position.set(-1.4, 0.47, 0.5);
    const p4 = new THREE.Mesh(legGeo, legMat); p4.position.set(1.4, 0.47, 0.5);
    group.add(p1, p2, p3, p4);

    const book = new THREE.Mesh(
      new THREE.BoxGeometry(0.55, 0.06, 0.45),
      new THREE.MeshStandardMaterial({ color: 0x059669 })
    );
    book.position.set(-0.6, 1.05, 0.1);
    group.add(book);

    scene.add(group);
    roomMeshes.push(group);
    addBoxCollider(x, z, 3.4, 1.6);
  };

  createStudentDesk(-5.0, -3.5);
  createStudentDesk(4.0, -3.5);
  createStudentDesk(-5.0, 2.5);
  createStudentDesk(4.0, 2.5);

  // ==========================================
  // TEPAT 5 NPC DI KELAS 1 GAMMA
  // ==========================================
  const sName = getPlayerName();

  // 1. Ustaz Alif (Guru Bahasa Arab)
  activeNPCs.push(new NPC({
    id: "ustaz",
    name: "Ustaz Alif",
    role: "Guru Bahasa Arab 1 Gamma",
    charType: "teacher_ustaz",
    x: 0.0,
    z: -7.5,
    facing: "down",
    dialogue: [
      `Assalamualaikum, selamat kembali ke sekolah, ${sName}!`,
      `Ustaz tahu semalam kamu tidak hadir kerana kurang sihat. Jangan risau, hari ini kita kejar pembelajaran bersama!`,
      `Mari mulakan dengan Pelajaran A: mengenali angka biasa 1 hingga 10 kepada angka Arab ١ hingga ١٠ serta menjawab mini kuiz.`
    ]
  }));

  // 2. Hana (Murid Pembimbing Bertudung Putih)
  activeNPCs.push(new NPC({
    id: "hana",
    name: "Hana",
    role: "Murid Pembimbing 1 Gamma",
    charType: "hana",
    x: -5.0,
    z: -2.0,
    facing: "right",
    dialogue: [
      `Hai ${sName}! Selamat kembali ke kelas 1 Gamma!`,
      `Saya Hana. Ustaz Alif minta saya bimbing kamu bagi Pelajaran B untuk belajar perkataan nombor Bahasa Arab berbaris lengkap.`,
      `Selesaikan Pelajaran A bersama Ustaz Alif dahulu ya. Selepas itu, Hana akan bantu kamu!`
    ]
  }));

  // 3. Ali (Murid Lelaki)
  activeNPCs.push(new NPC({
    id: "ali",
    name: "Ali",
    role: "Rakan Sekelas 1 Gamma",
    charType: "student_male",
    x: 4.0,
    z: -2.0,
    facing: "left",
    dialogue: [
      `Hai ${sName}! Senang dapat jumpa kamu semula hari ini!`,
      `Bahasa Arab senang sangat kalau ingat angka ١ (wahid) sampai ١٠ (asyarah)!`,
      `Nanti masa rehat jom pergi kantin sama-sama!`
    ]
  }));

  // 4. Sarah (Murid Perempuan Bertudung Putih)
  activeNPCs.push(new NPC({
    id: "sarah",
    name: "Sarah",
    role: "Rakan Sekelas 1 Gamma",
    charType: "student_female",
    x: -5.0,
    z: 4.0,
    facing: "right",
    dialogue: [
      `Assalamualaikum ${sName}! Semalam Ustaz Alif ada tanya pasal kamu.`,
      `Bagus kamu sudah sihat dan hadir hari ini. Belajar rajin-rajin ya!`,
      `Hana sangat pandai mengajar sebutan nombor Arab dengan tajwid yang betul!`
    ]
  }));

  // 5. Danish (Murid Lelaki)
  activeNPCs.push(new NPC({
    id: "danish",
    name: "Danish",
    role: "Rakan Sekelas 1 Gamma",
    charType: "student_male",
    x: 4.0,
    z: 4.0,
    facing: "left",
    dialogue: [
      `Hai ${sName}! Hari ini ada kelas Pendidikan Jasmani di padang dengan Cikgu Amir!`,
      `Tapi Ustaz Alif kata ada Ujian Akhir Bahasa Arab petang nanti. Kita kena skor penuh!`
    ]
  }));
}

// B. KANTIN SEKOLAH (TEPAT 4 NPC)
function buildCanteenScene() {
  clearRoom();
  GameState.currentRoom = "canteen";
  document.getElementById("hud-location-name").innerText = "Kantin Sekolah";

  // Lantai Marmar Bersih (30 x 26 unit)
  const marbleTex = createMarbleTexture();
  marbleTex.repeat.set(6, 5);
  const floorGeo = new THREE.PlaneGeometry(30, 26);
  floorGeo.rotateX(-Math.PI / 2);
  const floorMat = new THREE.MeshStandardMaterial({
    map: marbleTex,
    roughness: 0.45,
    metalness: 0.1
  });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.receiveShadow = true;
  scene.add(floor);
  roomMeshes.push(floor);

  // Dinding Perimeter Kantin
  const wallMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.85 });
  const skirtMat = new THREE.MeshStandardMaterial({ color: 0x064e3b });

  const buildWall = (x, z, w, d, h = 5) => {
    const wall = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), wallMat);
    wall.position.set(x, h / 2, z);
    wall.receiveShadow = true;
    scene.add(wall);
    roomMeshes.push(wall);

    const skirt = new THREE.Mesh(new THREE.BoxGeometry(w + 0.02, 0.4, d + 0.02), skirtMat);
    skirt.position.set(x, 0.2, z);
    scene.add(skirt);
    roomMeshes.push(skirt);

    addBoxCollider(x, z, w, d);
  };

  buildWall(-8.5, -13, 13, 0.8);
  buildWall(8.5, -13, 13, 0.8);
  buildWall(0, 13, 30, 0.8);
  buildWall(-15, 0, 0.8, 26);
  buildWall(15, -7.5, 0.8, 11);
  buildWall(15, 7.5, 0.8, 11);

  // Pintu 1: Kembali ke Kelas 1 Gamma (Utara)
  const door1Frame = new THREE.Mesh(
    new THREE.BoxGeometry(4.2, 4.4, 0.6),
    new THREE.MeshStandardMaterial({ color: 0x78350f })
  );
  door1Frame.position.set(0, 2.2, -13);
  scene.add(door1Frame);
  roomMeshes.push(door1Frame);

  const signTex1 = createDoorSignTexture("KELAS 1 GAMMA", "USTAZ ALIF");
  const sign1 = new THREE.Mesh(
    new THREE.PlaneGeometry(2.4, 0.9),
    new THREE.MeshBasicMaterial({ map: signTex1, transparent: true })
  );
  sign1.position.set(0, 3.9, -12.65);
  scene.add(sign1);
  roomMeshes.push(sign1);

  activeDoors.push({
    name: "Kelas 1 Gamma",
    targetRoom: "classroom",
    spawnPos: new THREE.Vector3(0, 1.4, 7),
    position: new THREE.Vector3(0, 1.4, -11.8),
    radius: 2.2
  });
  addBoxCollider(0, -13.5, 4.4, 0.8);

  // Pintu 2: Ke Padang Sekolah (Timur)
  const door2Frame = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 4.4, 4.6),
    new THREE.MeshStandardMaterial({ color: 0x78350f })
  );
  door2Frame.position.set(15, 2.2, 0);
  scene.add(door2Frame);
  roomMeshes.push(door2Frame);

  const signTex2 = createDoorSignTexture("PADANG SEKOLAH", "CIKGU AMIR");
  const sign2 = new THREE.Mesh(
    new THREE.PlaneGeometry(2.4, 0.9),
    new THREE.MeshBasicMaterial({ map: signTex2, transparent: true })
  );
  sign2.rotation.y = -Math.PI / 2;
  sign2.position.set(14.65, 3.9, 0);
  scene.add(sign2);
  roomMeshes.push(sign2);

  activeDoors.push({
    name: "Padang Sukan",
    targetRoom: "padang",
    spawnPos: new THREE.Vector3(-14, 1.4, 0),
    position: new THREE.Vector3(13.8, 1.4, 0),
    radius: 2.4
  });
  addBoxCollider(15.5, 0, 0.8, 4.6);

  // Kaunter Makanan Kantin
  const counterGroup = new THREE.Group();
  counterGroup.position.set(-6.0, 0, -6.0);
  const cTop = new THREE.Mesh(
    new THREE.BoxGeometry(8.0, 1.2, 1.8),
    new THREE.MeshStandardMaterial({ color: 0x059669, roughness: 0.4 })
  );
  cTop.position.y = 0.6;
  cTop.castShadow = true;
  counterGroup.add(cTop);

  // Pinggan & Makanan Hiasan
  const apple = new THREE.Mesh(
    new THREE.SphereGeometry(0.25, 12, 12),
    new THREE.MeshStandardMaterial({ color: 0xdc2626 })
  );
  apple.position.set(-2.0, 1.35, 0);
  counterGroup.add(apple);

  const milk = new THREE.Mesh(
    new THREE.BoxGeometry(0.35, 0.5, 0.35),
    new THREE.MeshStandardMaterial({ color: 0x38bdf8 })
  );
  milk.position.set(1.5, 1.45, 0);
  counterGroup.add(milk);

  scene.add(counterGroup);
  roomMeshes.push(counterGroup);
  addBoxCollider(-6.0, -6.0, 8.2, 2.0);

  // Meja Makan Kantin Panjang
  const createCanteenTable = (x, z) => {
    const tableGroup = new THREE.Group();
    tableGroup.position.set(x, 0, z);
    const tbl = new THREE.Mesh(
      new THREE.BoxGeometry(5.0, 0.15, 1.6),
      new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.5 })
    );
    tbl.position.y = 0.95;
    tbl.castShadow = true;
    tableGroup.add(tbl);

    const b1 = new THREE.Mesh(
      new THREE.BoxGeometry(4.8, 0.1, 0.6),
      new THREE.MeshStandardMaterial({ color: 0xd97706 })
    );
    b1.position.set(0, 0.5, -1.3);
    const b2 = new THREE.Mesh(
      new THREE.BoxGeometry(4.8, 0.1, 0.6),
      new THREE.MeshStandardMaterial({ color: 0xd97706 })
    );
    b2.position.set(0, 0.5, 1.3);
    tableGroup.add(b1, b2);

    scene.add(tableGroup);
    roomMeshes.push(tableGroup);
    addBoxCollider(x, z, 5.2, 3.4);
  };

  createCanteenTable(-5, 5);
  createCanteenTable(6, 5);

  // ==========================================
  // TEPAT 4 NPC DI KANTIN
  // ==========================================
  const sName = getPlayerName();

  // 1. Makcik Kantin
  activeNPCs.push(new NPC({
    id: "kantin",
    name: "Makcik Kantin",
    role: "Penjaga Kantin Sekolah",
    charType: "npc_kantin",
    x: -6.0,
    z: -7.5,
    facing: "down",
    dialogue: [
      `Assalamualaikum ${sName}! Bau sedap tak ayam goreng dan aiskrim hari ini?`,
      `Makcik ada Side Quest khas untuk kamu: tolong kira pesanan makanan dalam Bahasa Arab!`,
      `Jawab 5 soalan mengira dan padankan dengan angka Arab yang betul untuk dapatkan lencana PEMBANTU KANTIN!`
    ]
  }));

  // 2. Ahmad (Murid Lelaki)
  activeNPCs.push(new NPC({
    id: "ahmad",
    name: "Ahmad",
    role: "Murid 1 Gamma",
    charType: "student_male",
    x: -8.0,
    z: 5.0,
    facing: "right",
    dialogue: [
      `Nasi lemak Makcik Kantin sedap betul! Saya baru beli dua bungkus (اثْنَانِ)!`,
      `Kamu dah bantu Makcik Kantin kira makanan ke, ${sName}?`
    ]
  }));

  // 3. Auni (Murid Perempuan Bertudung Putih)
  activeNPCs.push(new NPC({
    id: "auni",
    name: "Auni",
    role: "Murid 1 Gamma",
    charType: "student_female",
    x: 9.0,
    z: 5.0,
    facing: "left",
    dialogue: [
      `Hai ${sName}! Jangan lupa basuh tangan sebelum makan ya!`,
      `Nanti lepas rehat ada kelas PJ dengan Cikgu Amir di padang!`
    ]
  }));

  // 4. Farid (Murid Lelaki)
  activeNPCs.push(new NPC({
    id: "farid",
    name: "Farid",
    role: "Murid 1 Gamma",
    charType: "student_male",
    x: 0.0,
    z: 0.0,
    facing: "down",
    dialogue: [
      `Jom cepat selesaikan misi kantin dan padang! Ustaz Alif sedang tunggu kita untuk Ujian Akhir!`
    ]
  }));
}

// C. PADANG SUKAN SEKOLAH (TEPAT 3 NPC)
function buildPadangScene() {
  clearRoom();
  GameState.currentRoom = "padang";
  document.getElementById("hud-location-name").innerText = "Padang Sukan Sekolah";

  // Padang Rumput Hijau (40 x 30 unit)
  const grassTex = createGrassTexture();
  grassTex.repeat.set(6, 5);
  const floorGeo = new THREE.PlaneGeometry(40, 30);
  floorGeo.rotateX(-Math.PI / 2);
  const floorMat = new THREE.MeshStandardMaterial({
    map: grassTex,
    roughness: 0.95
  });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.receiveShadow = true;
  scene.add(floor);
  roomMeshes.push(floor);

  // Garisan Padang
  const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const drawPitchLine = (x, z, w, d) => {
    const line = new THREE.Mesh(new THREE.PlaneGeometry(w, d), lineMat);
    line.rotateX(-Math.PI / 2);
    line.position.set(x, 0.018, z);
    scene.add(line);
    roomMeshes.push(line);
  };
  drawPitchLine(8, 0, 0.2, 18);
  drawPitchLine(14, -9, 12, 0.2);
  drawPitchLine(14, 9, 12, 0.2);
  drawPitchLine(12, 0, 0.5, 0.5);

  // Bola Sepak 3D
  const soccerBall = new THREE.Mesh(
    new THREE.SphereGeometry(0.35, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.35 })
  );
  soccerBall.position.set(12, 0.35, 0);
  soccerBall.castShadow = true;
  scene.add(soccerBall);
  roomMeshes.push(soccerBall);

  // Pagar Hijau
  const fenceMat = new THREE.MeshStandardMaterial({ color: 0x166534, wireframe: true });
  const buildFence = (x, z, w, d, h = 4.0) => {
    const fence = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), fenceMat);
    fence.position.set(x, h / 2, z);
    scene.add(fence);
    roomMeshes.push(fence);
    addBoxCollider(x, z, w, d);
  };

  buildFence(0, -15, 40, 0.6);
  buildFence(0, 15, 40, 0.6);
  buildFence(20, 0, 0.6, 30);
  buildFence(-20, -8, 0.6, 14);
  buildFence(-20, 8, 0.6, 14);

  // Pintu Pagar Kembali ke Kantin & Sekolah (Barat)
  const gateFrame = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 4.4, 4.8),
    new THREE.MeshStandardMaterial({ color: 0x1e293b })
  );
  gateFrame.position.set(-20, 2.2, 0);
  scene.add(gateFrame);
  roomMeshes.push(gateFrame);

  const signTex = createDoorSignTexture("KANTIN SEKOLAH", "PINTU MASUK");
  const sign = new THREE.Mesh(
    new THREE.PlaneGeometry(2.4, 0.9),
    new THREE.MeshBasicMaterial({ map: signTex, transparent: true })
  );
  sign.rotation.y = Math.PI / 2;
  sign.position.set(-19.65, 3.8, 0);
  scene.add(sign);
  roomMeshes.push(sign);

  activeDoors.push({
    name: "Kantin Sekolah",
    targetRoom: "canteen",
    spawnPos: new THREE.Vector3(11.0, 1.4, 0),
    position: new THREE.Vector3(-18.5, 1.4, 0),
    radius: 2.2
  });
  addBoxCollider(-20.5, 0, 0.8, 4.8);

  // Tiang Gol Bola Sepak 3D
  const goalGroup = new THREE.Group();
  const postMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
  const groundBarMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.35 });

  const pFL = new THREE.Vector3(0, 0, -3.2);
  const pFR = new THREE.Vector3(0, 0, 3.2);
  const pTL = new THREE.Vector3(0, 3.2, -3.2);
  const pTR = new THREE.Vector3(0, 3.2, 3.2);
  const pBL = new THREE.Vector3(1.3, 3.2, -3.2);
  const pBR = new THREE.Vector3(1.3, 3.2, 3.2);
  const pGL = new THREE.Vector3(2.7, 0.05, -3.2);
  const pGR = new THREE.Vector3(2.7, 0.05, 3.2);
  const pGFL = new THREE.Vector3(0, 0.05, -3.2);
  const pGFR = new THREE.Vector3(0, 0.05, 3.2);

  goalGroup.add(
    createTube(pFL, pTL, 0.11, postMat),
    createTube(pFR, pTR, 0.11, postMat),
    createTube(pTL, pTR, 0.11, postMat),
    createTube(pTL, pBL, 0.075, postMat),
    createTube(pTR, pBR, 0.075, postMat),
    createTube(pBL, pBR, 0.075, postMat),
    createTube(pBL, pGL, 0.075, postMat),
    createTube(pBR, pGR, 0.075, postMat),
    createTube(pGFL, pGL, 0.07, groundBarMat),
    createTube(pGFR, pGR, 0.07, groundBarMat),
    createTube(pGL, pGR, 0.07, groundBarMat)
  );

  const netTex = createSoccerNetTexture();
  const netMat = new THREE.MeshStandardMaterial({
    map: netTex,
    transparent: true,
    opacity: 0.85,
    side: THREE.DoubleSide,
    depthWrite: false
  });
  goalGroup.add(
    createNetQuad(pTL, pBL, pBR, pTR, netMat, 3, 8),
    createNetQuad(pBL, pGL, pGR, pBR, netMat, 6, 8),
    createNetQuad(pGFL, pTL, pBL, pGL, netMat, 4, 4),
    createNetQuad(pGFR, pTR, pBR, pGR, netMat, 4, 4)
  );

  goalGroup.position.set(16.5, 0, 0);
  scene.add(goalGroup);
  roomMeshes.push(goalGroup);
  addBoxCollider(17.85, 0, 2.7, 6.6);

  // Kon Sukan
  const coneMat = new THREE.MeshStandardMaterial({ color: 0xf97316 });
  for (let z = -6; z <= 6; z += 3) {
    const cone = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.6, 12), coneMat);
    cone.position.set(6, 0.3, z);
    scene.add(cone);
    roomMeshes.push(cone);
  }

  // ==========================================
  // TEPAT 3 NPC DI PADANG
  // ==========================================
  const sName = getPlayerName();

  // 1. Cikgu Amir (Guru PJ)
  activeNPCs.push(new NPC({
    id: "sukan",
    name: "Cikgu Amir",
    role: "Guru Pendidikan Jasmani",
    charType: "teacher_pe",
    x: 4.0,
    z: -7.0,
    facing: "down",
    dialogue: [
      `Priiitt! Bersemangat sungguh ${sName} petang ini!`,
      `Cikgu ada Side Quest khas di padang: bantu cikgu mengira peralatan sukan dalam sebutan perkataan Bahasa Arab!`,
      `Kira bola sepak, kon, dan wisel, kemudian padankan dengan perkataan Arab berbaris untuk meraih lencana WIRA PADANG!`
    ]
  }));

  // 2. Hariz (Murid Lelaki)
  activeNPCs.push(new NPC({
    id: "hariz",
    name: "Hariz",
    role: "Murid 1 Gamma",
    charType: "student_male",
    x: 10.0,
    z: 2.0,
    facing: "left",
    dialogue: [
      `Gol! Saya baru jaringkan bola ke gawang!`,
      `Perkataan Arab untuk satu ialah وَاحِدٌ (Wahidun)! Betul kan, ${sName}?`
    ]
  }));

  // 3. Hakim (Murid Lelaki)
  activeNPCs.push(new NPC({
    id: "hakim",
    name: "Hakim",
    role: "Murid 1 Gamma",
    charType: "student_male",
    x: -6.0,
    z: 4.0,
    facing: "up",
    dialogue: [
      `Laju betul lari keliling padang! Jangan lupa minum air ya!`
    ]
  }));
}

// ==========================================================================
// 10. DOOR ACCESS CHECK & WARP TRANSITION
// ==========================================================================
const player = new Player();

function tryPassDoor(door) {
  // Syarat Sekatan Bilik Kelas: Pemain TIDAK BOLEH keluar dari Kelas 1 Gamma
  // selagi Ustaz Alif (Pelajaran A + Mini Kuiz 3/3) & Hana (Pelajaran B) belum selesai!
  if (GameState.currentRoom === "classroom") {
    if (!gameStorage.isClassroomCleared()) {
      Sound.playWrong();
      player.position.z = 8.2; // Tolak pemain ke belakang sedikit dari ambang pintu

      const session = gameStorage.session;
      let warningDialogue = [];

      if (!session.ustazModuleDone) {
        showToast("⛔ Pintu ditutup! Sila jumpa Ustaz Alif di hadapan kelas dahulu.");
        warningDialogue = [
          `Tunggu sebentar, ${getPlayerName()}!`,
          `Pintu kelas dikunci. Kamu perlu pergi ke hadapan kelas dan berjumpa Ustaz Alif untuk memulakan Pelajaran A terlebih dahulu!`,
          `Mari kita belajar nombor Arab 1 hingga 10 bersama Ustaz Alif di hadapan kelas ya!`
        ];
      } else if (!session.ustazMiniQuizDone) {
        showToast("⛔ Selesaikan Mini Kuiz bersama Ustaz Alif dahulu!");
        warningDialogue = [
          `Tunggu sebentar, ${getPlayerName()}!`,
          `Kamu belum selesai menjawab Mini Kuiz (skor 3/3) bersama Ustaz Alif.`,
          `Sila jumpa Ustaz Alif di hadapan kelas untuk melengkapkan Mini Kuiz dahulu ya!`
        ];
      } else if (!session.hanaModuleDone) {
        showToast("⛔ Selesaikan Pelajaran B bersama Hana dahulu!");
        warningDialogue = [
          `Tunggu sebentar, ${getPlayerName()}!`,
          `Tahniah sudah lulus Pelajaran A, tetapi kamu perlu belajar Pelajaran B bersama Hana di meja hadapan kiri dahulu sebelum dibenarkan keluar!`,
          `Mari jumpa Hana di meja hadapan kiri ya!`
        ];
      } else {
        showToast("⛔ Selesaikan pembelajaran di dalam kelas dahulu!");
        warningDialogue = [
          `Tunggu sebentar, ${getPlayerName()}!`,
          `Mari lengkapkan pembelajaran kita di dalam kelas dahulu ya!`
        ];
      }

      openVNDialogue({
        id: "ustaz_warning",
        name: "Ustaz Alif",
        role: "Guru Bahasa Arab",
        charType: "teacher_ustaz",
        dialogue: warningDialogue
      });
      return;
    }
  }

  warpToRoom(door.targetRoom, door.spawnPos);
}

function warpToRoom(targetRoom, spawnPos) {
  if (GameState.isTransitioning) return;
  GameState.isTransitioning = true;
  Sound.playDoorWarp();

  const curtain = document.getElementById("warp-curtain");
  curtain.classList.add("active");

  setTimeout(() => {
    if (targetRoom === "classroom") {
      buildClassroomScene();
      player.facing = "up";
    } else if (targetRoom === "canteen") {
      buildCanteenScene();
      player.facing = spawnPos.z < 0 ? "down" : "left";
    } else if (targetRoom === "padang") {
      buildPadangScene();
      player.facing = "right";
    }

    player.walkFrame = 1;
    player.updateTexture();
    player.position.copy(spawnPos);
    player.mesh.position.set(spawnPos.x, 1.4, spawnPos.z);
    player.shadowMesh.position.set(spawnPos.x, 0.02, spawnPos.z);

    cameraTarget.set(spawnPos.x, 1.2, spawnPos.z);
    const camDist = 16.5;
    const camHeight = 14.8;
    camera.position.set(
      cameraTarget.x + Math.sin(camAngleY) * camDist,
      cameraTarget.y + camHeight,
      cameraTarget.z + Math.cos(camAngleY) * camDist
    );
    camera.lookAt(cameraTarget);

    setTimeout(() => {
      curtain.classList.remove("active");
      GameState.isTransitioning = false;
      showToast(`Tiba di: ${document.getElementById("hud-location-name").innerText}`);
    }, 150);
  }, 350);
}

// ==========================================================================
// 11. FLOATING PROMPT & INTERACTION LOGIC
// ==========================================================================
const floatingIndicator = document.getElementById("floating-indicator");
const floatingText = document.getElementById("floating-indicator-text");
let currentInteractTarget = null;
const tempVec = new THREE.Vector3();

floatingIndicator.addEventListener("click", () => {
  handleActionInput();
});

function updateFloatingIndicator() {
  if (GameState.isTransitioning || GameState.isVNActive || GameState.isModalActive) {
    floatingIndicator.style.display = "none";
    currentInteractTarget = null;
    return;
  }

  let nearest = null;
  let minDist = 2.5;

  for (const door of activeDoors) {
    const d = player.position.distanceTo(door.position);
    if (d < door.radius && d < minDist) {
      minDist = d;
      nearest = { type: "door", data: door, pos: door.position };
    }
  }

  for (const npc of activeNPCs) {
    const d = player.position.distanceTo(npc.position);
    if (d < 2.5 && d < minDist) {
      minDist = d;
      nearest = { type: "npc", data: npc, pos: npc.position };
    }
  }

  currentInteractTarget = nearest;

  if (nearest) {
    tempVec.copy(nearest.pos);
    tempVec.y += 1.8;
    tempVec.project(camera);

    if (tempVec.z < 1) {
      const x = (tempVec.x * 0.5 + 0.5) * window.innerWidth;
      const y = (-(tempVec.y * 0.5) + 0.5) * window.innerHeight;
      floatingIndicator.style.left = `${x}px`;
      floatingIndicator.style.top = `${y}px`;
      floatingIndicator.style.display = "flex";

      if (nearest.type === "door") {
        floatingText.innerText = `Masuk ke ${nearest.data.name}`;
      } else {
        floatingText.innerText = `Bercakap dengan ${nearest.data.name}`;
      }
    } else {
      floatingIndicator.style.display = "none";
    }
  } else {
    floatingIndicator.style.display = "none";
  }
}

function handleActionInput() {
  // 1. Kad Pembelajaran (Pelajaran A / Pelajaran B)
  if (learningModal && learningModal.classList.contains("active")) {
    if (currentCardIndex < 9) {
      btnLearnNext.click();
    } else {
      btnLearnFinish.click();
    }
    return;
  }

  // 2. Butang Pilihan atau Seterusnya pada Modal Kuiz / Ujian
  if (quizModal && quizModal.classList.contains("active")) {
    if (!isAnswerLocked) {
      const optBtns = quizOptionsGrid ? quizOptionsGrid.querySelectorAll(".quiz-opt-btn") : [];
      if (optBtns.length > 0 && optBtns[quizSelectedIndex]) {
        optBtns[quizSelectedIndex].click();
        return;
      }
    } else if (quizFooterBtn && quizFooterBtn.style.display !== "none") {
      quizFooterBtn.click();
      return;
    }
  }

  // 3. Modal Misi Selesai (Kembali ke kelas)
  if (missionCompleteModal && missionCompleteModal.classList.contains("active")) {
    btnReturnClass.click();
    return;
  }

  // 4. Dialog Visual Novel (NPC)
  if (GameState.isVNActive) {
    advanceVNDialogue();
    return;
  }

  // 5. Interaksi Dunia (Pintu / NPC)
  if (currentInteractTarget) {
    if (currentInteractTarget.type === "door") {
      tryPassDoor(currentInteractTarget.data);
    } else if (currentInteractTarget.type === "npc") {
      openVNDialogue(currentInteractTarget.data);
    }
  }
}

// ==========================================================================
// 12. DIALOGUE OVERLAY & ACTION BUTTONS
// ==========================================================================
const vnModal = document.getElementById("vn-modal");
const vnSpeakerName = document.getElementById("vn-speaker-name");
const vnSpeakerTitle = document.getElementById("vn-speaker-title");
const vnDialogText = document.getElementById("vn-dialog-text");
const vnTextVisible = document.getElementById("vn-text-visible");
const vnTextGhost = document.getElementById("vn-text-ghost");
const vnActionButtons = document.getElementById("vn-action-buttons");
const vnContinueHint = document.getElementById("vn-continue-hint");

let vnCurrentNPC = null;
let vnLineIndex = 0;
let vnRafId = null;
let vnIsTyping = false;
let vnFullText = "";
let vnCharIdx = 0;
let vnCharProgress = 0;
let vnLastLoopTime = 0;
let vnLastSoundTime = 0;

function openVNDialogue(npc) {
  GameState.isVNActive = true;
  vnCurrentNPC = npc;
  vnLineIndex = 0;
  Sound.playInteract();

  const session = gameStorage.session;
  const sName = getPlayerName();

  // Kemas kini dialog kontekstual mengikut status kemajuan murid
  if (npc.id === "ustaz") {
    if (session.ustazModuleDone && !session.ustazMiniQuizDone) {
      npc.dialogue = [
        `Mari kita cuba lagi Mini Kuiz Pelajaran A, ${sName}! Kamu perlu 3/3 markah penuh untuk lulus.`
      ];
    } else if (session.ustazMiniQuizDone && !session.hanaModuleDone) {
      npc.dialogue = [
        `Tahniah, ${sName}! Kamu sudah kuasai Pelajaran A!`,
        `Sekarang sila jumpa Hana di meja hadapan kiri untuk Pelajaran B (perkataan Arab).`
      ];
    } else if (session.hanaModuleDone && !(session.canteenCompleted && session.fieldCompleted)) {
      npc.dialogue = [
        `Bagus sekali, ${sName}! Pelajaran A dan Pelajaran B sudah selesai!`,
        `Sekarang kamu boleh keluar ke kantin dan padang sekolah untuk menyelesaikan Side Quest sebelum Ujian Akhir.`
      ];
    } else if (session.canteenCompleted && session.fieldCompleted && !session.finalExamCompleted) {
      npc.dialogue = [
        `Syabas ${sName}! Semua misi di kantin dan padang sudah selesai!`,
        `Adakah kamu sudah bersedia untuk menduduki Ujian Akhir Bahasa Arab (10 soalan)?`
      ];
    } else if (session.finalExamCompleted) {
      npc.dialogue = [
        `Alhamdulillah ${sName}, kamu telah berjaya menamatkan semua misi nombor Arab!`,
        `Semua markah kamu telah direkodkan dengan jayanya ke Google Sheets.`
      ];
    }
  } else if (npc.id === "hana") {
    if (!session.ustazMiniQuizDone) {
      npc.dialogue = [
        `Hai ${sName}! Selamat kembali ke kelas 1 Gamma!`,
        `Sila selesaikan Pelajaran A dan Mini Kuiz bersama Ustaz Alif dahulu ya. Selepas itu baru Hana akan bimbing kamu!`
      ];
    } else if (!session.hanaModuleDone) {
      npc.dialogue = [
        `Tahniah sudah lulus Pelajaran A, ${sName}!`,
        `Mari kita belajar Pelajaran B: menyebut perkataan nombor Bahasa Arab dari satu (وَاحِدٌ) hingga sepuluh (عَشَرَةٌ)!`
      ];
    } else {
      npc.dialogue = [
        `Hebat, ${sName}! Kamu sudah faham perkataan nombor Arab dengan baris lengkap!`,
        `Jangan lupa bantu Makcik Kantin dan Cikgu Amir di padang sebelum Ujian Akhir bersama Ustaz Alif!`
      ];
    }
  }

  vnSpeakerName.innerText = npc.name;
  vnSpeakerTitle.innerText = npc.role;
  vnActionButtons.style.display = "none";
  vnContinueHint.style.display = "flex";

  vnModal.classList.add("active");
  startTypewriter(formatDialogueLine(npc.dialogue[0]));

  // Jika dialog gagal atau cuba semula kuiz atau ujian akhir sedia, paparkan butang terus pada skrin
  if (npc.id === "ustaz_quiz_retry" || npc.id === "ustaz_exam_ready") {
    renderNpcActionButtons();
  }
}

function startTypewriter(text) {
  if (vnRafId) cancelAnimationFrame(vnRafId);
  vnFullText = formatDialogueLine(text || "");
  vnIsTyping = true;
  vnLastLoopTime = 0;
  vnLastSoundTime = performance.now();
  vnCharIdx = Math.min(1, vnFullText.length);
  vnCharProgress = vnCharIdx;

  if (vnTextVisible && vnTextGhost) {
    vnTextVisible.textContent = vnFullText.slice(0, vnCharIdx);
    vnTextGhost.textContent = vnFullText.slice(vnCharIdx);
  }

  if (vnCharIdx > 0) Sound.playTypeChar();

  const TYPING_SPEED = 38;
  function typeLoop(now) {
    if (!vnIsTyping) return;
    if (!vnLastLoopTime) {
      vnLastLoopTime = now;
      vnRafId = requestAnimationFrame(typeLoop);
      return;
    }

    let dt = (now - vnLastLoopTime) / 1000;
    vnLastLoopTime = now;
    if (dt > 0.1) dt = 0.016;

    vnCharProgress += dt * TYPING_SPEED;
    const newCharIdx = Math.min(vnFullText.length, Math.floor(vnCharProgress));

    if (newCharIdx > vnCharIdx) {
      if (now - vnLastSoundTime >= 65) {
        Sound.playTypeChar();
        vnLastSoundTime = now;
      }
      vnCharIdx = newCharIdx;
      if (vnTextVisible && vnTextGhost) {
        vnTextVisible.textContent = vnFullText.slice(0, vnCharIdx);
        vnTextGhost.textContent = vnFullText.slice(vnCharIdx);
      }
    }

    if (vnCharIdx >= vnFullText.length) {
      finishTypewriter();
      return;
    }
    vnRafId = requestAnimationFrame(typeLoop);
  }
  vnRafId = requestAnimationFrame(typeLoop);
}

function finishTypewriter() {
  if (vnRafId) cancelAnimationFrame(vnRafId);
  vnIsTyping = false;
  vnCharIdx = vnFullText.length;
  if (vnTextVisible && vnTextGhost) {
    vnTextVisible.textContent = vnFullText;
    vnTextGhost.textContent = "";
  }

  // Jika baris terakhir, paparkan butang tindakan bersesuaian dengan jalan cerita
  if (vnLineIndex === vnCurrentNPC.dialogue.length - 1) {
    renderNpcActionButtons();
  }
}

function renderNpcActionButtons() {
  vnContinueHint.style.display = "none";
  vnActionButtons.innerHTML = "";
  vnActionButtons.style.display = "flex";

  const session = gameStorage.session;

  const isUstazRelated = (
    vnCurrentNPC.id === "ustaz" ||
    vnCurrentNPC.id === "ustaz_quiz_retry" ||
    vnCurrentNPC.id === "ustaz_quiz_passed" ||
    vnCurrentNPC.id === "ustaz_warning" ||
    vnCurrentNPC.id === "ustaz_exam_ready"
  );

  if (isUstazRelated) {
    // 👳 USTAZ ALIF
    const ustazDone = session.ustazModuleDone && session.ustazMiniQuizDone;
    const sideQuestsDone = session.canteenCompleted && session.fieldCompleted;

    // 1. Amaran Sekatan Pintu Keluar (Pemain CUBA KELUAR sebelum selesai belajar)
    // PENTING: Tiada butang mula belajar di pintu! Pemain wajib pergi ke meja Ustaz Alif / Hana dahulu!
    if (vnCurrentNPC.id === "ustaz_warning") {
      const btnGo = document.createElement("button");
      btnGo.className = "vn-quest-btn";
      if (!session.ustazModuleDone) {
        btnGo.textContent = "🚶 Faham, pergi ke meja Ustaz Alif ➔";
        btnGo.onclick = () => {
          closeVNDialogue();
          showToast("Sila pergi ke meja Ustaz Alif di hadapan kelas untuk memulakan Pelajaran A!");
        };
      } else if (!session.ustazMiniQuizDone) {
        btnGo.textContent = "📝 Faham, jumpa Ustaz Alif untuk Mini Kuiz ➔";
        btnGo.onclick = () => {
          closeVNDialogue();
          showToast("Sila jumpa Ustaz Alif di hadapan kelas untuk menjawab Mini Kuiz!");
        };
      } else if (!session.hanaModuleDone) {
        btnGo.textContent = "👧 Faham, pergi ke meja Hana ➔";
        btnGo.onclick = () => {
          closeVNDialogue();
          showToast("Sila pergi ke meja Hana di hadapan kiri untuk Pelajaran B!");
        };
      } else {
        btnGo.textContent = "Faham ➔";
        btnGo.onclick = () => closeVNDialogue();
      }
      vnActionButtons.appendChild(btnGo);
      if (vnContinueHint) {
        vnContinueHint.style.display = "flex";
        vnContinueHint.innerHTML = "Tekan <b>[Enter]</b> untuk kembali ke kelas ➔";
      }
      return;
    }

    // Jika murid gagal mini kuiz atau belum selesaikan mini kuiz 3/3
    if (vnCurrentNPC.id === "ustaz_quiz_retry" || (session.ustazModuleDone && !session.ustazMiniQuizDone)) {
      const btnRetry = document.createElement("button");
      btnRetry.className = "vn-quest-btn";
      btnRetry.textContent = "🔄 JAWAB MINI KUIZ SEMULA";
      btnRetry.onclick = () => {
        closeVNDialogue();
        openUniversalQuizModal("mini_quiz");
      };
      vnActionButtons.appendChild(btnRetry);

      const btnRevA = document.createElement("button");
      btnRevA.className = "vn-cancel-btn";
      btnRevA.textContent = "📖 Ulang Kaji Pelajaran A";
      btnRevA.onclick = () => {
        closeVNDialogue();
        openLearningModal("ustaz_mod_a");
      };
      vnActionButtons.appendChild(btnRevA);
    } else if (!session.ustazModuleDone) {
      const btnModA = document.createElement("button");
      btnModA.className = "vn-quest-btn";
      btnModA.textContent = "📖 MULA BELAJAR PELAJARAN A (ANGKA ARAB)";
      btnModA.onclick = () => {
        closeVNDialogue();
        openLearningModal("ustaz_mod_a");
      };
      vnActionButtons.appendChild(btnModA);
    } else if (vnCurrentNPC.id === "ustaz_quiz_passed" || !session.hanaModuleDone) {
      const btnToHana = document.createElement("button");
      btnToHana.className = "vn-quest-btn";
      btnToHana.textContent = "Jumpa Hana untuk Pelajaran B ➔";
      btnToHana.onclick = () => {
        closeVNDialogue();
        showToast("Pergi ke meja Hana di hadapan kiri untuk Pelajaran B!");
      };
      vnActionButtons.appendChild(btnToHana);
    } else if (!sideQuestsDone) {
      const btnExplore = document.createElement("button");
      btnExplore.className = "vn-cancel-btn";
      btnExplore.textContent = "Teroka Kantin & Padang Sekolah 🏫";
      btnExplore.onclick = () => {
        closeVNDialogue();
        showToast("Pintu kelas dibuka! Selesaikan Side Quest Kantin & Padang!");
      };
      vnActionButtons.appendChild(btnExplore);

      const btnRevA = document.createElement("button");
      btnRevA.className = "vn-quest-btn";
      btnRevA.textContent = "📖 Ulang Kaji Pelajaran A";
      btnRevA.onclick = () => {
        closeVNDialogue();
        openLearningModal("ustaz_mod_a");
      };
      vnActionButtons.appendChild(btnRevA);
    } else if (vnCurrentNPC.id === "ustaz_exam_ready" || (sideQuestsDone && !session.finalExamCompleted)) {
      // UJIAN AKHIR TERBUKA! (WAJIB JAWAB TERUS - TIADA BUTANG TUTUP/NANTI DAHULU)
      const btnExam = document.createElement("button");
      btnExam.className = "vn-quest-btn";
      btnExam.style.fontSize = "15px";
      btnExam.style.padding = "10px 24px";
      btnExam.textContent = "📝 JAWAB UJIAN AKHIR SEKARANG (10 SOALAN) ⭐";
      btnExam.onclick = () => {
        closeVNDialogue();
        openUniversalQuizModal("final_exam");
      };
      vnActionButtons.appendChild(btnExam);

      if (vnContinueHint) {
        vnContinueHint.style.display = "flex";
        vnContinueHint.innerHTML = "Tekan <b>[E / Enter]</b> untuk mula ▼";
      }
      return; // PENTING: Tiada butang Tutup / Nanti Dahulu! Wajib jawab ujian akhir terus!
    } else if (session.finalExamCompleted) {
      const btnVic = document.createElement("button");
      btnVic.className = "vn-quest-btn";
      btnVic.textContent = "🏆 LIHAT KEPUTUSAN & SIJIL";
      btnVic.onclick = () => {
        closeVNDialogue();
        openVictoryModal();
      };
      vnActionButtons.appendChild(btnVic);

      const btnExploreU = document.createElement("button");
      btnExploreU.className = "vn-cancel-btn";
      btnExploreU.textContent = "Teroka Kawasan Sekolah 🏫";
      btnExploreU.onclick = () => closeVNDialogue();
      vnActionButtons.appendChild(btnExploreU);
    }

  } else if (vnCurrentNPC.id === "hana") {
    // 👧 HANA (MURID PEMBIMBING)
    if (!session.ustazMiniQuizDone) {
      const btnHint = document.createElement("button");
      btnHint.className = "vn-cancel-btn";
      btnHint.textContent = "Faham, jumpa Ustaz Alif dahulu ➔";
      btnHint.onclick = () => closeVNDialogue();
      vnActionButtons.appendChild(btnHint);
    } else if (!session.hanaModuleDone) {
      const btnModB = document.createElement("button");
      btnModB.className = "vn-quest-btn";
      btnModB.textContent = "📖 BELAJAR BERSAMA HANA (PELAJARAN B)";
      btnModB.onclick = () => {
        closeVNDialogue();
        openLearningModal("hana_mod_b");
      };
      vnActionButtons.appendChild(btnModB);
    } else {
      const btnRevB = document.createElement("button");
      btnRevB.className = "vn-quest-btn";
      btnRevB.textContent = "📖 ULANG KAJI PELAJARAN B";
      btnRevB.onclick = () => {
        closeVNDialogue();
        openLearningModal("hana_mod_b");
      };
      vnActionButtons.appendChild(btnRevB);

      const btnExploreH = document.createElement("button");
      btnExploreH.className = "vn-cancel-btn";
      btnExploreH.textContent = "Teruskan Teroka Sekolah 🏫";
      btnExploreH.onclick = () => closeVNDialogue();
      vnActionButtons.appendChild(btnExploreH);
    }

  } else if (vnCurrentNPC.id === "kantin") {
    // 👩‍🍳 MAK CIK KANTIN
    const btnCanteen = document.createElement("button");
    btnCanteen.className = "vn-quest-btn";
    btnCanteen.textContent = session.canteenCompleted ? "CUBA LAGI KUIZ KANTIN 🥟" : "MULA KUIZ KANTIN 🥟";
    btnCanteen.onclick = () => {
      closeVNDialogue();
      openUniversalQuizModal("canteen");
    };
    vnActionButtons.appendChild(btnCanteen);

  } else if (vnCurrentNPC.id === "sukan") {
    // 🏃 CIKGU AMIR (GURU PJ)
    const btnField = document.createElement("button");
    btnField.className = "vn-quest-btn";
    btnField.textContent = session.fieldCompleted ? "CUBA LAGI KUIZ PADANG ⚽" : "MULA KUIZ PADANG ⚽";
    btnField.onclick = () => {
      closeVNDialogue();
      openUniversalQuizModal("field");
    };
    vnActionButtons.appendChild(btnField);
  }

  // Buang butang 'Nanti Dahulu'.
  // Hanya rakan sekelas biasa (bukan Quest / Guru / Pembimbing) disediakan butang 'Tutup'.
  const isQuestGiver = (
    isUstazRelated ||
    vnCurrentNPC.id === "hana" ||
    vnCurrentNPC.id === "kantin" ||
    vnCurrentNPC.id === "sukan"
  );

  if (!isQuestGiver) {
    const btnClose = document.createElement("button");
    btnClose.className = "vn-cancel-btn";
    btnClose.textContent = "Tutup";
    btnClose.onclick = () => closeVNDialogue();
    vnActionButtons.appendChild(btnClose);
  }

  if (vnContinueHint) {
    vnContinueHint.style.display = "flex";
    vnContinueHint.innerHTML = "Tekan <b>[Enter]</b> untuk teruskan ➔";
  }
}

function advanceVNDialogue() {
  if (vnIsTyping) {
    finishTypewriter();
    return;
  }
  if (vnLineIndex < vnCurrentNPC.dialogue.length - 1) {
    vnLineIndex++;
    Sound.playTextAdvance();
    startTypewriter(formatDialogueLine(vnCurrentNPC.dialogue[vnLineIndex]));
    return;
  }

  // Jika baris terakhir dan butang dipaparkan, tekan Enter / E akan mengaktifkan butang utama terus
  if (vnActionButtons && vnActionButtons.style.display !== "none") {
    const buttons = vnActionButtons.querySelectorAll("button");
    if (buttons.length === 1) {
      buttons[0].click();
    } else if (buttons.length > 1) {
      const primaryBtn = vnActionButtons.querySelector(".vn-quest-btn") || buttons[0];
      primaryBtn.click();
    }
  }
}

function closeVNDialogue() {
  if (vnRafId) cancelAnimationFrame(vnRafId);
  vnIsTyping = false;
  vnModal.classList.remove("active");
  GameState.isVNActive = false;
  vnCurrentNPC = null;
}

document.getElementById("vn-dialog-box").addEventListener("click", (e) => {
  if (e.target.tagName !== "BUTTON") advanceVNDialogue();
});

// ==========================================================================
// 13. PELAJARAN PEMBELAJARAN (PELAJARAN A & PELAJARAN B)
// ==========================================================================
let currentLearningMode = "ustaz_mod_a"; // "ustaz_mod_a" atau "hana_mod_b"
let currentCardIndex = 0;
const learningModal = document.getElementById("learning-modal");
const learningTitle = document.getElementById("learning-modal-title");
const learningStepPill = document.getElementById("learning-step-pill");
const learningCardDisplay = document.getElementById("learning-card-display");
const btnLearnPrev = document.getElementById("btn-learn-prev");
const btnLearnNext = document.getElementById("btn-learn-next");
const btnLearnReview = document.getElementById("btn-learn-review");
const btnLearnFinish = document.getElementById("btn-learn-finish");

function openLearningModal(mode = "ustaz_mod_a") {
  GameState.isModalActive = true;
  currentLearningMode = mode;
  currentCardIndex = 0;
  learningModal.classList.add("active");
  renderLearningCard();
}

function renderLearningCard() {
  const item = ARABIC_NUMBERS[currentCardIndex];
  const isModA = currentLearningMode === "ustaz_mod_a";

  learningTitle.innerText = isModA
    ? "📖 Pelajaran A: Kenali Angka Arab (1–10) • Ustaz Alif"
    : "📖 Pelajaran B: Perkataan Nombor Arab (Baris Lengkap) • Hana";
  learningStepPill.innerText = `Kad ${currentCardIndex + 1} / 10`;

  let starsHtml = "";
  for (let i = 0; i < item.iconCount; i++) {
    starsHtml += `<span class="count-star-item" style="animation-delay:${i * 0.08}s">⭐</span>`;
  }

  if (isModA) {
    learningCardDisplay.innerHTML = `
      <div class="num-comparison-row">
        <div class="num-column">
          <span class="num-sublabel">Nombor Biasa</span>
          <span class="num-big-regular">${item.number}</span>
        </div>
        <div class="num-arrow">➔</div>
        <div class="num-column">
          <span class="num-sublabel">Angka Arab</span>
          <span class="num-big-arabic" style="color:${item.color}">${item.arabicNumeral}</span>
        </div>
      </div>
      <div class="counting-stars-container">${starsHtml}</div>
    `;
  } else {
    learningCardDisplay.innerHTML = `
      <div style="margin-bottom:8px;">
        <span style="background:#fbbf24; color:#0f172a; font-family:'Noto Naskh Arabic',serif; font-size:32px; font-weight:800; padding:2px 16px; border-radius:14px;">
          ${item.arabicNumeral}
        </span>
      </div>
      <div class="arabic-word-large">${item.arabicWord}</div>
      <div class="arabic-transliteration">${item.transliteration}</div>
      <div class="arabic-meaning-bm">Maksud: <b>${item.meaningMalay} (${item.number})</b></div>
      <div class="counting-stars-container">${starsHtml}</div>
    `;
  }

  btnLearnPrev.disabled = currentCardIndex === 0;
  if (currentCardIndex < 9) {
    btnLearnNext.style.display = "block";
    btnLearnNext.innerHTML = 'SETERUSNYA ▶ <span style="font-size:10.5px; color:#fde68a; font-weight:800; background:rgba(0,0,0,0.3); padding:2px 6px; border-radius:4px; margin-left:4px;">[Enter/E]</span>';
    btnLearnFinish.style.display = "none";
  } else {
    btnLearnNext.style.display = "none";
    btnLearnFinish.style.display = "block";
    btnLearnFinish.innerHTML = 'SELESAI PELAJARAN ✓ <span style="font-size:10.5px; color:#fde68a; font-weight:800; background:rgba(0,0,0,0.3); padding:2px 6px; border-radius:4px; margin-left:4px;">[Enter/E]</span>';
  }

  learningCardDisplay.style.cursor = "pointer";
  learningCardDisplay.title = "Tekan atau klik untuk teruskan ke kad seterusnya [Enter / E]";
  learningCardDisplay.onclick = () => {
    if (currentCardIndex < 9) {
      btnLearnNext.click();
    } else {
      btnLearnFinish.click();
    }
  };
}

btnLearnPrev.onclick = () => {
  if (currentCardIndex > 0) {
    Sound.playTextAdvance();
    currentCardIndex--;
    renderLearningCard();
  }
};

btnLearnNext.onclick = () => {
  if (currentCardIndex < 9) {
    Sound.playTextAdvance();
    currentCardIndex++;
    renderLearningCard();
  }
};

btnLearnReview.onclick = () => {
  Sound.playTextAdvance();
  currentCardIndex = 0;
  renderLearningCard();
};

btnLearnFinish.onclick = () => {
  Sound.playCorrect();
  learningModal.classList.remove("active");
  GameState.isModalActive = false;

  if (currentLearningMode === "ustaz_mod_a") {
    gameStorage.completeUstazModule();
    sheetsSync.sync();
    updateHUDProgress();
    showToast("Tahniah! Pelajaran A selesai! Sekarang jawab Mini Kuiz (3 soalan).");

    // Terus buka Mini Kuiz Ustaz Alif
    setTimeout(() => {
      openUniversalQuizModal("mini_quiz");
    }, 450);

  } else {
    gameStorage.completeHanaModule();
    sheetsSync.sync();
    updateHUDProgress();
    showToast("Alhamdulillah! Pelajaran B selesai! Pintu kelas kini dibuka!");

    // Maklumkan pemain bahawa koridor dan pintu dibuka
    setTimeout(() => {
      openVNDialogue({
        id: "hana_cleared",
        name: "Hana",
        role: "Murid Pembimbing",
        charType: "hana",
        dialogue: [
          `Alhamdulillah, ${getPlayerName()} sudah tamatkan Pelajaran B!`,
          `Sekarang pintu kelas telah dibuka. Kamu boleh keluar ke kantin untuk membantu Makcik Kantin dan ke padang untuk membantu Cikgu Amir.`,
          `Selesaikan kedua-dua Side Quest dahulu sebelum kembali ke sini untuk menduduki Ujian Akhir bersama Ustaz Alif ya!`
        ]
      });
    }, 450);
  }
};

// ==========================================================================
// 14. MODAL KUIZ UNIVERSAL (MINI KUIZ, KANTIN, PADANG, UJIAN AKHIR)
// ==========================================================================
let currentQuizCategory = "canteen"; // "mini_quiz" | "canteen" | "field" | "final_exam"
let quizQuestions = [];
let quizIndex = 0;
let quizScore = 0;
let isAnswerLocked = false;

const quizModal = document.getElementById("quiz-modal");
const quizModalTitle = document.getElementById("quiz-modal-title");
const quizStepPill = document.getElementById("quiz-step-pill");
const quizBadgeTag = document.getElementById("quiz-badge-tag");
const quizBadgeIcon = document.getElementById("quiz-badge-icon");
const quizBadgeLabel = document.getElementById("quiz-badge-label");
const quizQuestionBox = document.getElementById("quiz-question-box");
const quizItemsGrid = document.getElementById("quiz-items-grid");
const quizOptionsGrid = document.getElementById("quiz-options-grid");
const quizFeedbackBox = document.getElementById("quiz-feedback-box");
const quizFooterBtn = document.getElementById("quiz-footer-btn");
const quizNavHint = document.getElementById("quiz-nav-hint");

let quizSelectedIndex = 0;

function updateQuizFocusVisuals() {
  const optBtns = quizOptionsGrid ? quizOptionsGrid.querySelectorAll(".quiz-opt-btn") : [];
  if (!optBtns.length) return;

  if (quizSelectedIndex < 0) quizSelectedIndex = optBtns.length - 1;
  if (quizSelectedIndex >= optBtns.length) quizSelectedIndex = 0;

  optBtns.forEach((b, idx) => {
    if (idx === quizSelectedIndex && !isAnswerLocked) {
      b.classList.add("keyboard-focused");
    } else {
      b.classList.remove("keyboard-focused");
    }
  });
}

function openUniversalQuizModal(category = "canteen") {
  GameState.isModalActive = true;
  currentQuizCategory = category;
  quizIndex = 0;
  quizScore = 0;
  isAnswerLocked = false;
  quizSelectedIndex = 0;

  if (category === "mini_quiz") {
    quizQuestions = generateMiniQuizUstaz();
  } else if (category === "canteen") {
    quizQuestions = generateCanteenFoodQuestions();
  } else if (category === "field") {
    quizQuestions = generateFieldSportsQuestions();
  } else if (category === "final_exam") {
    quizQuestions = generateFinalExamQuestions();
  }

  quizModal.classList.add("active");
  renderQuizQuestion();
}

function renderQuizQuestion() {
  const q = quizQuestions[quizIndex];
  isAnswerLocked = false;
  quizSelectedIndex = 0;

  // Tag & Tajuk Header Mengikut Kategori
  if (currentQuizCategory === "mini_quiz") {
    quizModalTitle.innerText = "📝 Mini Kuiz Ustaz Alif: Angka Arab";
    quizStepPill.innerText = `Soalan ${quizIndex + 1} / 3 (Skor: ${quizScore}/3)`;
    quizBadgeTag.style.display = "inline-flex";
    quizBadgeIcon.innerText = "⭐";
    quizBadgeLabel.innerText = "Wajib Skor Penuh 3/3";
  } else if (currentQuizCategory === "canteen") {
    quizModalTitle.innerText = "🥟 Side Quest Kantin: Misi Pesanan Makanan";
    quizStepPill.innerText = `Soalan ${quizIndex + 1} / 5 (Markah: ${quizScore}/5)`;
    quizBadgeTag.style.display = "inline-flex";
    quizBadgeIcon.innerText = "🥟";
    quizBadgeLabel.innerText = "Lencana Pembantu Kantin";
  } else if (currentQuizCategory === "field") {
    quizModalTitle.innerText = "⚽ Side Quest Padang: Misi Peralatan Sukan";
    quizStepPill.innerText = `Soalan ${quizIndex + 1} / 5 (Markah: ${quizScore}/5)`;
    quizBadgeTag.style.display = "inline-flex";
    quizBadgeIcon.innerText = "⚽";
    quizBadgeLabel.innerText = "Lencana Wira Padang";
  } else if (currentQuizCategory === "final_exam") {
    quizModalTitle.innerText = "📝 Ujian Akhir Bahasa Arab (Ustaz Alif)";
    quizStepPill.innerText = `Soalan ${quizIndex + 1} / 10 (Markah: ${quizScore}/10)`;
    quizBadgeTag.style.display = "inline-flex";
    quizBadgeIcon.innerText = "🏅";
    quizBadgeLabel.innerText = "Lencana Pelajar Cemerlang";
  }

  quizQuestionBox.innerText = q.question;
  quizFeedbackBox.style.display = "none";
  quizFooterBtn.style.display = "none";
  quizOptionsGrid.innerHTML = "";

  if (quizNavHint) {
    quizNavHint.style.display = "flex";
    quizNavHint.innerHTML = "⌨️ Pilih jawapan: <kbd>A</kbd> <kbd>D</kbd> atau <kbd>◀</kbd> <kbd>▶</kbd> &nbsp;•&nbsp; Sahkan: <kbd class='kbd-gold'>Enter / E</kbd>";
  }

  // Paparan Grid Item Bergambar (Makanan / Sukan)
  if (q.count && q.itemEmoji) {
    quizItemsGrid.style.display = "flex";
    quizItemsGrid.innerHTML = "";
    for (let i = 0; i < q.count; i++) {
      quizItemsGrid.innerHTML += `
        <div class="quiz-item-badge" style="animation-delay:${i * 0.05}s">
          ${q.itemEmoji}
        </div>
      `;
    }
  } else {
    quizItemsGrid.style.display = "none";
  }

  // Butang Pilihan Jawapan
  q.options.forEach((opt, idx) => {
    const btn = document.createElement("button");
    const isArabic = q.isArabicChoices || q.isArabicWordsChoices || opt.length <= 2;
    btn.className = `quiz-opt-btn ${isArabic ? "arabic-text" : ""}`;
    btn.textContent = opt;

    // Hover tetikus juga mengemas kini kursor fokus
    btn.onmouseenter = () => {
      if (!isAnswerLocked) {
        quizSelectedIndex = idx;
        updateQuizFocusVisuals();
      }
    };

    btn.onclick = () => handleQuizChoice(opt, btn, q);
    quizOptionsGrid.appendChild(btn);
  });

  updateQuizFocusVisuals();
}

function handleQuizChoice(choice, btn, q) {
  if (isAnswerLocked) return;
  isAnswerLocked = true;

  const optBtns = quizOptionsGrid.querySelectorAll(".quiz-opt-btn");
  optBtns.forEach((b) => {
    b.classList.remove("keyboard-focused");
    b.disabled = true;
  }); // Kunci serta-merta

  const isCorrect = choice === q.correctAnswer;

  if (isCorrect) {
    Sound.playCorrect();
    btn.classList.add("correct");
    quizScore++;

    quizFeedbackBox.className = "quiz-feedback-box correct";
    quizFeedbackBox.innerHTML = `<strong>✓ TEPAT SEKALI!</strong> ${q.explanation || ""}`;
  } else {
    Sound.playWrong();
    btn.classList.add("wrong");

    // Serlahkan jawapan betul
    optBtns.forEach((b) => {
      if (b.textContent === q.correctAnswer) {
        b.classList.add("correct");
      }
    });

    quizFeedbackBox.className = "quiz-feedback-box wrong";
    quizFeedbackBox.innerHTML = `<strong>💡 Jawapan Tepat: ${q.correctAnswer}</strong>. ${q.explanation || ""}`;
  }

  quizFeedbackBox.style.display = "block";
  quizFooterBtn.style.display = "block";

  if (quizNavHint) {
    quizNavHint.innerHTML = "⌨️ Tekan <kbd class='kbd-gold'>[Enter / E]</kbd> untuk soalan seterusnya ➔";
  }

  const totalQuestions = quizQuestions.length;
  quizFooterBtn.innerText = quizIndex < totalQuestions - 1 ? "Soalan Seterusnya →" : "Tamatkan Soalan →";
}

quizFooterBtn.onclick = () => {
  const totalQuestions = quizQuestions.length;

  if (quizIndex < totalQuestions - 1) {
    quizIndex++;
    renderQuizQuestion();
  } else {
    // TAMAT KUIZ / UJIAN
    quizModal.classList.remove("active");
    GameState.isModalActive = false;

    if (currentQuizCategory === "mini_quiz") {
      // Syarat Mini Kuiz Ustaz: WAJIB dapat 3/3 sebelum Pelajaran A disahkan selesai
      gameStorage.recordUstazMiniQuiz(quizScore);
      sheetsSync.sync();
      updateHUDProgress();

      if (quizScore === 3) {
        showToast("Mumtaz! Kamu dapat 3/3 markah penuh dalam Mini Kuiz!");
        openVNDialogue({
          id: "ustaz_quiz_passed",
          name: "Ustaz Alif",
          role: "Guru Bahasa Arab",
          charType: "teacher_ustaz",
          dialogue: [
            `Mumtaz! Tahniah, ${getPlayerName()} berjaya dapat 3/3!`,
            `Kamu telah membuktikan kefahaman bagi angka Arab 1 hingga 10 (Pelajaran A).`,
            `Sekarang, sila berjumpa Hana di meja hadapan kiri untuk mempelajari sebutan perkataan nombor Bahasa Arab (Pelajaran B).`
          ]
        });
      } else {
        showToast(`Markah anda ${quizScore}/3. Sila cuba lagi untuk dapatkan 3/3.`);
        openVNDialogue({
          id: "ustaz_quiz_retry",
          name: "Ustaz Alif",
          role: "Guru Bahasa Arab",
          charType: "teacher_ustaz",
          dialogue: [
            `Usaha yang baik, ${getPlayerName()}! Kamu mendapat markah ${quizScore}/3. Untuk menguasai Pelajaran A, kamu perlu dapatkan markah penuh 3/3. Mari kita cuba sekali lagi!`
          ]
        });
      }

    } else if (currentQuizCategory === "canteen") {
      gameStorage.recordCanteenQuiz(quizScore);
      sheetsSync.sync();
      updateHUDProgress();
      showToast(`Tahniah! Side Quest Kantin selesai: Markah ${quizScore}/5! Lencana diraih!`);
      checkSideQuestsCompletion();

    } else if (currentQuizCategory === "field") {
      gameStorage.recordFieldQuiz(quizScore);
      sheetsSync.sync();
      updateHUDProgress();
      showToast(`Tahniah! Side Quest Padang selesai: Markah ${quizScore}/5! Lencana diraih!`);
      checkSideQuestsCompletion();

    } else if (currentQuizCategory === "final_exam") {
      gameStorage.recordFinalExam(quizScore);
      sheetsSync.sync();
      updateHUDProgress();
      showToast(`Alhamdulillah! Ujian Akhir selesai dengan markah ${quizScore}/10!`);
      setTimeout(() => openVictoryModal(), 500);
    }
  }
};

function checkSideQuestsCompletion() {
  const session = gameStorage.session;
  if (session.canteenCompleted && session.fieldCompleted && !session.finalExamCompleted) {
    setTimeout(() => {
      openMissionCompleteModal();
    }, 600);
  }
}

// ==========================================================================
// 15. POPUP BANNER: SEMUA MISI SELESAI & GRAND VICTORY MODAL
// ==========================================================================
const missionCompleteModal = document.getElementById("mission-complete-modal");
const btnReturnClass = document.getElementById("btn-return-class");

function openMissionCompleteModal() {
  GameState.isModalActive = true;
  Sound.playFanfare();
  missionCompleteModal.classList.add("active");
}

btnReturnClass.onclick = () => {
  missionCompleteModal.classList.remove("active");
  GameState.isModalActive = false;
  // Bawa pemain terus kembali ke kelas 1 Gamma di hadapan Ustaz Alif
  warpToRoom("classroom", new THREE.Vector3(0, 1.4, -4.0));
  setTimeout(() => {
    openVNDialogue({
      id: "ustaz_exam_ready",
      name: "Ustaz Alif",
      role: "Guru Bahasa Arab",
      charType: "teacher_ustaz",
      dialogue: [
        `Selamat kembali ke Kelas 1 Gamma, ${getPlayerName()}!`,
        `Ustaz dengar Makcik Kantin dan Cikgu Amir sangat gembira dengan bantuan kamu!`,
        `Kini tiba masa untuk UJIAN AKHIR BAHASA ARAB (10 Soalan). Bersedia untuk buktikan kejayaan kamu?`
      ]
    });
  }, 700);
};

// Grand Victory Modal
const victoryModal = document.getElementById("victory-modal");
const victoryPlayerSprite = document.getElementById("victory-player-sprite");

function openVictoryModal() {
  const session = gameStorage.session;
  GameState.isModalActive = true;
  Sound.playFanfare();

  const sName = unescapeStudentName(session.studentName) || "Murid 1 Gamma";
  document.getElementById("victory-student-title").innerText = `TAHNIAH, ${sName}!`;
  document.getElementById("v-table-name").innerText = sName;
  document.getElementById("v-table-gender").innerText = session.characterGender === "female" ? "Perempuan (Bertudung) 👧" : "Lelaki 👦";
  document.getElementById("v-table-canteen").innerText = `${session.canteenScore} / 5 (PEMBANTU KANTIN)`;
  document.getElementById("v-table-field").innerText = `${session.fieldScore} / 5 (WIRA PADANG)`;
  document.getElementById("v-table-exam").innerText = `${session.finalExamScore} / 10 ⭐`;

  // Maklum Balas Berdasarkan Markah Ujian Akhir
  const score = session.finalExamScore;
  let feedbackMsg = "";
  if (score === 10) {
    feedbackMsg = "🌟 MUMTAZ! Penguasaan nombor Bahasa Arab kamu sempurna dan cemerlang!";
  } else if (score >= 8) {
    feedbackMsg = "🎉 SYABAS! Keputusan kamu sangat membanggakan seluruh kelas 1 Gamma!";
  } else if (score >= 5) {
    feedbackMsg = "👍 BAGUS! Kamu telah berusaha dengan gigih dan menguasai asas nombor Arab!";
  } else {
    feedbackMsg = "💪 USAHA YANG BAIK! Teruskan mengulang kaji bersama Ustaz Alif dan Hana ya!";
  }
  document.getElementById("victory-encourage-msg").innerText = feedbackMsg;

  // Lukis Chibi Sprite Pemain pada Canvas
  if (victoryPlayerSprite) {
    const vctx = victoryPlayerSprite.getContext("2d");
    vctx.clearRect(0, 0, 48, 48);
    const spriteKey = session.characterGender === "female" ? "player_female" : "player_male";
    vctx.drawImage(generateChibiCanvas(spriteKey, "down", 1), 0, 0);
  }

  const syncInfo = sheetsSync.getStatusLabel();
  document.getElementById("victory-sync-text").innerText = syncInfo.text;

  victoryModal.classList.add("active");
}

const btnVicExitToMenu = document.getElementById("btn-vic-exit-to-menu");
if (btnVicExitToMenu) {
  btnVicExitToMenu.onclick = () => {
    Sound.playInteract();
    victoryModal.classList.remove("active");
    GameState.isModalActive = false;

    // Kembali ke posisi mula di bilik kelas
    warpToRoom("classroom", new THREE.Vector3(0, 1.4, 4));

    // Paparkan kembali menu awal pemilihan karakter dan nama
    const introModal = document.getElementById("intro-modal");
    if (introModal) {
      introModal.style.display = "flex";
      setupIntroModal();
    }
  };
}

const btnHudVictory = document.getElementById("btn-hud-victory");
btnHudVictory.onclick = () => openVictoryModal();

// ==========================================================================
// 17. HUD, TOAST & NOTIFIKASI
// ==========================================================================
function showToast(msg) {
  const toast = document.getElementById("toast-msg");
  toast.innerText = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3200);
}

function updateHUDProgress() {
  const s = gameStorage.session;
  const isFemale = s.characterGender === "female";

  const studentPill = document.getElementById("hud-student-pill");
  studentPill.innerText = `${isFemale ? "👧" : "👦"} ${unescapeStudentName(s.studentName) || "Murid"}`;

  // Pill Modul
  const lPill = document.getElementById("quest-badge-learning");
  if (s.ustazModuleDone && s.ustazMiniQuizDone && s.hanaModuleDone) {
    lPill.className = "quest-pill completed";
    lPill.innerText = "📖 Belajar ✓";
  } else if (s.ustazModuleDone && s.ustazMiniQuizDone) {
    lPill.className = "quest-pill";
    lPill.innerText = "📖 Pelajaran B ⏳";
  } else {
    lPill.className = "quest-pill";
    lPill.innerText = "📖 Pelajaran A ⏳";
  }

  // Pill Kantin
  const cPill = document.getElementById("quest-badge-canteen");
  if (s.canteenCompleted) {
    cPill.className = "quest-pill completed";
    cPill.innerText = `🥟 Kantin: ${s.canteenScore}/5 ✓`;
  } else {
    cPill.className = "quest-pill";
    cPill.innerText = "🥟 Kantin ⏳";
  }

  // Pill Padang
  const fPill = document.getElementById("quest-badge-field");
  if (s.fieldCompleted) {
    fPill.className = "quest-pill completed";
    fPill.innerText = `⚽ Padang: ${s.fieldScore}/5 ✓`;
  } else {
    fPill.className = "quest-pill";
    fPill.innerText = "⚽ Padang ⏳";
  }

  // Pill Ujian Akhir
  const ePill = document.getElementById("quest-badge-exam");
  if (ePill) {
    if (s.finalExamCompleted) {
      ePill.className = "quest-pill completed";
      ePill.innerText = `📝 Ujian: ${s.finalExamScore}/10 ✓`;
    } else if (s.canteenCompleted && s.fieldCompleted) {
      ePill.className = "quest-pill";
      ePill.style.border = "1.5px solid #fbbf24";
      ePill.innerText = "📝 Ujian Terbuka ⭐";
    } else {
      ePill.className = "quest-pill";
      ePill.innerText = "📝 Ujian ⏳";
    }
  }

  // Butang HUD Kemenangan
  if (s.finalExamCompleted) {
    btnHudVictory.style.display = "flex";
  } else {
    btnHudVictory.style.display = "none";
  }

  // Status Google Sheets
  const syncBtn = document.getElementById("btn-sync-status");
  if (syncBtn) {
    const info = sheetsSync.getStatusLabel();
    syncBtn.innerText = `${info.icon} ${info.text.split("(")[0].trim()}`;
  }
}

const syncStatusEl = document.getElementById("btn-sync-status");
if (syncStatusEl) {
  syncStatusEl.onclick = () => {
    sheetsSync.sync();
  };
}

sheetsSync.onStatusChange(() => {
  updateHUDProgress();
});

const btnToggleSound = document.getElementById("btn-toggle-sound");
if (btnToggleSound) {
  btnToggleSound.onclick = () => {
    const on = Sound.toggle();
    btnToggleSound.innerText = on ? "🔊 Bunyi" : "🔇 Senyap";
    showToast(on ? "Kesan bunyi diaktifkan" : "Kesan bunyi disenyapkan");
  };
}

const btnToggleTouch = document.getElementById("btn-toggle-touch");
if (btnToggleTouch) {
  btnToggleTouch.onclick = () => {
    const tc = document.getElementById("touch-controls");
    const isHidden = tc.classList.toggle("hidden");
    showToast(!isHidden ? "Kawalan sentuh dipaparkan" : "Kawalan sentuh disembunyikan");
  };
}

// Pengesanan orientasi landskap pada telefon / tablet
function checkOrientation() {
  const overlay = document.getElementById("landscape-warning-overlay");
  if (!overlay) return;
  const isMobileOrTablet = window.innerWidth <= 1024 || window.innerHeight <= 1024;
  const isPortrait = window.innerHeight > window.innerWidth;
  if (isMobileOrTablet && isPortrait) {
    overlay.style.display = "flex";
  } else {
    overlay.style.display = "none";
  }
}
window.addEventListener("resize", checkOrientation);
window.addEventListener("orientationchange", checkOrientation);
checkOrientation();

// ==========================================================================
// 18. SKRIN PEMILIHAN NAMA & JANTINA (INTRO MODAL)
// ==========================================================================
function setupIntroModal() {
  const introModal = document.getElementById("intro-modal");
  const inputName = document.getElementById("input-student-name");
  const cardMale = document.getElementById("card-gender-male");
  const cardFemale = document.getElementById("card-gender-female");
  const btnStart = document.getElementById("btn-start-game");
  const nameError = document.getElementById("name-error-text");

  // Lukis pratonton avatar pada kad pilihan jantina
  const canvasM = document.getElementById("canvas-preview-male");
  const ctxM = canvasM.getContext("2d");
  ctxM.drawImage(generateChibiCanvas("player_male", "down", 1), 0, 0);

  const canvasF = document.getElementById("canvas-preview-female");
  const ctxF = canvasF.getContext("2d");
  ctxF.drawImage(generateChibiCanvas("player_female", "down", 1), 0, 0);

  let selectedGender = "male";

  cardMale.onclick = () => {
    selectedGender = "male";
    cardMale.classList.add("active");
    cardFemale.classList.remove("active");
    Sound.playTextAdvance();
  };

  cardFemale.onclick = () => {
    selectedGender = "female";
    cardFemale.classList.add("active");
    cardMale.classList.remove("active");
    Sound.playTextAdvance();
  };

  // Semak jika ada nama tersimpan sebelumnya untuk kemudahan
  const saved = gameStorage.session;
  if (saved && saved.studentName) {
    inputName.value = unescapeStudentName(saved.studentName);
    selectedGender = saved.characterGender || "male";
    if (selectedGender === "female") {
      cardFemale.classList.add("active");
      cardMale.classList.remove("active");
    }
  }

  btnStart.onclick = () => {
    const rawName = inputName.value.trim();
    if (!rawName) {
      nameError.innerText = "Sila tulis nama kamu terlebih dahulu.";
      inputName.focus();
      return;
    }
    nameError.innerText = "";
    Sound.playInteract();
    launchAdventure(rawName, selectedGender, false);
  };

  inputName.onkeydown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      btnStart.click();
    }
  };

  function launchAdventure(name, gender, isResume) {
    if (!isResume) {
      gameStorage.startNewSession(name, gender);
    }
    GameState.studentName = name;
    GameState.gender = gender;
    player.updateTexture();

    // Bina semula adegan kelas agar semua NPC memuatkan nama murid yang dipilih
    buildClassroomScene();

    introModal.style.display = "none";
    updateHUDProgress();
    showToast(`Selamat datang ke Kelas 1 Gamma, ${name}!`);

    // Hantar data sesi serta-merta ke Google Sheets agar guru dapat jejak murid yang mula bermain
    sheetsSync.sync();
  }
}

// ==========================================================================
// 19. MAIN GAME LOOP & BOOTSTRAP
// ==========================================================================
const clock = new THREE.Clock();
let frameCount = 0;
let fpsTimer = 0;
let currentFps = 60;

function animate() {
  requestAnimationFrame(animate);

  const delta = Math.min(clock.getDelta(), 0.1);

  frameCount++;
  fpsTimer += delta;
  if (fpsTimer >= 1.0) {
    currentFps = frameCount;
    frameCount = 0;
    fpsTimer = 0;
  }

  player.update(delta);
  for (const npc of activeNPCs) {
    npc.update();
  }

  const targetPos = new THREE.Vector3(player.position.x, 1.2, player.position.z);
  cameraTarget.lerp(targetPos, 0.08);

  const camDist = 16.5;
  const camHeight = 14.8;
  const camX = cameraTarget.x + Math.sin(camAngleY) * camDist;
  const camZ = cameraTarget.z + Math.cos(camAngleY) * camDist;
  const camY = cameraTarget.y + camHeight;

  camera.position.lerp(new THREE.Vector3(camX, camY, camZ), 0.08);
  camera.lookAt(cameraTarget);

  updateFloatingIndicator();

  if (GameState.debugMode) {
    document.getElementById("dbg-room").innerText = GameState.currentRoom;
    document.getElementById("dbg-pos").innerText = `${player.position.x.toFixed(2)}, ${player.position.y.toFixed(2)}, ${player.position.z.toFixed(2)}`;
    document.getElementById("dbg-facing").innerText = player.facing;
    document.getElementById("dbg-gender").innerText = GameState.gender === "female" ? "Perempuan (Bertudung)" : "Lelaki";
    document.getElementById("dbg-fps").innerText = currentFps;
  }

  renderer.render(scene, camera);
}

// Mulakan Permainan
window.addEventListener("DOMContentLoaded", () => {
  buildClassroomScene();
  setupIntroModal();
  updateHUDProgress();
  animate();
});
