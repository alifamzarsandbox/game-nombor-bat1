/**
 * Sistem Pengurusan Simpanan Kemajuan (LocalStorage)
 * Mengendalikan sesi permainan murid, jantina karakter (lelaki / perempuan bertudung),
 * modul pembelajaran Ustaz Alif & Hana, Mini Kuiz, Side Quest Kantin/Padang, dan Ujian Akhir.
 */

import { GAME_CONFIG } from "../config.js";

const KEYS = GAME_CONFIG.storageKeys;

/**
 * Jana Session ID unik berasaskan timestamp dan rentetan rawak
 */
export function generateSessionId() {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 8);
  return `MNA-${timestamp}-${randomPart}`.toUpperCase();
}

/**
 * Sanitasi nama murid untuk mengelakkan XSS dan hadkan kepada 60 aksara
 */
export function sanitizeStudentName(input) {
  if (!input || typeof input !== "string") return "";
  let clean = input.trim();
  if (clean.length > 60) {
    clean = clean.substring(0, 60);
  }
  clean = clean
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
  return clean;
}

export function unescapeStudentName(escaped) {
  if (!escaped) return "";
  return escaped
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");
}

export class GameStorage {
  constructor() {
    this.session = this.load();
  }

  load() {
    try {
      const sessionId = localStorage.getItem(KEYS.sessionId) || "";
      const studentName = localStorage.getItem(KEYS.studentName) || "";
      const characterGender = localStorage.getItem(KEYS.characterGender) || "male"; // "male" atau "female"
      const startTime = localStorage.getItem(KEYS.startTime) || "";

      // Modul & Kuiz Ustaz Alif & Hana
      const ustazModuleDone = localStorage.getItem(KEYS.ustazModuleDone) === "true" ||
                              localStorage.getItem(KEYS.module1Completed) === "true";
      const ustazMiniQuizDone = localStorage.getItem(KEYS.ustazMiniQuizDone) === "true";
      const ustazMiniQuizScore = parseInt(localStorage.getItem(KEYS.ustazMiniQuizScore) || "0", 10);

      const hanaModuleDone = localStorage.getItem(KEYS.hanaModuleDone) === "true" ||
                             localStorage.getItem(KEYS.module2Completed) === "true";

      // Side Quests
      const canteenCompleted = localStorage.getItem(KEYS.canteenCompleted) === "true";
      const canteenScore = parseInt(localStorage.getItem(KEYS.canteenScore) || "0", 10);
      const fieldCompleted = localStorage.getItem(KEYS.fieldCompleted) === "true";
      const fieldScore = parseInt(localStorage.getItem(KEYS.fieldScore) || "0", 10);

      // Ujian Akhir (10 soalan)
      const finalExamCompleted = localStorage.getItem(KEYS.finalExamCompleted) === "true";
      const finalExamScore = parseInt(localStorage.getItem(KEYS.finalExamScore) || "0", 10);

      // Syarat sah gameCompleted: Ujian Akhir telah selesai diduduki
      const gameCompleted = finalExamCompleted || (localStorage.getItem(KEYS.gameCompleted) === "true");

      const syncStatus = localStorage.getItem(KEYS.syncStatus) || "not_synced";
      const lastUpdated = localStorage.getItem(KEYS.lastUpdated) || "";

      return {
        sessionId,
        studentName,
        characterGender: characterGender === "female" ? "female" : "male",
        startTime,
        ustazModuleDone,
        ustazMiniQuizDone,
        ustazMiniQuizScore: isNaN(ustazMiniQuizScore) ? 0 : Math.max(0, Math.min(3, ustazMiniQuizScore)),
        hanaModuleDone,
        module1Completed: ustazModuleDone && ustazMiniQuizDone,
        module2Completed: hanaModuleDone,
        canteenCompleted,
        canteenScore: isNaN(canteenScore) ? 0 : Math.max(0, Math.min(5, canteenScore)),
        fieldCompleted,
        fieldScore: isNaN(fieldScore) ? 0 : Math.max(0, Math.min(5, fieldScore)),
        finalExamCompleted,
        finalExamScore: isNaN(finalExamScore) ? 0 : Math.max(0, Math.min(10, finalExamScore)),
        gameCompleted,
        syncStatus,
        lastUpdated
      };
    } catch (e) {
      console.warn("Gagal memuat turun dari localStorage:", e);
      return this.getDefaultState();
    }
  }

  getDefaultState() {
    return {
      sessionId: "",
      studentName: "",
      characterGender: "male",
      startTime: "",
      ustazModuleDone: false,
      ustazMiniQuizDone: false,
      ustazMiniQuizScore: 0,
      hanaModuleDone: false,
      module1Completed: false,
      module2Completed: false,
      canteenCompleted: false,
      canteenScore: 0,
      fieldCompleted: false,
      fieldScore: 0,
      finalExamCompleted: false,
      finalExamScore: 0,
      gameCompleted: false,
      syncStatus: "not_synced",
      lastUpdated: ""
    };
  }

  /**
   * Mulakan sesi murid baharu dengan pilihan jantina (Lelaki / Perempuan bertudung)
   */
  startNewSession(studentName, gender = "male") {
    const cleanName = sanitizeStudentName(studentName);
    const newSessionId = generateSessionId();
    const cleanGender = gender === "female" ? "female" : "male";
    const nowIso = new Date().toISOString();

    this.session = {
      sessionId: newSessionId,
      studentName: cleanName,
      characterGender: cleanGender,
      startTime: nowIso,
      ustazModuleDone: false,
      ustazMiniQuizDone: false,
      ustazMiniQuizScore: 0,
      hanaModuleDone: false,
      module1Completed: false,
      module2Completed: false,
      canteenCompleted: false,
      canteenScore: 0,
      fieldCompleted: false,
      fieldScore: 0,
      finalExamCompleted: false,
      finalExamScore: 0,
      gameCompleted: false,
      syncStatus: "pending",
      lastUpdated: nowIso
    };

    this.persist();
    return this.session;
  }

