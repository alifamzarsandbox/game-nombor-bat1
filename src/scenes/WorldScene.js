/**
 * WorldScene: Peta Sekolah 2.5D Bersambung
 * Mengandungi Kelas 1 Gamma, Kantin Sekolah, dan Padang Sekolah
 * dengan Fizik Collision, Kamera Dinamik, dan Interaksi NPC
 */

import { GAME_CONFIG } from "../config.js";
import { gameStorage, unescapeStudentName } from "../systems/storage.js";
import { InputController } from "../systems/controls.js";
import { DialogueSystem } from "../systems/dialogue.js";
import { sheetsSync } from "../systems/sheetsSync.js";
import { audioSystem } from "../systems/audio.js";

export class WorldScene extends Phaser.Scene {
  constructor() {
    super("WorldScene");
  }

  create() {
    this.studentName = unescapeStudentName(gameStorage.session.studentName || "Murid");

    // 1. Dimensi Peta Sekolah (2000 x 1200 px)
    this.mapWidth = 2000;
    this.mapHeight = 1200;
    this.physics.world.setBounds(0, 0, this.mapWidth, this.mapHeight);

    // Kumpulan objek perlanggaran (Colliders)
    this.obstacles = this.physics.add.staticGroup();

    // 2. Bina Struktur Peta Sekolah
    this.buildSchoolEnvironment();

    // 3. Tambah NPC
    this.createNPCs();

    // 4. Tambah Watak Murid (Player) di dalam Kelas 1 Gamma
    this.createPlayer();

    // 5. Sediakan Kawalan & Dialog
    this.controls = new InputController(this);
    this.dialogue = new DialogueSystem(this);

    // 6. Sediakan Kamera Mengikuti Watak
    this.cameras.main.setBounds(0, 0, this.mapWidth, this.mapHeight);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setZoom(1.15);

    // 7. Gelembung / Petunjuk Interaksi
    this.interactIndicator = this.add.sprite(0, 0, "ui_interact_bubble")
      .setVisible(false)
      .setDepth(100);

    // 8. Cipta HUD (Maklumat Murid, Kemajuan & Status Segerak)
    this.createHUD();

    // 9. Dengar status penyegerakan Google Sheets
    sheetsSync.onStatusChange((status, details) => {
      this.updateHudSyncStatus();
    });

    // 10. Sambut murid dengan mesej mesra jika kali pertama
    this.time.delayedCall(500, () => {
      this.showWelcomeHint();
    });
  }

