/**
 * BootScene: Memuatkan enjin grafik pixel art dan animasi watak
 */

import { PixelGraphicsEngine } from "../systems/pixelGraphics.js";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  create() {
    // 1. Jana semua tekstur pixel art secara prosedur
    const gfx = new PixelGraphicsEngine(this);
    gfx.generateAll();

    // 2. Cipta animasi Phaser untuk watak murid (4 arah pergerakan)
    this.anims.create({
      key: "player_walk_down",
      frames: this.anims.generateFrameNumbers("player", { start: 0, end: 2 }),
      frameRate: 8,
      repeat: -1
    });

    this.anims.create({
      key: "player_idle_down",
      frames: [{ key: "player", frame: 1 }],
      frameRate: 1
    });

    this.anims.create({
      key: "player_walk_left",
      frames: this.anims.generateFrameNumbers("player", { start: 3, end: 5 }),
      frameRate: 8,
      repeat: -1
    });

    this.anims.create({
      key: "player_idle_left",
      frames: [{ key: "player", frame: 4 }],
      frameRate: 1
    });

    this.anims.create({
      key: "player_walk_right",
      frames: this.anims.generateFrameNumbers("player", { start: 6, end: 8 }),
      frameRate: 8,
      repeat: -1
    });

    this.anims.create({
      key: "player_idle_right",
      frames: [{ key: "player", frame: 7 }],
      frameRate: 1
    });

    this.anims.create({
      key: "player_walk_up",
      frames: this.anims.generateFrameNumbers("player", { start: 9, end: 11 }),
      frameRate: 8,
      repeat: -1
    });

    this.anims.create({
      key: "player_idle_up",
      frames: [{ key: "player", frame: 10 }],
      frameRate: 1
    });

    // Animasi NPC Ustaz Alif bernafas/idle
    this.anims.create({
      key: "ustaz_idle",
      frames: this.anims.generateFrameNumbers("npc_ustaz", { start: 0, end: 1 }),
      frameRate: 2,
      repeat: -1
    });

    // Animasi NPC Mak Cik Kantin
    this.anims.create({
      key: "kantin_idle",
      frames: this.anims.generateFrameNumbers("npc_kantin", { start: 0, end: 1 }),
      frameRate: 2,
      repeat: -1
    });

    // Animasi NPC Cikgu Sukan
    this.anims.create({
      key: "sukan_idle",
      frames: this.anims.generateFrameNumbers("npc_sukan", { start: 0, end: 1 }),
      frameRate: 2,
      repeat: -1
    });

    // Beralih ke skrin kemasukan nama
    this.scene.start("NameEntryScene");
  }
}
