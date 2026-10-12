/**
 * Sistem Penyegerakan Google Sheets
 * Mengendalikan komunikasi penyelarasan keputusan dengan Google Apps Script Web App
 * Melindungi kemajuan murid dalam mod luar talian (offline resilience)
 */

import { GAME_CONFIG } from "../config.js";
import { gameStorage, unescapeStudentName } from "./storage.js";

export class SheetsSyncService {
  constructor() {
    this.isSyncing = false;
    this.lastSyncAttempt = null;
    this.listeners = [];
  }

  /**
   * Daftar pendengar peristiwa perubahan status penyegerakan
   */
  onStatusChange(callback) {
    if (typeof callback === "function") {
      this.listeners.push(callback);
    }
  }

  notify(status, details = {}) {
    this.listeners.forEach((cb) => {
      try {
        cb(status, details);
      } catch (err) {
        console.error("Ralat dalam pendengar status:", err);
      }
    });
  }

  /**
   * Semak sama ada URL Apps Script sah dan telah ditetapkan oleh guru
   */
  isConfigured() {
    const url = GAME_CONFIG.appsScriptUrl;
    return typeof url === "string" && url.trim().startsWith("https://script.google.com");
  }

  /**
   * Hantar data kemajuan terkini ke Google Sheets
   */
  async sync() {
    const session = gameStorage.session;

    if (!session || !session.studentName) {
      return { success: false, reason: "no_student", message: "Tiada data murid untuk dihantar." };
    }

    if (!this.isConfigured()) {
      gameStorage.setSyncStatus("offline_unconfigured");
      this.notify("offline_unconfigured", {
        message: "Disimpan dalam peranti (URL Apps Script belum ditetapkan)"
      });
      return {
        success: false,
        reason: "unconfigured",
        message: "Kemajuan disimpan setempat. URL Google Apps Script belum ditetapkan oleh guru."
      };
    }

    if (this.isSyncing) {
      return { success: false, reason: "busy", message: "Penyegerakan sedang berlangsung..." };
    }

    this.isSyncing = true;
    this.notify("syncing", { message: "Menghantar keputusan ke Google Sheets..." });

    const payload = {
      sessionId: session.sessionId,
      studentName: session.studentName,
      characterGender: session.characterGender || "male",
      className: GAME_CONFIG.className,
      ustazModuleDone: !!session.ustazModuleDone,
      ustazMiniQuizDone: !!session.ustazMiniQuizDone,
      hanaModuleDone: !!session.hanaModuleDone,
      canteenScore: session.canteenScore || 0,
      fieldScore: session.fieldScore || 0,
      finalExamScore: session.finalExamScore || 0,
      finalExamCompleted: !!session.finalExamCompleted,
      gameCompleted: !!session.gameCompleted,
      startTime: session.startTime || new Date().toISOString(),
      timestamp: new Date().toISOString()
    };

    try {
      // Guna POST dengan text/plain untuk mengelakkan CORS preflight blocker Google Apps Script
      const response = await fetch(GAME_CONFIG.appsScriptUrl, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(payload),
        cache: "no-cache"
      });

      if (!response.ok) {
        throw new Error(`Respons pelayan tidak berjaya: status ${response.status}`);
      }

      let resultData = null;
      try {
        resultData = await response.json();
      } catch (jsonErr) {}

      gameStorage.setSyncStatus("synced");
      this.notify("synced", {
        message: "Keputusan berjaya disegerakkan ke Google Sheets!",
        data: resultData
      });

      return {
        success: true,
        message: "Berjaya disegerakkan!",
        data: resultData
      };

    } catch (networkError) {
      console.warn("Ralat rangkaian ketika menyegerak Google Sheets:", networkError);

      gameStorage.setSyncStatus("pending_offline");
      this.notify("pending_offline", {
        message: "Internet terputus. Kemajuan disimpan pada peranti ini."
      });

      return {
        success: false,
        reason: "network_error",
        message: "Belum dapat disegerakkan. Kemajuan anda disimpan dengan selamat pada peranti ini."
      };
    } finally {
      this.isSyncing = false;
      this.lastSyncAttempt = Date.now();
    }
  }


  /**
   * Dapatkan label status Google Sheets
   */
  getStatusLabel() {
    const status = gameStorage.session.syncStatus;
    switch (status) {
      case "synced":
        return { text: "Disegerak ke Google Sheets", class: "status-synced", icon: "✓" };
      case "pending_offline":
        return { text: "Luar Talian (Disimpan pada peranti)", class: "status-pending", icon: "⏳" };
      case "offline_unconfigured":
        return { text: "Mod Tempatan (Disimpan pada peranti)", class: "status-local", icon: "💾" };
      case "syncing":
        return { text: "Menyimpan...", class: "status-syncing", icon: "🔄" };
      default:
        return { text: "Tersimpan pada peranti", class: "status-local", icon: "💾" };
    }
  }
}

export const sheetsSync = new SheetsSyncService();
