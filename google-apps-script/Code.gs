/**
 * =========================================================================
 * GOOGLE APPS SCRIPT BACKEND — MISI NOMBOR ARAB (KELAS 1 GAMMA)
 * =========================================================================
 *
 * Pangkalan Data: Google Sheets
 * Tab 1: RekodPermainan
 * Tab 2: Leaderboard
 * Guru: Ustaz Alif
 * Kelas: 1 Gamma
 */

const SHEET_REKOD = "RekodPermainan";
const SHEET_LEADERBOARD = "Leaderboard";
const EXPECTED_CLASS = "1 Gamma";

// Definisi Header Lajur Tab RekodPermainan (15 Lajur)
const HEADERS_REKOD = [
  "Timestamp Mula",                   // Kolum A (1)
  "Timestamp Tamat",                  // Kolum B (2)
  "Session ID",                       // Kolum C (3)
  "Nama Murid",                       // Kolum D (4)
  "Jantina Sprite",                   // Kolum E (5)
  "Kelas",                            // Kolum F (6)
  "Modul Ustaz Alif Selesai",         // Kolum G (7)
  "Mini Kuiz Ustaz Alif",             // Kolum H (8)
  "Modul Hana Selesai",               // Kolum I (9)
  "Markah Kantin /5",                 // Kolum J (10)
  "Markah Padang /5",                 // Kolum K (11)
  "Markah Ujian Akhir /10",           // Kolum L (12)
  "Jumlah Jawapan Betul Side Quest",  // Kolum M (13)
  "Game Completed",                   // Kolum N (14)
  "Status Penghantaran"               // Kolum O (15)
];

// Definisi Header Lajur Tab Leaderboard (5 Lajur)
const HEADERS_LEADERBOARD = [
  "Kedudukan",       // Kolum A (1)
  "Nama Murid",      // Kolum B (2)
  "Markah Ujian /10",// Kolum C (3)
  "Timestamp Tamat", // Kolum D (4)
  "Kelas"            // Kolum E (5)
];

/**
 * Fungsi Setup: Cipta dan format kedua-dua tab 'RekodPermainan' & 'Leaderboard'.
 */
function setupSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1. Setup Tab RekodPermainan
  let sheetRekod = ss.getSheetByName(SHEET_REKOD);
  if (!sheetRekod) {
    sheetRekod = ss.insertSheet(SHEET_REKOD);
  }
  const hRekodRange = sheetRekod.getRange(1, 1, 1, HEADERS_REKOD.length);
  hRekodRange.setValues([HEADERS_REKOD]);
  hRekodRange.setFontWeight("bold");
  hRekodRange.setFontColor("#FFFFFF");
  hRekodRange.setBackground("#064E3B"); // Tema Hijau Zamrud Sekolah
  hRekodRange.setHorizontalAlignment("center");
  sheetRekod.setFrozenRows(1);

  sheetRekod.setColumnWidth(1, 170); // Timestamp Mula
  sheetRekod.setColumnWidth(2, 170); // Timestamp Tamat
  sheetRekod.setColumnWidth(3, 160); // Session ID
  sheetRekod.setColumnWidth(4, 200); // Nama Murid
  sheetRekod.setColumnWidth(5, 140); // Jantina
  sheetRekod.setColumnWidth(6, 100); // Kelas
  sheetRekod.setColumnWidth(7, 180); // Modul Ustaz
  sheetRekod.setColumnWidth(8, 160); // Mini Kuiz Ustaz
  sheetRekod.setColumnWidth(9, 160); // Modul Hana
  sheetRekod.setColumnWidth(10, 140); // Markah Kantin
  sheetRekod.setColumnWidth(11, 140); // Markah Padang
  sheetRekod.setColumnWidth(12, 160); // Markah Ujian Akhir
  sheetRekod.setColumnWidth(13, 200); // Side Quest Total
  sheetRekod.setColumnWidth(14, 140); // Game Completed
  sheetRekod.setColumnWidth(15, 160); // Status Penghantaran

  // 2. Setup Tab Leaderboard
  let sheetLb = ss.getSheetByName(SHEET_LEADERBOARD);
  if (!sheetLb) {
    sheetLb = ss.insertSheet(SHEET_LEADERBOARD);
  }
  const hLbRange = sheetLb.getRange(1, 1, 1, HEADERS_LEADERBOARD.length);
  hLbRange.setValues([HEADERS_LEADERBOARD]);
  hLbRange.setFontWeight("bold");
  hLbRange.setFontColor("#0F172A");
  hLbRange.setBackground("#FBBF24"); // Tema Emas Kemenangan
  hLbRange.setHorizontalAlignment("center");
  sheetLb.setFrozenRows(1);

  sheetLb.setColumnWidth(1, 100); // Kedudukan
  sheetLb.setColumnWidth(2, 220); // Nama Murid
  sheetLb.setColumnWidth(3, 150); // Markah Ujian /10
  sheetLb.setColumnWidth(4, 180); // Timestamp Tamat
  sheetLb.setColumnWidth(5, 100); // Kelas

  Logger.log("Persediaan tab RekodPermainan & Leaderboard selesai!");
  return "Persediaan tab berjaya disempurnakan!";
}

