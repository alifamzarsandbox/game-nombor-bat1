/**
 * Enjin Penjana Grafik Pixel Art 2.5D
 * Mencipta tekstur pixel art retro untuk watak, peta sekolah, dan objek interaktif
 * Menggunakan HTML5 Canvas dan didaftarkan terus ke Phaser Texture Manager
 */

export class PixelGraphicsEngine {
  constructor(scene) {
    this.scene = scene;
  }

  /**
   * Jana semua tekstur yang diperlukan oleh permainan
   */
  generateAll() {
    this.generatePlayerSpriteSheet();
    this.generateNpcSpriteSheets();
    this.generateEnvironmentTiles();
    this.generateClassroomProps();
    this.generateCanteenProps();
    this.generateFieldProps();
    this.generateUiAndEffectAssets();
  }

  // ==========================================
  // 1. WATAK MURID (Player: 4 Arah x 3 Frame)
  // ==========================================
  generatePlayerSpriteSheet() {
    // 3 frame animasi x 4 arah = 12 sprite (Setiap satu 32x48 px)
    const frameW = 32;
    const frameH = 48;
    const canvas = document.createElement("canvas");
    canvas.width = frameW * 3; // 3 frames (walk1, idle, walk2)
    canvas.height = frameH * 4; // 4 rows: 0=Down, 1=Left, 2=Right, 3=Up
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;

    // Warna Watak Murid 1 Gamma (Seragam Sekolah Malaysia)
    const skinColor = "#FFDFC4";
    const hairColor = "#2B2119";
    const shirtColor = "#FFFFFF";
    const pantsColor = "#1D3557"; // Biru gelap seluar sekolah
    const shoesColor = "#1A1A1A";
    const bagColor = "#E63946";   // Beg sekolah merah ceria

    const drawStudent = (col, row, dir, frame) => {
      const ox = col * frameW;
      const oy = row * frameH;

      // Bayang-bayang di kaki (2.5D perspective)
      ctx.fillStyle = "rgba(0,0,0,0.25)";
      ctx.beginPath();
      ctx.ellipse(ox + 16, oy + 44, 10, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      // Kaki & Kasut
      ctx.fillStyle = pantsColor;
      const legOffset = frame === 0 ? -2 : frame === 2 ? 2 : 0;

      if (dir === "down" || dir === "up") {
        ctx.fillRect(ox + 10, oy + 32 + (frame === 0 ? -1 : 0), 5, 8);
        ctx.fillRect(ox + 17, oy + 32 + (frame === 2 ? -1 : 0), 5, 8);
        ctx.fillStyle = shoesColor;
        ctx.fillRect(ox + 9, oy + 40 + (frame === 0 ? -1 : 0), 6, 4);
        ctx.fillRect(ox + 17, oy + 40 + (frame === 2 ? -1 : 0), 6, 4);
      } else if (dir === "left") {
        ctx.fillRect(ox + 12 + legOffset, oy + 32, 7, 8);
        ctx.fillStyle = shoesColor;
        ctx.fillRect(ox + 10 + legOffset, oy + 40, 8, 4);
      } else if (dir === "right") {
        ctx.fillRect(ox + 13 - legOffset, oy + 32, 7, 8);
        ctx.fillStyle = shoesColor;
        ctx.fillRect(ox + 14 - legOffset, oy + 40, 8, 4);
      }

      // Beg Sekolah (Jika dari belakang atau sisi)
      if (dir === "up") {
        ctx.fillStyle = bagColor;
        ctx.fillRect(ox + 9, oy + 20, 14, 12);
        ctx.fillStyle = "#A8202A";
        ctx.fillRect(ox + 11, oy + 24, 10, 6);
      } else if (dir === "left") {
        ctx.fillStyle = bagColor;
        ctx.fillRect(ox + 18, oy + 21, 5, 11);
      } else if (dir === "right") {
        ctx.fillStyle = bagColor;
        ctx.fillRect(ox + 9, oy + 21, 5, 11);
      }

      // Badan / Baju Putih Sekolah
      ctx.fillStyle = shirtColor;
      ctx.fillRect(ox + 9, oy + 19, 14, 13);
      // Kolar & Tali leher / lencana
      if (dir === "down") {
        ctx.fillStyle = "#1D3557";
        ctx.fillRect(ox + 15, oy + 20, 2, 7); // Tali leher / garis
        ctx.fillStyle = "#E63946";
        ctx.fillRect(ox + 11, oy + 23, 2, 2); // Lencana sekolah
      }

      // Tangan
      ctx.fillStyle = skinColor;
      if (dir === "down") {
        ctx.fillRect(ox + 6, oy + 21 + (frame === 2 ? -2 : 0), 3, 9);
        ctx.fillRect(ox + 23, oy + 21 + (frame === 0 ? -2 : 0), 3, 9);
      }

      // Kepala
      ctx.fillStyle = skinColor;
      ctx.fillRect(ox + 9, oy + 6, 14, 13);

      // Rambut & Songkok / Topi
      ctx.fillStyle = hairColor;
      if (dir === "down") {
        ctx.fillRect(ox + 8, oy + 4, 16, 6);
        ctx.fillRect(ox + 8, oy + 10, 3, 4);
        ctx.fillRect(ox + 21, oy + 10, 3, 4);
        // Mata & Senyuman
        ctx.fillStyle = "#1A1A1A";
        ctx.fillRect(ox + 12, oy + 11, 2, 3);
        ctx.fillRect(ox + 18, oy + 11, 2, 3);
        ctx.fillStyle = "#E76F51";
        ctx.fillRect(ox + 14, oy + 15, 4, 2); // Senyum
      } else if (dir === "up") {
        ctx.fillRect(ox + 8, oy + 4, 16, 13); // Rambut penuh belakang
      } else if (dir === "left") {
        ctx.fillRect(ox + 9, oy + 4, 15, 6);
        ctx.fillRect(ox + 15, oy + 10, 8, 7);
        ctx.fillStyle = "#1A1A1A";
        ctx.fillRect(ox + 11, oy + 11, 2, 3); // Mata sisi
      } else if (dir === "right") {
        ctx.fillRect(ox + 8, oy + 4, 15, 6);
        ctx.fillRect(ox + 9, oy + 10, 8, 7);
        ctx.fillStyle = "#1A1A1A";
        ctx.fillRect(ox + 19, oy + 11, 2, 3); // Mata sisi
      }
    };

    // Row 0: Down (3 frames)
    drawStudent(0, 0, "down", 0);
    drawStudent(1, 0, "down", 1);
    drawStudent(2, 0, "down", 2);

    // Row 1: Left (3 frames)
    drawStudent(0, 1, "left", 0);
    drawStudent(1, 1, "left", 1);
    drawStudent(2, 1, "left", 2);

    // Row 2: Right (3 frames)
    drawStudent(0, 2, "right", 0);
    drawStudent(1, 2, "right", 1);
    drawStudent(2, 2, "right", 2);

    // Row 3: Up (3 frames)
    drawStudent(0, 3, "up", 0);
    drawStudent(1, 3, "up", 1);
    drawStudent(2, 3, "up", 2);

    this.scene.textures.addSpriteSheet("player", canvas, {
      frameWidth: frameW,
      frameHeight: frameH
    });
  }

  // ==========================================
  // 2. NPC SPRITES: Ustaz Alif, Mak Cik Kantin, Cikgu Sukan
  // ==========================================
  generateNpcSpriteSheets() {
    const frameW = 32;
    const frameH = 48;

    // A. USTAZ ALIF
    const cUstaz = document.createElement("canvas");
    cUstaz.width = frameW * 2;
    cUstaz.height = frameH;
    const ctxU = cUstaz.getContext("2d");
    ctxU.imageSmoothingEnabled = false;

    const drawUstaz = (ox, oy, frame) => {
      // Bayang
      ctxU.fillStyle = "rgba(0,0,0,0.25)";
      ctxU.beginPath();
      ctxU.ellipse(ox + 16, oy + 44, 11, 4, 0, 0, Math.PI * 2);
      ctxU.fill();

      // Jubah Putih Bersih
      ctxU.fillStyle = "#F8F9FA";
      ctxU.fillRect(ox + 8, oy + 18, 16, 24);
      // Garisan jubah keemasan
      ctxU.fillStyle = "#E9C46A";
      ctxU.fillRect(ox + 15, oy + 18, 2, 24);

      // Selipar / Kasut
      ctxU.fillStyle = "#4A4E69";
      ctxU.fillRect(ox + 10, oy + 42, 5, 3);
      ctxU.fillRect(ox + 17, oy + 42, 5, 3);

      // Tangan
      ctxU.fillStyle = "#FFDFC4";
      ctxU.fillRect(ox + 6, oy + 22, 3, 10);
      ctxU.fillRect(ox + 23, oy + 22, 3, 10);

      // Muka
      ctxU.fillStyle = "#FFDFC4";
      ctxU.fillRect(ox + 9, oy + 7, 14, 12);

      // Mata & Janggut Kemas
      ctxU.fillStyle = "#1A1A1A";
      ctxU.fillRect(ox + 12, oy + 11, 2, 2);
      ctxU.fillRect(ox + 18, oy + 11, 2, 2);
      // Janggut kemas
      ctxU.fillStyle = "#2B2119";
      ctxU.fillRect(ox + 14, oy + 16, 4, 3);

      // Songkok Hitam Tinggi Kemas
      ctxU.fillStyle = "#101010";
      ctxU.fillRect(ox + 7, oy + 1, 18, 7);
      ctxU.fillStyle = "#D4AF37"; // Lilitan / sulaman songkok
      ctxU.fillRect(ox + 7, oy + 7, 18, 1);
    };
    drawUstaz(0, 0, 0);
    drawUstaz(frameW, 0, 1);
    this.scene.textures.addSpriteSheet("npc_ustaz", cUstaz, { frameWidth: frameW, frameHeight: frameH });

    // B. MAK CIK KANTIN
    const cKantin = document.createElement("canvas");
    cKantin.width = frameW * 2;
    cKantin.height = frameH;
    const ctxK = cKantin.getContext("2d");
    ctxK.imageSmoothingEnabled = false;

    const drawMakCik = (ox, oy, frame) => {
      // Bayang
      ctxK.fillStyle = "rgba(0,0,0,0.25)";
      ctxK.beginPath();
      ctxK.ellipse(ox + 16, oy + 44, 11, 4, 0, 0, Math.PI * 2);
      ctxK.fill();

      // Baju Kurung & Kain
      ctxK.fillStyle = "#F77F00";
      ctxK.fillRect(ox + 8, oy + 18, 16, 24);

      // Apron Putih Kantin
      ctxK.fillStyle = "#FFFFFF";
      ctxK.fillRect(ox + 10, oy + 21, 12, 19);
      ctxK.fillStyle = "#D62828"; // Poket apron
      ctxK.fillRect(ox + 13, oy + 28, 6, 6);

      // Kasut
      ctxK.fillStyle = "#333333";
      ctxK.fillRect(ox + 10, oy + 42, 5, 3);
      ctxK.fillRect(ox + 17, oy + 42, 5, 3);

      // Muka
      ctxK.fillStyle = "#FFDFC4";
      ctxK.fillRect(ox + 10, oy + 8, 12, 11);
      // Mata & Senyum Ceria
      ctxK.fillStyle = "#1A1A1A";
      ctxK.fillRect(ox + 12, oy + 11, 2, 2);
      ctxK.fillRect(ox + 18, oy + 11, 2, 2);
      ctxK.fillStyle = "#E76F51";
      ctxK.fillRect(ox + 14, oy + 15, 4, 2);

      // Tudung Bawal Ceria (Kuning Terang)
      ctxK.fillStyle = "#FCBF49";
      ctxK.fillRect(ox + 8, oy + 3, 16, 6);
      ctxK.fillRect(ox + 7, oy + 9, 3, 10);
      ctxK.fillRect(ox + 22, oy + 9, 3, 10);
    };
    drawMakCik(0, 0, 0);
    drawMakCik(frameW, 0, 1);
    this.scene.textures.addSpriteSheet("npc_kantin", cKantin, { frameWidth: frameW, frameHeight: frameH });

    // C. CIKGU SUKAN
    const cSukan = document.createElement("canvas");
    cSukan.width = frameW * 2;
    cSukan.height = frameH;
    const ctxS = cSukan.getContext("2d");
    ctxS.imageSmoothingEnabled = false;

    const drawCikguSukan = (ox, oy, frame) => {
      // Bayang
      ctxS.fillStyle = "rgba(0,0,0,0.25)";
      ctxS.beginPath();
      ctxS.ellipse(ox + 16, oy + 44, 11, 4, 0, 0, Math.PI * 2);
      ctxS.fill();

      // Baju Trek Sukan Merah
      ctxS.fillStyle = "#D62828";
      ctxS.fillRect(ox + 8, oy + 18, 16, 14);
      // Jalur Putih Sukan
      ctxS.fillStyle = "#FFFFFF";
      ctxS.fillRect(ox + 8, oy + 24, 16, 2);

      // Seluar Trek Hitam
      ctxS.fillStyle = "#1A1A1A";
      ctxS.fillRect(ox + 9, oy + 32, 6, 9);
      ctxS.fillRect(ox + 17, oy + 32, 6, 9);

      // Kasut Sukan
      ctxS.fillStyle = "#FFFFFF";
      ctxS.fillRect(ox + 8, oy + 41, 7, 4);
      ctxS.fillRect(ox + 17, oy + 41, 7, 4);

      // Wisel di leher
      ctxS.fillStyle = "#E9C46A";
      ctxS.fillRect(ox + 15, oy + 21, 2, 5);

      // Muka
      ctxS.fillStyle = "#FFDFC4";
      ctxS.fillRect(ox + 9, oy + 8, 14, 11);
      ctxS.fillStyle = "#1A1A1A";
      ctxS.fillRect(ox + 12, oy + 12, 2, 2);
      ctxS.fillRect(ox + 18, oy + 12, 2, 2);

      // Topi Sukan
      ctxS.fillStyle = "#003049";
      ctxS.fillRect(ox + 7, oy + 3, 18, 6);
      ctxS.fillRect(ox + 5, oy + 7, 10, 2); // Muncung topi
    };
    drawCikguSukan(0, 0, 0);
    drawCikguSukan(frameW, 0, 1);
    this.scene.textures.addSpriteSheet("npc_sukan", cSukan, { frameWidth: frameW, frameHeight: frameH });
  }

  // ==========================================
  // 3. TILES PERSEKITARAN SEKOLAH (32x32)
  // ==========================================
  generateEnvironmentTiles() {
    const makeTile = (key, drawFn) => {
      const c = document.createElement("canvas");
      c.width = 32;
      c.height = 32;
      const ctx = c.getContext("2d");
      ctx.imageSmoothingEnabled = false;
      drawFn(ctx);
      this.scene.textures.addCanvas(key, c);
    };

    // A. Lantai Kelas (Kayu Parquet)
    makeTile("tile_class_floor", (ctx) => {
      ctx.fillStyle = "#E7CBA9";
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = "#DEBA91";
      ctx.fillRect(0, 0, 32, 1);
      ctx.fillRect(0, 16, 32, 1);
      ctx.fillRect(16, 0, 1, 16);
      ctx.fillRect(8, 16, 1, 16);
      ctx.fillRect(24, 16, 1, 16);
    });

    // B. Dinding Kelas (Pastel Biru Muda)
    makeTile("tile_class_wall", (ctx) => {
      ctx.fillStyle = "#A8DADC";
      ctx.fillRect(0, 0, 32, 24);
      ctx.fillStyle = "#457B9D"; // Border skirt bawah
      ctx.fillRect(0, 24, 32, 8);
      ctx.fillStyle = "#1D3557";
      ctx.fillRect(0, 23, 32, 1);
    });

    // C. Tingkap Kelas (Pandangan Luar Pokok/Langit)
    makeTile("tile_class_window", (ctx) => {
      ctx.fillStyle = "#A8DADC";
      ctx.fillRect(0, 0, 32, 32);
      // Bingkai tingkap kayu
      ctx.fillStyle = "#457B9D";
      ctx.fillRect(4, 4, 24, 20);
      // Kaca biru cerah
      ctx.fillStyle = "#CAF0F8";
      ctx.fillRect(6, 6, 20, 16);
      // Palang tingkap
      ctx.fillStyle = "#457B9D";
      ctx.fillRect(15, 6, 2, 16);
      ctx.fillRect(6, 13, 20, 2);
    });

    // D. Lantai Koridor / Laluan Pejalan Kaki
    makeTile("tile_corridor_floor", (ctx) => {
      ctx.fillStyle = "#D6CCC2";
      ctx.fillRect(0, 0, 32, 32);
      ctx.strokeStyle = "#B7B7A4";
      ctx.strokeRect(0.5, 0.5, 31, 31);
      ctx.fillStyle = "#EDEDE9";
      ctx.fillRect(2, 2, 4, 4);
    });

    // E. Lantai Kantin (Jubin Corak Selang-seli)
    makeTile("tile_canteen_floor", (ctx) => {
      ctx.fillStyle = "#F8EDEB";
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = "#FEC5BB";
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillRect(16, 16, 16, 16);
    });

    // F. Rumput Padang Sekolah (Segar & Bertekstur)
    makeTile("tile_field_grass", (ctx) => {
      ctx.fillStyle = "#70A95B";
      ctx.fillRect(0, 0, 32, 32);
      // Rumput halus
      ctx.fillStyle = "#5E934B";
      ctx.fillRect(4, 6, 2, 3);
      ctx.fillRect(14, 18, 3, 2);
      ctx.fillRect(24, 10, 2, 3);
      ctx.fillStyle = "#82BC6D";
      ctx.fillRect(8, 22, 2, 2);
      ctx.fillRect(20, 4, 2, 2);
    });

    // G. Garisan Padang Putih (Chalk Line)
    makeTile("tile_field_line_h", (ctx) => {
      ctx.fillStyle = "#70A95B";
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 14, 32, 4);
    });
    makeTile("tile_field_line_v", (ctx) => {
      ctx.fillStyle = "#70A95B";
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(14, 0, 4, 32);
    });
  }

