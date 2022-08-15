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

function addInput(container, x, y) {
  var input = document.createElement("input");

  input.type = "text";
  input.style.position = "absolute";
  input.style.left = `${x}px`;
  input.style.top = `${y}px`;
  input.style.height = `${cfg.cellHeight + 1}px`;
  input.style.width = `${cfg.cellWidth + 1}px`;

  container.appendChild(input);
}

function moveInput(x, y, text) {
  var input = document.querySelector("input");

  input.style.left = `${x - 1}px`;
  input.style.top = `${y - 1}px`;
  input.value = text;

  input.focus();

  return input;
}

class App {
  constructor(container) {
    this.layer = new Layer(container);

    this.scrollControls = new ScrollControls(
      document.querySelector(".wrapper")
    );

    this.mouseControls = new MouseControls(container, () => {
      if (!this.mouseControls.down) {
        this.grid.autofill.dragStart = false;
        console.log(this.grid.autofill.dragStart);
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
        // const rect = container.getBoundingClientRect();
        // const target = this.grid.cells.find(
        //   (cell) =>
        //     this.border.colIndex === cell.colIndex &&
        //     this.border.rowIndex === cell.rowIndex
        // );
        // const input = moveInput(
        //   this.border.x + rect.left,
        //   this.border.y + rect.top,
        //   target && target.text
        // );
        // input.onkeydown = () => {
        //   setTimeout(() => {
        //     this.grid.cells.forEach((cell) => {
        //       if (
        //         this.border.colIndex === cell.colIndex &&
        //         this.border.rowIndex === cell.rowIndex
        //       ) {
        //         cell.text = input.value;
        //       }
        //     });
        //   });
        // };
      }
    );

    new Loop(this.update.bind(this), this.draw.bind(this));

    // addInput(container, -1000, -1000);
  }

  update(correction) {
    // if (
    //   this.keyboardControls.keys.ArrowRight &&
    //   this.border.colIndex < this.columns - 1
    // ) {
    //   this.border.x += this.border.width * correction * 8;
    // }
    // if (this.keyboardControls.keys.ArrowLeft) {
    //   this.border.x -= this.border.width * correction;
    // }
    // if (this.keyboardControls.keys.ArrowDown) {
    //   this.border.y += this.border.height * correction;
    // }
    // if (this.keyboardControls.keys.ArrowUp) {
    //   this.border.y -= this.border.height * correction;
    // }
  }

  draw() {
    this.layer.context.clearRect(0, 0, this.layer.w, this.layer.h);

    this.grid.draw();
  }
}

onload = () => {
  new App(document.querySelector(".canvas-container"));
};