/**
 * GET Endpoint: Healthcheck atau Ambil Senarai Top 10 Leaderboard
 */
function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) ? e.parameter.action.toString().toLowerCase() : "";

  if (action === "leaderboard") {
    try {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      let sheetLb = ss.getSheetByName(SHEET_LEADERBOARD);
      if (!sheetLb) {
        setupSheet();
        sheetLb = ss.getSheetByName(SHEET_LEADERBOARD);
      }

      const dataRange = sheetLb.getDataRange();
      const rows = dataRange.getValues();
      const leaderboardList = [];

      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (row[1] && row[1].toString().trim() !== "") {
          leaderboardList.push({
            rank: i,
            name: row[1].toString().trim(),
            score: parseInt(row[2], 10) || 0,
            completionTime: row[3] ? row[3].toString() : "-",
            className: row[4] ? row[4].toString() : EXPECTED_CLASS
          });
        }
      }

      return createJsonResponse(true, "Data leaderboard berjaya dimuat turun.", {
        leaderboard: leaderboardList.slice(0, 10)
      });
    } catch (err) {
      return createJsonResponse(false, "Ralat membaca leaderboard: " + err.toString());
    }
  }

  // Lalai: Healthcheck
  return createJsonResponse(true, "Misi Nombor Arab API aktif.", {
    service: "Misi Nombor Arab Backend",
    className: EXPECTED_CLASS,
    teacher: "Ustaz Alif",
    guide: "Hana",
    peTeacher: "Cikgu Amir",
    timestamp: new Date().toISOString()
  });
}

/**
 * POST Endpoint: Menerima kemajuan sesi dan markah Ujian Akhir murid
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  const hasLock = lock.tryLock(15000);

  if (!hasLock) {
    return createJsonResponse(false, "Pelayan sibuk, sila cuba sebentar lagi.");
  }

  try {
    if (!e || !e.postData || !e.postData.contents) {
      return createJsonResponse(false, "Tiada data diterima.");
    }

    let payload;
    try {
      payload = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      return createJsonResponse(false, "Format data JSON tidak sah.");
    }

    // 1. Pengesahan Nama & Kelas
    const rawName = (payload.studentName || "").toString().trim();
    if (!rawName) {
      return createJsonResponse(false, "Nama murid tidak boleh kosong.");
    }
    const studentName = rawName.substring(0, 60);

    const className = (payload.className || "").toString().trim();
    if (className !== EXPECTED_CLASS) {
      return createJsonResponse(false, "Kelas mestilah '1 Gamma'.");
    }

    const sessionId = (payload.sessionId || "").toString().trim();
    if (!sessionId) {
      return createJsonResponse(false, "Session ID diperlukan.");
    }

    // 2. Jantina Sprite
    const genderRaw = (payload.characterGender || "male").toString().toLowerCase();
    const characterGender = (genderRaw === "female" || genderRaw === "perempuan") ? "Perempuan (Bertudung)" : "Lelaki";

    // 3. Status Pembelajaran
    const ustazModDone = payload.ustazModuleDone === true || payload.ustazModuleDone === "true";
    const ustazMiniQuizDone = payload.ustazMiniQuizDone === true || payload.ustazMiniQuizDone === "true";
    const hanaModDone = payload.hanaModuleDone === true || payload.hanaModuleDone === "true";

    // 4. Markah Side Quest (0-5)
    let canteenScore = parseInt(payload.canteenScore, 10);
    if (isNaN(canteenScore) || canteenScore < 0) canteenScore = 0;
    if (canteenScore > 5) canteenScore = 5;

    let fieldScore = parseInt(payload.fieldScore, 10);
    if (isNaN(fieldScore) || fieldScore < 0) fieldScore = 0;
    if (fieldScore > 5) fieldScore = 5;

    const sideQuestTotal = canteenScore + fieldScore; // Max 10

    // 5. Markah Ujian Akhir (0-10)
    let finalExamScore = parseInt(payload.finalExamScore, 10);
    if (isNaN(finalExamScore) || finalExamScore < 0) finalExamScore = 0;
    if (finalExamScore > 10) finalExamScore = 10;

    const finalExamCompleted = payload.finalExamCompleted === true || payload.finalExamCompleted === "true";
    const gameCompleted = payload.gameCompleted === true || payload.gameCompleted === "true";

    // Timestamp
    const now = new Date();
    const formattedDate = Utilities.formatDate(now, Session.getScriptTimeZone() || "GMT+8", "yyyy-MM-dd HH:mm:ss");
    const startTime = payload.startTime ? payload.startTime.toString() : formattedDate;
    const completionTime = (gameCompleted || finalExamCompleted) ? formattedDate : "-";
    const deliveryStatus = (gameCompleted || finalExamCompleted) ? "SELESAI" : "SEDANG BERMAIN";

    // Akses Spreadsheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheetRekod = ss.getSheetByName(SHEET_REKOD);
    if (!sheetRekod) {
      setupSheet();
      sheetRekod = ss.getSheetByName(SHEET_REKOD);
    }

    // Cari rekod sedia ada berdasarkan Session ID (Kolum C / Indeks 2)
    const dataRange = sheetRekod.getDataRange();
    const values = dataRange.getValues();
    let existingRowIndex = -1;

    for (let i = 1; i < values.length; i++) {
      if (values[i][2] && values[i][2].toString().trim() === sessionId) {
        existingRowIndex = i + 1; // 1-indexed
        break;
      }
    }

    const rowData = [
      startTime,                                  // A: Timestamp Mula
      completionTime,                             // B: Timestamp Tamat
      sessionId,                                  // C: Session ID
      studentName,                                // D: Nama Murid
      characterGender,                            // E: Jantina Sprite
      EXPECTED_CLASS,                             // F: Kelas
      ustazModDone ? "YA" : "TIDAK",              // G: Modul Ustaz Alif
      ustazMiniQuizDone ? "YA (3/3)" : "TIDAK",   // H: Mini Kuiz Ustaz
      hanaModDone ? "YA" : "TIDAK",               // I: Modul Hana
      canteenScore,                               // J: Markah Kantin /5
      fieldScore,                                 // K: Markah Padang /5
      finalExamScore,                             // L: Markah Ujian Akhir /10
      sideQuestTotal,                             // M: Jumlah Side Quest
      gameCompleted ? "YA" : "TIDAK",             // N: Game Completed
      deliveryStatus                              // O: Status Penghantaran
    ];

    if (existingRowIndex > 0) {
      sheetRekod.getRange(existingRowIndex, 1, 1, rowData.length).setValues([rowData]);
    } else {
      sheetRekod.appendRow(rowData);
    }

    // 6. Kemas kini Tab Leaderboard jika Ujian Akhir selesai
    if (finalExamCompleted || gameCompleted) {
      updateLeaderboardTab(ss);
    }

    return createJsonResponse(true, "Keputusan sesi berjaya direkodkan.", {
      sessionId: sessionId,
      studentName: studentName,
      canteenScore: canteenScore,
      fieldScore: fieldScore,
      finalExamScore: finalExamScore,
      gameCompleted: gameCompleted,
      completionTime: completionTime
    });

  } catch (error) {
    Logger.log("Ralat doPost: " + error.toString());
    return createJsonResponse(false, "Ralat pelayan: " + error.toString());
  } finally {
    lock.releaseLock();
  }
}

/**
 * Kemas kini tab Leaderboard secara automatik berdasarkan rekod sah
 * Diisih mengikut Markah Ujian Akhir tertinggi, kemudian Timestamp Tamat
 */