  // ==========================================
  // 4. OBJEK KELAS 1 GAMMA
  // ==========================================
  generateClassroomProps() {
    // A. Papan Putih Kelas dengan Nombor Arab (96x48 px)
    const cBoard = document.createElement("canvas");
    cBoard.width = 96;
    cBoard.height = 48;
    const ctxB = cBoard.getContext("2d");
    ctxB.imageSmoothingEnabled = false;

    // Bingkai aluminium
    ctxB.fillStyle = "#495057";
    ctxB.fillRect(0, 0, 96, 48);
    // Permukaan papan putih
    ctxB.fillStyle = "#F8F9FA";
    ctxB.fillRect(3, 3, 90, 42);

    // Tulisan Tajuk Papan Putih
    ctxB.fillStyle = "#1D3557";
    ctxB.font = "bold 8px sans-serif";
    ctxB.fillText("KELAS 1 GAMMA : BAHASA ARAB", 8, 13);

    // Nombor Arab 1-10 di papan putih
    ctxB.fillStyle = "#E63946";
    ctxB.font = "bold 11px sans-serif";
    ctxB.fillText("١  ٢  ٣  ٤  ٥  ٦  ٧  ٨  ٩  ١٠", 6, 29);

    // Pemadam & Pen marker
    ctxB.fillStyle = "#2A9D8F";
    ctxB.fillRect(70, 39, 12, 4);
    ctxB.fillStyle = "#E76F51";
    ctxB.fillRect(84, 40, 6, 2);
    this.scene.textures.addCanvas("prop_whiteboard", cBoard);

    // B. Meja & Kerusi Murid (48x40 px)
    const cDesk = document.createElement("canvas");
    cDesk.width = 48;
    cDesk.height = 40;
    const ctxD = cDesk.getContext("2d");
    ctxD.imageSmoothingEnabled = false;

    // Kerusi belakang
    ctxD.fillStyle = "#457B9D";
    ctxD.fillRect(14, 2, 20, 8);
    ctxD.fillStyle = "#1D3557";
    ctxD.fillRect(16, 10, 3, 6);
    ctxD.fillRect(29, 10, 3, 6);

    // Permukaan Meja Kayu
    ctxD.fillStyle = "#D4A373";
    ctxD.fillRect(4, 14, 40, 16);
    ctxD.fillStyle = "#BC6C25";
    ctxD.fillRect(4, 28, 40, 3);

    // Kaki Meja Besi
    ctxD.fillStyle = "#333333";
    ctxD.fillRect(6, 30, 3, 8);
    ctxD.fillRect(39, 30, 3, 8);

    // Buku Sekolah & Pensel atas meja
    ctxD.fillStyle = "#06D6A0";
    ctxD.fillRect(10, 17, 10, 8);
    ctxD.fillStyle = "#FFFFFF";
    ctxD.fillRect(12, 19, 6, 4);
    ctxD.fillStyle = "#FFD166";
    ctxD.fillRect(23, 20, 8, 2);
    this.scene.textures.addCanvas("prop_student_desk", cDesk);

    // C. Meja Guru Ustaz Alif (64x44 px)
    const cTDesk = document.createElement("canvas");
    cTDesk.width = 64;
    cTDesk.height = 44;
    const ctxT = cTDesk.getContext("2d");
    ctxT.imageSmoothingEnabled = false;

    // Meja Kayu Coklat Tua
    ctxT.fillStyle = "#8D5B4C";
    ctxT.fillRect(2, 10, 60, 22);
    ctxT.fillStyle = "#663F34";
    ctxT.fillRect(2, 30, 60, 4);
    ctxT.fillStyle = "#2F1E19";
    ctxT.fillRect(4, 34, 4, 8);
    ctxT.fillRect(56, 34, 4, 8);

    // Buku Bahasa Arab Guru
    ctxT.fillStyle = "#1B4965";
    ctxT.fillRect(12, 14, 14, 10);
    ctxT.fillStyle = "#E9C46A";
    ctxT.fillRect(14, 16, 10, 6);
    // Pemegang pen & fail
    ctxT.fillStyle = "#E76F51";
    ctxT.fillRect(44, 14, 8, 8);
    this.scene.textures.addCanvas("prop_teacher_desk", cTDesk);

    // D. Papan Tanda "KELAS 1 GAMMA" (64x24 px)
    const cSign1 = document.createElement("canvas");
    cSign1.width = 64;
    cSign1.height = 24;
    const ctxS1 = cSign1.getContext("2d");
    ctxS1.imageSmoothingEnabled = false;

    ctxS1.fillStyle = "#1D3557";
    ctxS1.fillRect(0, 0, 64, 24);
    ctxS1.strokeStyle = "#E9C46A";
    ctxS1.lineWidth = 2;
    ctxS1.strokeRect(1, 1, 62, 22);

    ctxS1.fillStyle = "#FFFFFF";
    ctxS1.font = "bold 8px sans-serif";
    ctxS1.textAlign = "center";
    ctxS1.fillText("KELAS 1 GAMMA", 32, 15);
    this.scene.textures.addCanvas("sign_class", cSign1);
  }

