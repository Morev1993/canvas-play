import { Layer } from "./layer.js";
import { Loop } from "./loop.js";
import { Cell } from "./cell.js";
import { KeyboardControls } from "./keyboard-controls.js";
import { MouseControls } from "./mouse-controls.js";

const cfg = {
  cellWidth: 120,
  cellHeight: 24,
};

function generateGrid(columns, rows) {
  return [...Array(rows).keys()].map(() =>
    [...Array(columns).keys()].map((x) => x++)
  );
}
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

function drawText(ctx, text, x, y, color) {
  ctx.fillStyle = color;
  ctx.font = "14px arial serif";

  ctx.fillText(text, x, y);
}

function addInput(container, x, y) {
  var input = document.createElement("input");

  input.type = "text";
  input.style.position = "fixed";
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

    this.border = {
      x: 1,
      y: 1,
      width: cfg.cellWidth - 1,
      height: cfg.cellHeight - 1,
      colIndex: 0,
      rowIndex: 0,
    };

    this.columns = 4;
    this.rows = 10;

    this.grid = generateGrid(this.columns, this.rows);
    this.cells = this.generateCells();

    this.keyboardControls = new KeyboardControls(
      ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Tab", "ShiftLeft"],
      () => {
        if (
          this.keyboardControls.keys.ArrowRight &&
          this.border.x < cfg.cellWidth * this.columns - this.border.width
        ) {
          this.border.x += this.border.width + 1;
          this.border.colIndex++;
        }

        if (this.keyboardControls.keys.ArrowLeft && this.border.x > 1) {
          this.border.x -= this.border.width + 1;
          this.border.colIndex--;
        }

        if (
          this.keyboardControls.keys.ArrowDown &&
          this.border.y < cfg.cellHeight * this.rows - this.border.height
        ) {
          this.border.y += this.border.height + 1;
          this.border.rowIndex++;
        }

        if (this.keyboardControls.keys.ArrowUp && this.border.y > 1) {
          this.border.y -= this.border.height + 1;
          this.border.rowIndex--;
        }

        const rect = container.getBoundingClientRect();

        const target = this.cells.find(
          (cell) =>
            this.border.colIndex === cell.colIndex &&
            this.border.rowIndex === cell.rowIndex
        );

        const input = moveInput(
          this.border.x + rect.left,
          this.border.y + rect.top,
          target && target.text
        );

        input.onkeydown = () => {
          setTimeout(() => {
            this.cells.forEach((cell) => {
              if (
                this.border.colIndex === cell.colIndex &&
                this.border.rowIndex === cell.rowIndex
              ) {
                cell.text = input.value;
              }
            });
          });
        };

        console.log(this.border);
        console.log(rect);
      }
    );

    this.mouseControls = new MouseControls(container, () => {
      this.cells.forEach((cell) => {
        if (
          this.mouseControls.pos.x > cell.x &&
          this.mouseControls.pos.y > cell.y &&
          this.mouseControls.pos.x < cell.x + cell.width &&
          this.mouseControls.pos.y < cell.y + cell.height
        ) {
          console.log(cell);
          this.border.x = cell.x + 1;
          this.border.y = cell.y + 1;
          this.border.colIndex = cell.colIndex;
          this.border.rowIndex = cell.rowIndex;
          const rect = container.getBoundingClientRect();

          moveInput(
            this.border.x + rect.left,
            this.border.y + rect.top,
            cell.text
          );
        }
      });
    });

    new Loop(this.update.bind(this), this.draw.bind(this));

    this.input = addInput(container, -1000, -1000);
  }

  generateCells() {
    const cells = [];

    for (let rowIndex = 0; rowIndex < this.grid.length; rowIndex++) {
      for (
        let colIndex = 0;
        colIndex < this.grid[rowIndex].length;
        colIndex++
      ) {
        cells.push(
          new Cell(
            colIndex * cfg.cellWidth,
            rowIndex * cfg.cellHeight,
            cfg.cellWidth,
            cfg.cellHeight,
            colIndex + "_" + rowIndex,
            colIndex,
            rowIndex
          )
        );
      }
    }

    return cells;
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

  indexToPos(colIndex, rowIndex) {
    return { x: colIndex * cfg.cellWidth, y: rowIndex * cfg.cellHeight };
  }

  drawGrid() {
    for (let i = 0; i < this.cells.length; i++) {
      const cell = this.cells[i];
      this.layer.context.fillStyle = "white";

      this.layer.context.fillStyle = "#E2E3E3";
      this.layer.context.fillRect(cell.x, cell.y, cell.width, cell.height);

      this.layer.context.fillStyle = "white";
      this.layer.context.fillRect(
        cell.x + 1,
        cell.y + 1,
        cell.width,
        cell.height
      );

      drawText(
        this.layer.context,
        cell.text,
        cell.x + 1,
        cell.y + cell.height / 2 + 6,
        "black"
      );
    }
  }

  draw() {
    this.layer.context.clearRect(0, 0, this.layer.w, this.layer.h);

    this.drawGrid();

    this.layer.context.strokeStyle = "#2376E5";
    this.layer.context.strokeRect(
      this.border.x,
      this.border.y,
      this.border.width,
      this.border.height
    );
  }
}

onload = () => {
  new App(document.querySelector(".container"));
};