function updateLeaderboardTab(ss) {
  try {
    let sheetRekod = ss.getSheetByName(SHEET_REKOD);
    let sheetLb = ss.getSheetByName(SHEET_LEADERBOARD);
    if (!sheetLb) {
      setupSheet();
      sheetLb = ss.getSheetByName(SHEET_LEADERBOARD);
    }

    const rValues = sheetRekod.getDataRange().getValues();
    const completedList = [];

    for (let i = 1; i < rValues.length; i++) {
      const row = rValues[i];
      const sName = row[3] ? row[3].toString().trim() : "";
      const examScore = parseInt(row[11], 10);
      const isDone = row[13] === "YA" || row[14] === "SELESAI";

      if (sName !== "" && !isNaN(examScore) && isDone) {
        completedList.push({
          name: sName,
          score: examScore,
          time: row[1] ? row[1].toString() : "-",
          className: EXPECTED_CLASS
        });
      }
    }

    // Isih: Markah tertinggi dahulu (desc), jika sama, masa terawal (asc)
    completedList.sort(function(a, b) {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return a.time.localeCompare(b.time);
    });

    // Ambil Top 10
    const top10 = completedList.slice(0, 10);

    // Kosongkan baris leaderboard sedia ada
    const lastRow = sheetLb.getLastRow();
    if (lastRow > 1) {
      sheetLb.getRange(2, 1, lastRow - 1, HEADERS_LEADERBOARD.length).clearContent();
    }

    // Tulis baris Top 10 baharu
    if (top10.length > 0) {
      const lbRows = [];
      for (let j = 0; j < top10.length; j++) {
        lbRows.push([
          j + 1,                   // Kedudukan (1, 2, 3...)
          top10[j].name,           // Nama Murid
          top10[j].score,          // Markah Ujian /10
          top10[j].time,           // Timestamp Tamat
          top10[j].className       // Kelas
        ]);
      }
      sheetLb.getRange(2, 1, lbRows.length, HEADERS_LEADERBOARD.length).setValues(lbRows);
    }
  } catch (err) {
    Logger.log("Ralat updateLeaderboardTab: " + err.toString());
  }
}

/**
 * Pembina output JSON
 */
function createJsonResponse(success, message, extraData) {
  const result = {
    success: success,
    status: success ? "success" : "error",
    message: message
  };

  if (extraData && typeof extraData === "object") {
    Object.keys(extraData).forEach(function(k) {
      result[k] = extraData[k];
    });
  }

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}