  // ==========================================
  // 5. OBJEK KANTIN SEKOLAH
  // ==========================================
  generateCanteenProps() {
    // A. Kaunter Makanan Kantin (96x48 px)
    const cCounter = document.createElement("canvas");
    cCounter.width = 96;
    cCounter.height = 48;
    const ctx = cCounter.getContext("2d");
    ctx.imageSmoothingEnabled = false;

    // Meja Kaunter Jubin Putih
    ctx.fillStyle = "#CED4DA";
    ctx.fillRect(0, 16, 96, 28);
    ctx.fillStyle = "#ADB5BD";
    ctx.fillRect(0, 40, 96, 8);

    // Dulang Karipap Emas
    ctx.fillStyle = "#F4A261";
    ctx.fillRect(8, 18, 22, 12);
    ctx.fillStyle = "#E76F51";
    ctx.beginPath();
    ctx.arc(14, 24, 3, 0, Math.PI * 2);
    ctx.arc(22, 24, 3, 0, Math.PI * 2);
    ctx.fill();

    // Bakul Epal Merah
    ctx.fillStyle = "#E63946";
    ctx.fillRect(38, 18, 20, 12);
    ctx.fillStyle = "#9B2226";
    ctx.beginPath();
    ctx.arc(43, 24, 3, 0, Math.PI * 2);
    ctx.arc(51, 24, 3, 0, Math.PI * 2);
    ctx.fill();

    // Kotak Susu Segar
    ctx.fillStyle = "#457B9D";
    ctx.fillRect(68, 18, 8, 12);
    ctx.fillStyle = "#F1FAEE";
    ctx.fillRect(78, 18, 8, 12);
    this.scene.textures.addCanvas("prop_canteen_counter", cCounter);

    // B. Meja & Bangku Kantin Panjang (80x40 px)
    const cTable = document.createElement("canvas");
    cTable.width = 80;
    cTable.height = 40;
    const ctxT = cTable.getContext("2d");
    ctxT.imageSmoothingEnabled = false;

    // Bangku atas
    ctxT.fillStyle = "#E76F51";
    ctxT.fillRect(4, 2, 72, 6);

    // Meja utama
    ctxT.fillStyle = "#2A9D8F";
    ctxT.fillRect(0, 12, 80, 16);
    ctxT.fillStyle = "#264653";
    ctxT.fillRect(0, 26, 80, 2);

    // Kaki meja
    ctxT.fillStyle = "#1A1A1A";
    ctxT.fillRect(6, 28, 4, 10);
    ctxT.fillRect(70, 28, 4, 10);

    // Bangku bawah
    ctxT.fillStyle = "#E76F51";
    ctxT.fillRect(4, 32, 72, 6);
    this.scene.textures.addCanvas("prop_canteen_table", cTable);

    // C. Papan Tanda "KANTIN SEKOLAH"
    const cSignK = document.createElement("canvas");
    cSignK.width = 64;
    cSignK.height = 24;
    const ctxSK = cSignK.getContext("2d");
    ctxSK.imageSmoothingEnabled = false;

    ctxSK.fillStyle = "#E76F51";
    ctxSK.fillRect(0, 0, 64, 24);
    ctxSK.strokeStyle = "#FFFFFF";
    ctxSK.lineWidth = 2;
    ctxSK.strokeRect(1, 1, 62, 22);

    ctxSK.fillStyle = "#FFFFFF";
    ctxSK.font = "bold 8px sans-serif";
    ctxSK.textAlign = "center";
    ctxSK.fillText("KANTIN SEKOLAH", 32, 15);
    this.scene.textures.addCanvas("sign_canteen", cSignK);
  }