  setStudentName(name) {
    this.session.studentName = sanitizeStudentName(name);
    if (!this.session.sessionId) {
      this.session.sessionId = generateSessionId();
      this.session.startTime = new Date().toISOString();
    }
    this.persist();
  }

  setGender(gender) {
    this.session.characterGender = gender === "female" ? "female" : "male";
    this.persist();
  }

  completeUstazModule() {
    this.session.ustazModuleDone = true;
    this.session.lastUpdated = new Date().toISOString();
    this.persist();
  }

  recordUstazMiniQuiz(score) {
    const valid = Math.max(0, Math.min(3, Math.floor(score)));
    this.session.ustazMiniQuizScore = valid;
    if (valid === 3) {
      this.session.ustazMiniQuizDone = true;
      this.session.module1Completed = true;
    }
    this.session.lastUpdated = new Date().toISOString();
    this.persist();
    return this.session;
  }

  completeHanaModule() {
    this.session.hanaModuleDone = true;
    this.session.module2Completed = true;
    this.session.lastUpdated = new Date().toISOString();
    this.persist();
  }

  recordCanteenQuiz(score) {
    const validScore = Math.max(0, Math.min(5, Math.floor(score)));
    this.session.canteenCompleted = true;
    if (validScore > this.session.canteenScore) {
      this.session.canteenScore = validScore;
    }
    this.session.syncStatus = "pending";
    this.session.lastUpdated = new Date().toISOString();
    this.persist();
    return this.session;
  }

  recordFieldQuiz(score) {
    const validScore = Math.max(0, Math.min(5, Math.floor(score)));
    this.session.fieldCompleted = true;
    if (validScore > this.session.fieldScore) {
      this.session.fieldScore = validScore;
    }
    this.session.syncStatus = "pending";
    this.session.lastUpdated = new Date().toISOString();
    this.persist();
    return this.session;
  }

  recordFinalExam(score) {
    const validScore = Math.max(0, Math.min(10, Math.floor(score)));
    this.session.finalExamCompleted = true;
    if (validScore > this.session.finalExamScore) {
      this.session.finalExamScore = validScore;
    }
    this.session.gameCompleted = true;
    this.session.syncStatus = "pending";
    this.session.lastUpdated = new Date().toISOString();
    this.persist();
    return this.session;
  }

  isClassroomCleared() {
    return this.session.ustazModuleDone &&
           this.session.ustazMiniQuizDone &&
           this.session.hanaModuleDone;
  }

  areSideQuestsCleared() {
    return this.session.canteenCompleted && this.session.fieldCompleted;
  }

  isGameCompleted() {
    return this.session.finalExamCompleted === true;
  }

  setSyncStatus(status) {
    this.session.syncStatus = status;
    try {
      localStorage.setItem(KEYS.syncStatus, status);
    } catch (e) {}
  }

  persist() {
    try {
      localStorage.setItem(KEYS.sessionId, this.session.sessionId);
      localStorage.setItem(KEYS.studentName, this.session.studentName);
      localStorage.setItem(KEYS.characterGender, this.session.characterGender);
      localStorage.setItem(KEYS.startTime, this.session.startTime || "");
      localStorage.setItem(KEYS.ustazModuleDone, this.session.ustazModuleDone ? "true" : "false");
      localStorage.setItem(KEYS.ustazMiniQuizDone, this.session.ustazMiniQuizDone ? "true" : "false");
      localStorage.setItem(KEYS.ustazMiniQuizScore, (this.session.ustazMiniQuizScore || 0).toString());
      localStorage.setItem(KEYS.hanaModuleDone, this.session.hanaModuleDone ? "true" : "false");
      localStorage.setItem(KEYS.module1Completed, (this.session.ustazModuleDone && this.session.ustazMiniQuizDone) ? "true" : "false");
      localStorage.setItem(KEYS.module2Completed, this.session.hanaModuleDone ? "true" : "false");
      localStorage.setItem(KEYS.canteenCompleted, this.session.canteenCompleted ? "true" : "false");
      localStorage.setItem(KEYS.canteenScore, (this.session.canteenScore || 0).toString());
      localStorage.setItem(KEYS.fieldCompleted, this.session.fieldCompleted ? "true" : "false");
      localStorage.setItem(KEYS.fieldScore, (this.session.fieldScore || 0).toString());
      localStorage.setItem(KEYS.finalExamCompleted, this.session.finalExamCompleted ? "true" : "false");
      localStorage.setItem(KEYS.finalExamScore, (this.session.finalExamScore || 0).toString());
      localStorage.setItem(KEYS.gameCompleted, this.session.gameCompleted ? "true" : "false");
      localStorage.setItem(KEYS.syncStatus, this.session.syncStatus);
      localStorage.setItem(KEYS.lastUpdated, this.session.lastUpdated);
    } catch (e) {
      console.warn("Gagal persist ke localStorage:", e);
    }
  }

  resetSession() {
    try {
      Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
    } catch (e) {}
    this.session = this.getDefaultState();
  }

  getTotalScore() {
    return this.session.finalExamScore || 0;
  }

  getSideQuestTotal() {
    return (this.session.canteenScore || 0) + (this.session.fieldScore || 0);
  }
}

export const gameStorage = new GameStorage();