  // ==========================================
  // PEMBINAAN PETA SEKOLAH
  // ==========================================
  buildSchoolEnvironment() {
    // ------------------------------------------
    // A. KAWASAN KELAS 1 GAMMA (X: 100 - 650, Y: 100 - 550)
    // ------------------------------------------
    // Lantai Parquet Kelas
    for (let x = 100; x <= 650; x += 32) {
      for (let y = 100; y <= 550; y += 32) {
        this.add.image(x, y, "tile_class_floor").setOrigin(0);
      }
    }

    // Dinding Atas Kelas dengan Tingkap
    for (let x = 100; x <= 650; x += 32) {
      const isWindow = (x >= 220 && x <= 320) || (x >= 440 && x <= 540);
      const wallTile = this.add.image(x, 68, isWindow ? "tile_class_window" : "tile_class_wall").setOrigin(0);
      this.obstacles.add(this.physics.add.existing(wallTile, true));
    }

    // Dinding Sisi Kiri Kelas
    for (let y = 68; y <= 550; y += 32) {
      const wLeft = this.add.image(68, y, "tile_class_wall").setOrigin(0);
      this.obstacles.add(this.physics.add.existing(wLeft, true));
    }

    // Dinding Bawah Kelas (dengan Pintu Keluar di X: 340-420)
    for (let x = 100; x <= 650; x += 32) {
      if (x < 340 || x > 420) {
        const wBottom = this.add.image(x, 550, "tile_class_wall").setOrigin(0);
        this.obstacles.add(this.physics.add.existing(wBottom, true));
      }
    }

    // Dinding Kanan Kelas
    for (let y = 68; y <= 550; y += 32) {
      const wRight = this.add.image(650, y, "tile_class_wall").setOrigin(0);
      this.obstacles.add(this.physics.add.existing(wRight, true));
    }

    // Papan Putih Kelas di Dinding Hadapan
    const whiteboard = this.add.image(360, 95, "prop_whiteboard").setDepth(5);
    this.obstacles.add(this.physics.add.existing(whiteboard, true));

    // Papan Tanda "KELAS 1 GAMMA" di atas pintu
    this.add.image(380, 560, "sign_class").setDepth(6);

    // Meja Guru Ustaz Alif di Hadapan
    const teacherDesk = this.add.image(480, 160, "prop_teacher_desk").setDepth(5);
    this.obstacles.add(this.physics.add.existing(teacherDesk, true));

    // Meja & Kerusi Murid 1 Gamma (Susun atur 3 baris x 2 lajur)
    const deskPositions = [
      { x: 220, y: 260 }, { x: 380, y: 260 },
      { x: 220, y: 360 }, { x: 380, y: 360 },
      { x: 220, y: 460 }, { x: 380, y: 460 }
    ];
    deskPositions.forEach((pos) => {
      const desk = this.add.image(pos.x, pos.y, "prop_student_desk").setDepth(5);
      this.obstacles.add(this.physics.add.existing(desk, true));
    });

    // ------------------------------------------
    // B. KORIDOR & LALUAN PENGHUBUNG SEKOLAH (Walkway)
    // ------------------------------------------
    // Koridor mendatar keluar dari kelas ke kantin (Y: 570 - 720, X: 100 - 1800)
    for (let x = 100; x <= 1800; x += 32) {
      for (let y = 570; y <= 720; y += 32) {
        this.add.image(x, y, "tile_corridor_floor").setOrigin(0);
      }
    }

    // Sempadan luar koridor atas kiri
    for (let x = 68; x < 340; x += 32) {
      const b1 = this.add.image(x, 570, "tile_class_wall").setOrigin(0);
      this.obstacles.add(this.physics.add.existing(b1, true));
    }
    for (let x = 440; x <= 950; x += 32) {
      const b2 = this.add.image(x, 570, "tile_class_wall").setOrigin(0);
      this.obstacles.add(this.physics.add.existing(b2, true));
    }

    // ------------------------------------------
    // C. KAWASAN KANTIN SEKOLAH (X: 1000 - 1750, Y: 100 - 550)
    // ------------------------------------------
    for (let x = 1000; x <= 1750; x += 32) {
      for (let y = 100; y <= 550; y += 32) {
        this.add.image(x, y, "tile_canteen_floor").setOrigin(0);
      }
    }

    // Dinding Kantin
    for (let x = 1000; x <= 1750; x += 32) {
      const cWall = this.add.image(x, 68, "tile_class_wall").setOrigin(0);
      this.obstacles.add(this.physics.add.existing(cWall, true));
    }
    for (let y = 68; y <= 550; y += 32) {
      const cWallR = this.add.image(1750, y, "tile_class_wall").setOrigin(0);
      this.obstacles.add(this.physics.add.existing(cWallR, true));
    }

    // Kaunter Makanan Kantin
    const canteenCounter = this.add.image(1350, 160, "prop_canteen_counter").setScale(1.5).setDepth(5);
    this.obstacles.add(this.physics.add.existing(canteenCounter, true));

    // Papan Tanda "KANTIN SEKOLAH"
    this.add.image(1350, 100, "sign_canteen").setDepth(6);

    // Meja-meja Makan Kantin
    const tablePositions = [
      { x: 1120, y: 320 }, { x: 1350, y: 320 }, { x: 1580, y: 320 },
      { x: 1120, y: 440 }, { x: 1350, y: 440 }, { x: 1580, y: 440 }
    ];
    tablePositions.forEach((pos) => {
      const tbl = this.add.image(pos.x, pos.y, "prop_canteen_table").setScale(1.2).setDepth(5);
      this.obstacles.add(this.physics.add.existing(tbl, true));
    });

    // ------------------------------------------
    // D. KAWASAN PADANG SEKOLAH (X: 100 - 1800, Y: 740 - 1150)
    // ------------------------------------------
    for (let x = 100; x <= 1800; x += 32) {
      for (let y = 740; y <= 1150; y += 32) {
        this.add.image(x, y, "tile_field_grass").setOrigin(0);
      }
    }

    // Garisan Padang Bola Sepak Putih
    for (let x = 300; x <= 1600; x += 32) {
      this.add.image(x, 800, "tile_field_line_h").setOrigin(0);
      this.add.image(x, 1100, "tile_field_line_h").setOrigin(0);
    }
    for (let y = 800; y <= 1100; y += 32) {
      this.add.image(300, y, "tile_field_line_v").setOrigin(0);
      this.add.image(1600, y, "tile_field_line_v").setOrigin(0);
      this.add.image(950, y, "tile_field_line_v").setOrigin(0); // Garisan tengah padang
    }

    // Tiang Gol Bola Sepak (Kiri dan Kanan)
    const goalLeft = this.add.image(280, 950, "prop_soccer_goal").setDepth(5);
    this.obstacles.add(this.physics.add.existing(goalLeft, true));

    const goalRight = this.add.image(1620, 950, "prop_soccer_goal").setFlipX(true).setDepth(5);
    this.obstacles.add(this.physics.add.existing(goalRight, true));

    // Bola Sepak di Padang
    this.add.image(950, 950, "prop_ball").setDepth(5);
    this.add.image(1200, 880, "prop_ball").setDepth(5);

    // Kon Latihan Sukan Jingga
    for (let x = 600; x <= 800; x += 50) {
      this.add.image(x, 860, "prop_cone").setDepth(5);
    }

    // Pokok-pokok Rendang di Sekeliling Padang
    const treePositions = [
      { x: 120, y: 780 }, { x: 120, y: 950 }, { x: 120, y: 1100 },
      { x: 1750, y: 780 }, { x: 1750, y: 950 }, { x: 1750, y: 1100 },
      { x: 500, y: 1160 }, { x: 950, y: 1160 }, { x: 1400, y: 1160 }
    ];
    treePositions.forEach((pos) => {
      const tree = this.add.image(pos.x, pos.y, "prop_tree").setScale(1.2).setDepth(pos.y);
      this.obstacles.add(this.physics.add.existing(tree, true));
    });

    // Papan Tanda "PADANG SEKOLAH"
    this.add.image(450, 755, "sign_field").setDepth(6);
  }