  // ==========================================
  // 6. OBJEK PADANG SEKOLAH
  // ==========================================
  generateFieldProps() {
    // A. Tiang Gol Bola Sepak (80x48 px)
    const cGoal = document.createElement("canvas");
    cGoal.width = 80;
    cGoal.height = 48;
    const ctxG = cGoal.getContext("2d");
    ctxG.imageSmoothingEnabled = false;

    // Jaring gol separa telus
    ctxG.fillStyle = "rgba(255,255,255,0.4)";
    ctxG.fillRect(8, 4, 64, 40);

    // Garisan grid jaring
    ctxG.strokeStyle = "rgba(200,200,200,0.5)";
    ctxG.lineWidth = 1;
    for (let x = 12; x < 72; x += 8) {
      ctxG.beginPath();
      ctxG.moveTo(x, 4);
      ctxG.lineTo(x, 44);
      ctxG.stroke();
    }
    for (let y = 8; y < 44; y += 8) {
      ctxG.beginPath();
      ctxG.moveTo(8, y);
      ctxG.lineTo(72, y);
      ctxG.stroke();
    }

    // Tiang gol putih
    ctxG.fillStyle = "#FFFFFF";
    ctxG.fillRect(6, 4, 68, 4);  // Palang atas
    ctxG.fillRect(6, 4, 4, 42);  // Tiang kiri
    ctxG.fillRect(70, 4, 4, 42); // Tiang kanan
    this.scene.textures.addCanvas("prop_soccer_goal", cGoal);

    // B. Bola Sepak (24x24 px)
    const cBall = document.createElement("canvas");
    cBall.width = 24;
    cBall.height = 24;
    const ctxB = cBall.getContext("2d");
    ctxB.imageSmoothingEnabled = false;

    // Bayang
    ctxB.fillStyle = "rgba(0,0,0,0.25)";
    ctxB.beginPath();
    ctxB.ellipse(12, 21, 8, 3, 0, 0, Math.PI * 2);
    ctxB.fill();

    // Bola Putih
    ctxB.fillStyle = "#FFFFFF";
    ctxB.beginPath();
    ctxB.arc(12, 11, 9, 0, Math.PI * 2);
    ctxB.fill();
    ctxB.strokeStyle = "#495057";
    ctxB.lineWidth = 1.5;
    ctxB.stroke();

    // Corak Pentagon Hitam
    ctxB.fillStyle = "#1A1A1A";
    ctxB.beginPath();
    ctxB.arc(12, 11, 3.5, 0, Math.PI * 2);
    ctxB.fill();
    ctxB.fillRect(6, 6, 2, 2);
    ctxB.fillRect(16, 6, 2, 2);
    ctxB.fillRect(7, 15, 2, 2);
    ctxB.fillRect(15, 15, 2, 2);
    this.scene.textures.addCanvas("prop_ball", cBall);

    // C. Kon Latihan Sukan Jingga (20x24 px)
    const cCone = document.createElement("canvas");
    cCone.width = 20;
    cCone.height = 24;
    const ctxC = cCone.getContext("2d");
    ctxC.imageSmoothingEnabled = false;

    // Bayang
    ctxC.fillStyle = "rgba(0,0,0,0.25)";
    ctxC.beginPath();
    ctxC.ellipse(10, 21, 7, 3, 0, 0, Math.PI * 2);
    ctxC.fill();

    // Tapak Kon
    ctxC.fillStyle = "#E76F51";
    ctxC.fillRect(3, 18, 14, 4);

    // Badan Kon Segitiga
    ctxC.beginPath();
    ctxC.moveTo(10, 2);
    ctxC.lineTo(15, 18);
    ctxC.lineTo(5, 18);
    ctxC.closePath();
    ctxC.fillStyle = "#F4A261";
    ctxC.fill();

    // Jalur Putih Reflektif Kon
    ctxC.fillStyle = "#FFFFFF";
    ctxC.fillRect(7, 10, 6, 3);
    this.scene.textures.addCanvas("prop_cone", cCone);

    // D. Pokok Sekolah Rendang (64x72 px)
    const cTree = document.createElement("canvas");
    cTree.width = 64;
    cTree.height = 72;
    const ctxTr = cTree.getContext("2d");
    ctxTr.imageSmoothingEnabled = false;

    // Bayang pokok
    ctxTr.fillStyle = "rgba(0,0,0,0.25)";
    ctxTr.beginPath();
    ctxTr.ellipse(32, 66, 24, 6, 0, 0, Math.PI * 2);
    ctxTr.fill();

    // Batang Pokok Kayu
    ctxTr.fillStyle = "#6F4E37";
    ctxTr.fillRect(26, 40, 12, 26);
    ctxTr.fillStyle = "#5C3A21";
    ctxTr.fillRect(32, 40, 6, 26);

    // Dedaun Rimbun Hijau (3 lapis daun 2.5D)
    ctxTr.fillStyle = "#2D6A4F";
    ctxTr.beginPath();
    ctxTr.arc(32, 34, 26, 0, Math.PI * 2);
    ctxTr.fill();

    ctxTr.fillStyle = "#40916C";
    ctxTr.beginPath();
    ctxTr.arc(28, 28, 22, 0, Math.PI * 2);
    ctxTr.fill();

    ctxTr.fillStyle = "#52B788";
    ctxTr.beginPath();
    ctxTr.arc(26, 24, 16, 0, Math.PI * 2);
    ctxTr.fill();
    this.scene.textures.addCanvas("prop_tree", cTree);

    // E. Papan Tanda "PADANG SEKOLAH"
    const cSignP = document.createElement("canvas");
    cSignP.width = 64;
    cSignP.height = 24;
    const ctxSP = cSignP.getContext("2d");
    ctxSP.imageSmoothingEnabled = false;

    ctxSP.fillStyle = "#2D6A4F";
    ctxSP.fillRect(0, 0, 64, 24);
    ctxSP.strokeStyle = "#FFFFFF";
    ctxSP.lineWidth = 2;
    ctxSP.strokeRect(1, 1, 62, 22);

    ctxSP.fillStyle = "#FFFFFF";
    ctxSP.font = "bold 8px sans-serif";
    ctxSP.textAlign = "center";
    ctxSP.fillText("PADANG SEKOLAH", 32, 15);
    this.scene.textures.addCanvas("sign_field", cSignP);
  }

