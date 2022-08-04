import { Layer } from "./layer.js";
import { Loop } from "./loop.js";
import { Cell } from "./cell.js";
import { KeyboardControls } from "./keyboard-controls.js";

const cfg = {
  cellWidth: 120,
  cellHeight: 30,
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

function drawRectByPath(ctx, x, y, width, height, color) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineWidth = 2;
  ctx.lineTo(width, y);
  ctx.lineTo(width, height);
  ctx.lineTo(x, height);

  ctx.strokeStyle = color;
  ctx.stroke();
  ctx.closePath();
}

//     function clearRect(x, y, width, height) {
//       ctx.clearRect(x, y, width, height);
//     }

//     function drawText(text, x, y, color) {
//       ctx.fillStyle = color;
//       ctx.font = '14px serif';

//       const textWidth = ctx.measureText(text);

//       ctx.fillText(text, x, y);
//     }

//     function addInput(x, y) {
//       var input = document.createElement('input');

//       input.type = 'text';
//       input.style.position = 'fixed';
//       input.style.left = `${x}px`;
//       input.style.top = `${y}px`;
//       input.style.height = `${cfg.cellHeight}px`;
//       input.style.width = `${cfg.cellWidth}px`;

//       document.body.appendChild(input);
//     }

//     function moveInput(x, y) {
//       var input = document.querySelector('input');

//       input.style.left = `${x}px`;
//       input.style.top = `${y}px`;

//       input.focus();

//       return input;
//     }

//     class Loop {
//       update() {
// for (let i = 0; i < cells.length; i++) {
//   const cell = cells[i];
//   ctx.fillStyle = 'white';
//   // ctx.fill();

//   drawRect(cell.x, cell.y, cell.width, cell.height, cell.backgroundColor);
//   drawText(cell.text, cell.x + 4, cell.y + cell.height / 2, 'black');

//   if (cell.x < mouseX && cell.y < mouseY && (cell.x + cell.width > mouseX) && (cell.y + cell.height > mouseY)) {
//     drawFillRect(cell.x, cell.y, cell.width, cell.height, '#607EAA');
//     drawText(cell.text, cell.x + 4, cell.y + cell.height / 2, 'white');
//     if (mouseType === 'click') {
//       const input = moveInput(cell.x, cell.y);
//       input.value = cell.text;
//       input.onkeydown = (e) => {
//         setTimeout(() => {
//           cell.text = e.target.value;

//         }, 0);
//       }
//     }
//   }

// }
//       }
//     }

//     addInput(-1000, -1000);
//   }
// })();

class App {
  constructor(container) {
    this.layer = new Layer(container);
    this.keyboardControls = new KeyboardControls([
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "Tab",
      "ShiftLeft",
    ]);

    this.columns = 5;
    this.rows = 10;

    new Loop(this.update.bind(this), this.draw.bind(this));

    this.grid = generateGrid(this.columns, this.rows);
    this.cells = this.generateCells();

    this.border = {
      x: 1,
      y: 1,
      width: cfg.cellWidth - 1,
      height: cfg.cellHeight - 1,
      colIndex: 0,
      rowIndex: 0,
    };
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
            colIndex,
            rowIndex
          )
        );
      }
    }

    return cells;
  }

  update(correction) {
    if (
      this.keyboardControls.keys.ArrowRight &&
      this.border.colIndex < this.columns - 1
    ) {
      this.border.x += this.border.width * correction;
    }
    if (this.keyboardControls.keys.ArrowLeft) {
      this.border.x -= this.border.width * correction;
    }
    if (this.keyboardControls.keys.ArrowDown) {
      this.border.y += this.border.height * correction;
    }

    if (this.keyboardControls.keys.ArrowUp) {
      this.border.y -= this.border.height * correction;
    }
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
