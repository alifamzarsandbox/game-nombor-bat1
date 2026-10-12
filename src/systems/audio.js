/**
 * Sistem Audio Sintesis Web Audio API
 * Menghasilkan kesan bunyi retro 8-bit / 16-bit tanpa memerlukan fail audio luar
 */

export class AudioManager {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.isInitialized = false;
  }

  /**
   * Buka AudioContext selepas interaksi pertama pengguna
   */
  init() {
    if (this.isInitialized) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
        this.isInitialized = true;
      }
    } catch (e) {
      console.warn("Web Audio API tidak disokong:", e);
    }
  }

  resumeIfNeeded() {
    this.init();
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  /**
   * Bunyi klik butang / navigasi
   */
  playClick() {
    if (this.muted) return;
    this.resumeIfNeeded();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(900, now + 0.06);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch (e) {}
  }

  /**
   * Bunyi interaksi NPC / dialog
   */
  playInteract() {
    if (this.muted) return;
    this.resumeIfNeeded();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      [440, 660].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "triangle";
        const t = now + i * 0.06;
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.07);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.07);
      });
    } catch (e) {}
  }

  /**
   * Bunyi jawapan betul (Arpeggio ceria melodi)
   */
  playCorrect() {
    if (this.muted) return;
    this.resumeIfNeeded();
    if (!this.ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      const now = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sine";
        const startTime = now + idx * 0.08;
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.25, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.15);
      });
    } catch (e) {}
  }

  /**
   * Bunyi jawapan salah (Cuba lagi yang mesra dan tidak menakutkan)
   */
  playWrong() {
    if (this.muted) return;
    this.resumeIfNeeded();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(240, now + 0.18);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.18);
    } catch (e) {}
  }

  /**
   * Fanfare Kemenangan Tamat Permainan (Merdu & Bersemangat)
   */
  playFanfare() {
    if (this.muted) return;
    this.resumeIfNeeded();
    if (!this.ctx) return;

    try {
      const fanfareNotes = [
        { f: 523.25, d: 0.12 }, // C
        { f: 523.25, d: 0.12 }, // C
        { f: 523.25, d: 0.12 }, // C
        { f: 659.25, d: 0.35 }, // E
        { f: 783.99, d: 0.35 }, // G
        { f: 1046.5, d: 0.6 }   // C6
      ];

      const now = this.ctx.currentTime;
      let cur = now;

      fanfareNotes.forEach((note) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(note.f, cur);

        gain.gain.setValueAtTime(0.3, cur);
        gain.gain.exponentialRampToValueAtTime(0.01, cur + note.d);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(cur);
        osc.stop(cur + note.d);
        cur += note.d + 0.04;
      });
    } catch (e) {}
  }
}

export const audioSystem = new AudioManager();
