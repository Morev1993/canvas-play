import { Layer } from "./layer.js";
import { Loop } from "./loop.js";
import { KeyboardControls } from "./keyboard-controls.js";
import { MouseControls } from "./mouse-controls.js";
import { ScrollControls } from "./scroll-controls.js";
import { Grid } from "./grid.js";
import { VirtualScroller } from "./virtual-scroller.js";

import { cfg } from "./config/config.js";

// function scaleByDpi() {
//   // Get the DPR and size of the canvas
//   const dpr = window.devicePixelRatio;
//   const rect = canvas.getBoundingClientRect();

//   // Set the "actual" size of the canvas
//   canvas.width = rect.width * dpr;
//   canvas.height = rect.height * dpr;

//   // Scale the context to ensure correct drawing operations
//   ctx.scale(dpr, dpr);

//   // Set the "drawn" size of the canvas
// canvas.style.width = `${rect.width}px`;
// canvas.style.height = `${rect.height}px`;
// }

class App {
  constructor(container) {
    this.layer = new Layer(container);

    this.scrollControls = new ScrollControls(
      document.querySelector(".wrapper")
    );

    this.mouseControls = new MouseControls(container, () => {
      if (!this.mouseControls.down) {
        this.grid.autofill.dragStart = false;
      } else {
        this.grid.select(this.mouseControls.pos.x, this.mouseControls.pos.y);
      }
    });

    this.virtualScroller = new VirtualScroller(
      document.querySelector(".container"),
      this.scrollControls,
      cfg.columns,
      cfg.rows
    );

    this.grid = new Grid(this.layer, this.virtualScroller, this.mouseControls);

    this.scrollControls.listen(() => {
      this.grid.updateByScroll();
    });

    this.keyboardControls = new KeyboardControls(
      ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Tab", "ShiftLeft"],
      () => {
        if (
          this.keyboardControls.keys.ArrowRight ||
          (this.keyboardControls.keys.Tab &&
            !this.keyboardControls.keys.ShiftLeft)
        ) {
          this.grid.moveRight();
        }

        if (
          this.keyboardControls.keys.ArrowLeft ||
          (this.keyboardControls.keys.Tab &&
            this.keyboardControls.keys.ShiftLeft)
        ) {
          this.grid.moveLeft();
        }

        if (this.keyboardControls.keys.ArrowDown) {
          this.grid.moveDown();
        }

        if (this.keyboardControls.keys.ArrowUp) {
          this.grid.moveUp();
        }
      }
    );

    new Loop(this.update.bind(this), this.draw.bind(this));
  }

  update() {
    this.grid.update();
  }

  draw() {
    this.layer.context.clearRect(0, 0, this.layer.w, this.layer.h);

    this.grid.draw();
  }
}

onload = () => {
  new App(document.querySelector(".canvas-container"));
};
