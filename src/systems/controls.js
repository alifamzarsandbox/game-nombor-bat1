/**
 * Sistem Kawalan Input
 * Menyokong Papan Kekunci (WASD / Anak Panah / E / Enter / Esc)
 * dan Kawalan Skrin Sentuh Maya (D-Pad & Butang Interaksi)
 */

export class InputController {
  constructor(scene) {
    this.scene = scene;
    this.moveVector = { x: 0, y: 0 };
    this.interactPressed = false;
    this.interactJustPressed = false;
    this.isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    this.virtualKeys = {
      up: false,
      down: false,
      left: false,
      right: false,
      action: false
    };

    this.setupKeyboard();
    this.setupVirtualControlsDOM();
  }

  setupKeyboard() {
    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.keyW = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyA = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyS = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keyD = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keyE = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this.keyEnter = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.keySpace = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.keyEsc = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
  }

  setupVirtualControlsDOM() {
    let container = document.getElementById("virtual-controls");
    if (!container) return;

    // Paparkan jika sentuhan atau skrin kecil
    if (this.isTouchDevice || window.innerWidth <= 1024) {
      container.style.display = "block";
    }

    const bindTouch = (elemId, keyName) => {
      const el = document.getElementById(elemId);
      if (!el) return;

      const handlePress = (e) => {
        e.preventDefault();
        this.virtualKeys[keyName] = true;
        el.classList.add("active");
      };

      const handleRelease = (e) => {
        e.preventDefault();
        this.virtualKeys[keyName] = false;
        el.classList.remove("active");
      };

      el.addEventListener("pointerdown", handlePress);
      el.addEventListener("pointerup", handleRelease);
      el.addEventListener("pointercancel", handleRelease);
      el.addEventListener("pointerleave", handleRelease);
    };

    bindTouch("btn-dpad-up", "up");
    bindTouch("btn-dpad-down", "down");
    bindTouch("btn-dpad-left", "left");
    bindTouch("btn-dpad-right", "right");
    bindTouch("btn-action-interact", "action");
  }

  update() {
    // 1. Arah Pergerakan X
    let vx = 0;
    if (
      this.cursors.left.isDown ||
      this.keyA.isDown ||
      this.virtualKeys.left
    ) {
      vx -= 1;
    }
    if (
      this.cursors.right.isDown ||
      this.keyD.isDown ||
      this.virtualKeys.right
    ) {
      vx += 1;
    }

    // 2. Arah Pergerakan Y
    let vy = 0;
    if (
      this.cursors.up.isDown ||
      this.keyW.isDown ||
      this.virtualKeys.up
    ) {
      vy -= 1;
    }
    if (
      this.cursors.down.isDown ||
      this.keyS.isDown ||
      this.virtualKeys.down
    ) {
      vy += 1;
    }

    // Normalisasi vektor jika bergerak secara pepenjuru
    if (vx !== 0 && vy !== 0) {
      vx *= 0.7071;
      vy *= 0.7071;
    }

    this.moveVector.x = vx;
    this.moveVector.y = vy;

    // 3. Interaksi (E / Enter / Space / Butang Sentuh)
    const isActionDown =
      this.keyE.isDown ||
      this.keyEnter.isDown ||
      this.keySpace.isDown ||
      this.virtualKeys.action;

    this.interactJustPressed = isActionDown && !this.interactPressed;
    this.interactPressed = isActionDown;
  }

  isEscapeJustPressed() {
    return Phaser.Input.Keyboard.JustDown(this.keyEsc);
  }

  hideVirtualControls() {
    const container = document.getElementById("virtual-controls");
    if (container) container.style.display = "none";
  }

  showVirtualControls() {
    const container = document.getElementById("virtual-controls");
    if (container && (this.isTouchDevice || window.innerWidth <= 1024)) {
      container.style.display = "block";
    }
  }

  destroy() {
    // Bersihkan rujukan
  }
}
