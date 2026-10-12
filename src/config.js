/**
 * MISI NOMBOR ARAB: KELAS 1 GAMMA
 * Konfigurasi Utama Permainan (HD-2D Three.js Edition)
 */

export const GAME_CONFIG = {
  // Maklumat asas sekolah & kelas
  className: "1 Gamma",
  teacherName: "Ustaz Alif",
  studentGuide: "Hana",
  peTeacher: "Cikgu Amir",
  canteenLady: "Makcik Kantin",
  gameName: "Misi Nombor Arab",
  gameSubtitle: "Pengembaraan Bahasa Arab Tahun 1",
  subject: "Bahasa Arab",
  version: "2.1.0",

  // URL Web App Google Apps Script
  // Guru perlu menampal URL Web App (berakhir dengan /exec) di sini selepas deployment.
  // Jika dibiarkan kosong, permainan tetap berfungsi sepenuhnya dalam mod tempatan (offline / LocalStorage).
  appsScriptUrl: "",

  // Kunci penyimpanan LocalStorage
  storageKeys: {
    sessionId: "mna_session_id",
    studentName: "mna_student_name",
    characterGender: "mna_character_gender", // "male" atau "female"
    startTime: "mna_start_time",
    ustazModuleDone: "mna_ustaz_mod_done",
    ustazMiniQuizDone: "mna_ustaz_mini_quiz_done",
    ustazMiniQuizScore: "mna_ustaz_mini_quiz_score",
    hanaModuleDone: "mna_hana_mod_done",
    module1Completed: "mna_mod1_completed", // backward compat
    module2Completed: "mna_mod2_completed", // backward compat
    canteenCompleted: "mna_canteen_completed",
    canteenScore: "mna_canteen_score",
    canteenAttempts: "mna_canteen_attempts",
    fieldCompleted: "mna_field_completed",
    fieldScore: "mna_field_score",
    fieldAttempts: "mna_field_attempts",
    finalExamCompleted: "mna_final_exam_completed",
    finalExamScore: "mna_final_exam_score",
    gameCompleted: "mna_game_completed",
    syncStatus: "mna_sync_status",
    lastUpdated: "mna_last_updated"
  }
};