  // ==========================================
  // 7. ASET UI, BINTANG, BUBBLE & LENCANA
  // ==========================================
  generateUiAndEffectAssets() {
    // A. Gelembung Interaksi "E" (32x32 px)
    const cBubble = document.createElement("canvas");
    cBubble.width = 32;
    cBubble.height = 32;
    const ctxB = cBubble.getContext("2d");
    ctxB.imageSmoothingEnabled = false;

    ctxB.fillStyle = "#FFFFFF";
    ctxB.beginPath();
    ctxB.arc(16, 14, 12, 0, Math.PI * 2);
    ctxB.fill();
    ctxB.strokeStyle = "#1D3557";
    ctxB.lineWidth = 2;
    ctxB.stroke();

    // Anak panah bawah gelembung
    ctxB.fillStyle = "#FFFFFF";
    ctxB.beginPath();
    ctxB.moveTo(13, 24);
    ctxB.lineTo(19, 24);
    ctxB.lineTo(16, 29);
    ctxB.closePath();
    ctxB.fill();

    // Huruf E
    ctxB.fillStyle = "#E63946";
    ctxB.font = "bold 13px sans-serif";
    ctxB.textAlign = "center";
    ctxB.fillText("E", 16, 18);
    this.scene.textures.addCanvas("ui_interact_bubble", cBubble);

    // B. Partikel Bintang Kejayaan (16x16 px)
    const cStar = document.createElement("canvas");
    cStar.width = 16;
    cStar.height = 16;
    const ctxSt = cStar.getContext("2d");
    ctxSt.fillStyle = "#FFD166";
    ctxSt.beginPath();
    ctxSt.moveTo(8, 0);
    ctxSt.lineTo(10, 5);
    ctxSt.lineTo(16, 8);
    ctxSt.lineTo(10, 11);
    ctxSt.lineTo(8, 16);
    ctxSt.lineTo(6, 11);
    ctxSt.lineTo(0, 8);
    ctxSt.lineTo(6, 5);
    ctxSt.closePath();
    ctxSt.fill();
    this.scene.textures.addCanvas("particle_star", cStar);

    // C. Lencana "PENGEMBARA NOMBOR ARAB" (80x80 px)
    const cBadge = document.createElement("canvas");
    cBadge.width = 80;
    cBadge.height = 80;
    const ctxBg = cBadge.getContext("2d");
    ctxBg.imageSmoothingEnabled = false;

    // Reben pingat belakang
    ctxBg.fillStyle = "#1D3557";
    ctxBg.fillRect(24, 45, 12, 30);
    ctxBg.fillStyle = "#E63946";
    ctxBg.fillRect(44, 45, 12, 30);

    // Bulatan Emas Luar
    ctxBg.fillStyle = "#F4A261";
    ctxBg.beginPath();
    ctxBg.arc(40, 36, 28, 0, Math.PI * 2);
    ctxBg.fill();

    // Bulatan Emas Dalam
    ctxBg.fillStyle = "#FFD166";
    ctxBg.beginPath();
    ctxBg.arc(40, 36, 24, 0, Math.PI * 2);
    ctxBg.fill();

    // Ikon Angka Arab ١ di tengah lencana
    ctxBg.fillStyle = "#1D3557";
    ctxBg.font = "bold 26px sans-serif";
    ctxBg.textAlign = "center";
    ctxBg.fillText("١", 40, 44);
    this.scene.textures.addCanvas("badge_winner", cBadge);
  }
}