  // ==========================================
  // CIPTA NPC
  // ==========================================
  createNPCs() {
    this.npcs = [];

    // 1. NPC Ustaz Alif (Di hadapan Kelas 1 Gamma)
    const ustaz = this.physics.add.sprite(360, 160, "npc_ustaz", 0).setScale(1.4);
    ustaz.play("ustaz_idle");
    ustaz.setImmovable(true);
    ustaz.npcId = "ustaz";
    ustaz.npcName = "Ustaz Alif";
    ustaz.avatarClass = "avatar-ustaz";
    this.obstacles.add(ustaz);
    this.npcs.push(ustaz);

    // 2. NPC Mak Cik Kantin (Di Kaunter Kantin)
    const kantin = this.physics.add.sprite(1350, 130, "npc_kantin", 0).setScale(1.4);
    kantin.play("kantin_idle");
    kantin.setImmovable(true);
    kantin.npcId = "kantin";
    kantin.npcName = "Mak Cik Kantin";
    kantin.avatarClass = "avatar-kantin";
    this.obstacles.add(kantin);
    this.npcs.push(kantin);

    // 3. NPC Cikgu Sukan (Di Padang Sekolah)
    const sukan = this.physics.add.sprite(520, 850, "npc_sukan", 0).setScale(1.4);
    sukan.play("sukan_idle");
    sukan.setImmovable(true);
    sukan.npcId = "sukan";
    sukan.npcName = "Cikgu Sukan";
    sukan.avatarClass = "avatar-sukan";
    this.obstacles.add(sukan);
    this.npcs.push(sukan);

    // Sokongan sentuhan langsung pada NPC untuk telefon & tablet
    [ustaz, kantin, sukan].forEach((npc) => {
      npc.setInteractive({ cursor: "pointer" });
      npc.on("pointerdown", () => {
        const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, npc.x, npc.y);
        if (dist <= 150) {
          this.interactWithNpc(npc);
        } else {
          // Gerakkan pemain mendekati NPC jika jauh
          this.physics.moveToObject(this.player, npc, this.playerSpeed);
          this.time.delayedCall(400, () => {
            this.player.setVelocity(0, 0);
            this.interactWithNpc(npc);
          });
        }
      });
    });
  }

  // ==========================================
  // CIPTA WATAK MURID (PLAYER)
  // ==========================================
  createPlayer() {
    // Murid bermula di tengah-tengah Kelas 1 Gamma
    this.player = this.physics.add.sprite(320, 220, "player", 1).setScale(1.3);
    this.player.setCollideWorldBounds(true);
    this.player.setSize(20, 24);
    this.player.setOffset(6, 24);
    this.player.setDepth(10);

    // Perlanggaran antara murid dan objek statik
    this.physics.add.collider(this.player, this.obstacles);

    this.playerSpeed = 160;
    this.currentDirection = "down";
  }

  // ==========================================
  // UPDATE LOOP (PERGERAKAN & INTERAKSI)
  // ==========================================
  update() {
    // Jika dialog sedang aktif, jangan gerakkan watak
    if (this.dialogue && this.dialogue.isOpen) {
      this.player.setVelocity(0, 0);
      if (this.controls.isEscapeJustPressed()) {
        this.dialogue.close();
      }
      return;
    }

    this.controls.update();
    const { x: vx, y: vy } = this.controls.moveVector;

    // Gerakkan pemain mengikut vektor kawalan
    this.player.setVelocity(vx * this.playerSpeed, vy * this.playerSpeed);

    // Animasi pergerakan mengikut arah
    if (vx !== 0 || vy !== 0) {
      if (Math.abs(vx) > Math.abs(vy)) {
        if (vx < 0) {
          this.player.play("player_walk_left", true);
          this.currentDirection = "left";
        } else {
          this.player.play("player_walk_right", true);
          this.currentDirection = "right";
        }
      } else {
        if (vy < 0) {
          this.player.play("player_walk_up", true);
          this.currentDirection = "up";
        } else {
          this.player.play("player_walk_down", true);
          this.currentDirection = "down";
        }
      }
    } else {
      // Idle frame mengikut arah terakhir
      this.player.play(`player_idle_${this.currentDirection}`, true);
    }

    // Semak kedekatan dengan mana-mana NPC untuk interaksi
    this.checkNpcProximity();
  }

  checkNpcProximity() {
    let nearestNpc = null;
    let minDistance = 75; // Jarak interaksi selesa

    this.npcs.forEach((npc) => {
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, npc.x, npc.y);
      if (dist < minDistance) {
        nearestNpc = npc;
        minDistance = dist;
      }
    });

    if (nearestNpc) {
      this.interactIndicator.setPosition(nearestNpc.x, nearestNpc.y - 48);
      this.interactIndicator.setVisible(true);

      // Tekan butang interaksi (E / Enter / Sentuh)
      if (this.controls.interactJustPressed) {
        this.interactWithNpc(nearestNpc);
      }
    } else {
      this.interactIndicator.setVisible(false);
    }
  }

  // ==========================================
  // LOGIK INTERAKSI NPC
  // ==========================================
  interactWithNpc(npc) {
    const session = gameStorage.session;

    if (npc.npcId === "ustaz") {
      // A. USTAZ ALIF (GURU BAHASA ARAB)
      const mod1Done = session.module1Completed;
      const mod2Done = session.module2Completed;
      const bothDone = mod1Done && mod2Done;

      let dialogLines = [];

      if (!bothDone) {
        dialogLines = [
          {
            text: `“Assalamualaikum, selamat datang ke kelas 1 Gamma, ${this.studentName}!”`
          },
          {
            text: `“Hari ini kita akan belajar angka Arab dan perkataan nombor 1 hingga 10.”`,
            buttons: [
              {
                text: mod1Done ? "SAMBUNG MODUL 2 ▶" : "MULA BELAJAR ▶",
                style: "primary",
                onClick: () => {
                  this.scene.start("LearningScene", { initialModule: mod1Done ? 2 : 1 });
                }
              },
              {
                text: "ULANG KAJI MODUL 1",
                style: "secondary",
                onClick: () => {
                  this.scene.start("LearningScene", { initialModule: 1 });
                }
              }
            ]
          }
        ];
      } else if (session.canteenCompleted && session.fieldCompleted) {
        // Kedua-dua kuiz telah selesai (Syarat Tamat Permainan Terpenuhi)
        dialogLines = [
          {
            text: `“Masha-Allah, tahniah ${this.studentName}! Kamu telah berjaya menyelesaikan pembelajaran dan kedua-dua kuiz di kantin dan padang!”`
          },
          {
            text: `“Kamu adalah Pengembara Nombor Arab Kelas 1 Gamma yang hebat! Mari lihat lencana kejayaan kamu!”`,
            buttons: [
              {
                text: "LIHAT SKRIN TAHNIAH 🏆",
                style: "primary",
                onClick: () => {
                  this.scene.start("CompletionScene");
                }
              },
              {
                text: "ULANG KAJI NOMBOR 📖",
                style: "secondary",
                onClick: () => {
                  this.scene.start("LearningScene", { initialModule: 1 });
                }
              }
            ]
          }
        ];
      } else {
        // Kedua-dua modul telah selesai tetapi kuiz belum selesai
        dialogLines = [
          {
            text: `“Alhamdulillah, tahniah ${this.studentName}! Kamu sudah menguasai nombor Arab 1 hingga 10!”`
          },
          {
            text: `“Kini kamu boleh meneroka sekolah untuk menyelesaikan Kuiz Kantin dan Kuiz Padang. Selesaikan kedua-duanya ya!”`,
            buttons: [
              {
                text: "ULANG KAJI NOMBOR 📖",
                style: "secondary",
                onClick: () => {
                  this.scene.start("LearningScene", { initialModule: 1 });
                }
              },
              {
                text: "TEROKA SEKOLAH 🚶",
                style: "primary"
              }
            ]
          }
        ];
      }

      this.dialogue.startDialogue({
        speaker: "Ustaz Alif",
        avatarClass: "avatar-ustaz",
        lines: dialogLines
      });

    } else if (npc.npcId === "kantin") {
      // B. MAK CIK KANTIN
      const modulesDone = session.module1Completed && session.module2Completed;

      if (!modulesDone) {
        this.dialogue.startDialogue({
          speaker: "Mak Cik Kantin",
          avatarClass: "avatar-kantin",
          lines: [
            {
              text: `“Assalamualaikum ${this.studentName}! Bau karipap dan epal harum kan?”`
            },
            {
              text: `“Sebelum kamu boleh menyertai Misi Pesanan Makanan di sini, mari belajar nombor Arab bersama Ustaz Alif di Kelas 1 Gamma dahulu ya!”`
            }
          ]
        });
      } else {
        const canteenDone = session.canteenCompleted;
        this.dialogue.startDialogue({
          speaker: "Mak Cik Kantin",
          avatarClass: "avatar-kantin",
          lines: [
            {
              text: `“Assalamualaikum ${this.studentName}! Selamat datang ke kaunter pesanan kantin!”`
            },
            {
              text: canteenDone
                ? `“Kamu telah menyelesaikan misi ini dengan markah ${session.canteenScore}/5! Mahu mencuba lagi?”`
                : `“Bantu Mak Cik mengira dan memadankan pesanan makanan dengan nombor Arab ya!”`,
              buttons: [
                {
                  text: canteenDone ? "CUBA LAGI (KUIZ KANTIN) 🥟" : "MULA KUIZ KANTIN 🥟",
                  style: "primary",
                  onClick: () => {
                    this.scene.start("QuizScene", { quizType: "canteen" });
                  }
                },
                {
                  text: "NANTI DAHULU",
                  style: "secondary"
                }
              ]
            }
          ]
        });
      }

    } else if (npc.npcId === "sukan") {
      // C. CIKGU SUKAN
      const modulesDone = session.module1Completed && session.module2Completed;

      if (!modulesDone) {
        this.dialogue.startDialogue({
          speaker: "Cikgu Sukan",
          avatarClass: "avatar-sukan",
          lines: [
            {
              text: `“Priiitt! Hai ${this.studentName}! Semangat betul nampak!”`
            },
            {
              text: `“Padang bersedia untuk aktiviti mengira, tapi pastikan kamu selesaikan pembelajaran bersama Ustaz Alif di Kelas 1 Gamma dahulu ya!”`
            }
          ]
        });
      } else {
        const fieldDone = session.fieldCompleted;
        this.dialogue.startDialogue({
          speaker: "Cikgu Sukan",
          avatarClass: "avatar-sukan",
          lines: [
            {
              text: `“Priiitt! Bagus ${this.studentName}! Padang latihan sukan sedia untuk kamu!”`
            },
            {
              text: fieldDone
                ? `“Rekod padang kamu ialah ${session.fieldScore}/5! Mahu mencuba untuk markah lebih baik?”`
                : `“Misi kamu: kira bilangan bola, kon, dan peralatan sukan dalam Bahasa Arab!”`,
              buttons: [
                {
                  text: fieldDone ? "CUBA LAGI (KUIZ PADANG) ⚽" : "MULA KUIZ PADANG ⚽",
                  style: "primary",
                  onClick: () => {
                    this.scene.start("QuizScene", { quizType: "field" });
                  }
                },
                {
                  text: "NANTI DAHULU",
                  style: "secondary"
                }
              ]
            }
          ]
        });
      }
    }
  }

  // ==========================================
  // HUD (HEADS-UP DISPLAY)
  // ==========================================
  createHUD() {
    let hud = document.getElementById("game-hud");
    if (!hud) {
      hud = document.createElement("div");
      hud.id = "game-hud";
      hud.className = "game-hud-container";
      document.getElementById("game-container").appendChild(hud);
    }
    hud.style.display = "flex";
    this.updateHUD();
  }

  updateHUD() {
    const hud = document.getElementById("game-hud");
    if (!hud) return;

    const s = gameStorage.session;
    const modStatus = s.module1Completed && s.module2Completed ? "✓ Selesai" : s.module1Completed ? "Modul 2" : "Belum Belajar";
    const canteenText = s.canteenCompleted ? `🥟 ${s.canteenScore}/5` : "🥟 Belum";
    const fieldText = s.fieldCompleted ? `⚽ ${s.fieldScore}/5` : "⚽ Belum";
    const syncInfo = sheetsSync.getStatusLabel();

    const isGameDone = s.canteenCompleted && s.fieldCompleted;
    const victoryButtonHtml = isGameDone
      ? `<button id="btn-hud-victory" class="hud-pill" style="background: linear-gradient(135deg, #ffd166, #f77f00); color: #1d3557; cursor: pointer; font-weight: 900; border: 2px solid #ffffff;" title="Buka Skrin Tamat Permainan">🏆 Selesai!</button>`
      : "";

    hud.innerHTML = `
      <div class="hud-left">
        <div class="hud-pill student-info">
          <span class="hud-icon">🎒</span>
          <span class="hud-name">${this.studentName}</span>
          <span class="hud-class">(1 Gamma)</span>
        </div>
        <div class="hud-pill progress-info">
          <span>📖 Belajar: <b>${modStatus}</b></span>
          <span>•</span>
          <span>Kantin: <b>${canteenText}</b></span>
          <span>•</span>
          <span>Padang: <b>${fieldText}</b></span>
        </div>
      </div>

      <div class="hud-right">
        ${victoryButtonHtml}
        <div class="hud-pill ${syncInfo.class}" id="hud-sync-pill" title="Status Google Sheets">
          <span>${syncInfo.icon}</span>
          <span id="hud-sync-text">${syncInfo.text}</span>
        </div>
        <button id="btn-sound-toggle" class="hud-btn" title="Kesan Bunyi">
          ${audioSystem.muted ? "🔇" : "🔊"}
        </button>
      </div>
    `;

    const victoryBtn = document.getElementById("btn-hud-victory");
    if (victoryBtn) {
      victoryBtn.onclick = () => {
        audioSystem.playClick();
        this.scene.start("CompletionScene");
      };
    }

    const soundBtn = document.getElementById("btn-sound-toggle");
    if (soundBtn) {
      soundBtn.onclick = () => {
        const isMuted = audioSystem.toggleMute();
        soundBtn.textContent = isMuted ? "🔇" : "🔊";
      };
    }

    const syncPill = document.getElementById("hud-sync-pill");
    if (syncPill) {
      syncPill.onclick = () => {
        sheetsSync.sync();
      };
    }
  }

  updateHudSyncStatus() {
    const syncText = document.getElementById("hud-sync-text");
    const syncPill = document.getElementById("hud-sync-pill");
    if (syncText && syncPill) {
      const info = sheetsSync.getStatusLabel();
      syncText.textContent = info.text;
      syncPill.className = `hud-pill ${info.class}`;
    }
  }

  showWelcomeHint() {
    const session = gameStorage.session;
    if (!session.module1Completed) {
      // Petunjuk ringkas
      const hint = document.createElement("div");
      hint.className = "game-toast-hint";
      hint.innerHTML = `
        <span class="toast-icon">💡</span>
        <span>Dekati <b>Ustaz Alif</b> di hadapan kelas dan tekan <b>E</b> untuk mula belajar!</span>
      `;
      document.getElementById("game-container").appendChild(hint);
      setTimeout(() => {
        hint.classList.add("fade-out");
        setTimeout(() => hint.remove(), 600);
      }, 4000);
    }
  }
}
