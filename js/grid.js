import { Cell } from "./cell.js";
import { Autofill } from "./autofill.js";

import { drawText } from "./utils.js";
import { cfg } from "./config/config.js";

export class Grid {
  constructor(layer, virtualScroller, mouseControls) {
    this.layer = layer;
    this.mouseControls = mouseControls;
    this.virtualScroller = virtualScroller;

    this.border = {
      x: 1,
      y: 1,
      width: cfg.cellWidth - 1,
      height: cfg.cellHeight - 1,
      colIndex: 0,
      rowIndex: 0,
    };

    this.columns = cfg.columns;
    this.rows = cfg.rows;

    this.grid = this.generateGrid(this.columns, this.rows);
    this.cells = this.generateCells();
    this.renderableCells = this.cells;

    this.autofillX = this.border.x + this.border.width - 3;
    this.autofillY = this.border.y + this.border.height - 3;

    this.autofill = new Autofill(6, 6, this.virtualScroller.container);
  }

  moveRight() {
    if (this.border.colIndex === this.columns - 1) {
      return;
    }

    const scrollStep = this.border.width * 3;
    this.border.colIndex++;

    this.border.x = this.visibleColIndex() * cfg.cellWidth + 1;

    if (this.visibleColIndex() === this.virtualScroller.viewportLengthX()) {
      this.virtualScroller.viewport.scrollTo(
        this.virtualScroller.x + scrollStep,
        this.virtualScroller.y
      );
    }

    this.updateAutofillPosition();
  }

  moveLeft() {
    if (this.border.colIndex === 0) {
      return;
    }

    const scrollStep = this.border.width * 3;
    this.border.colIndex--;

    this.border.x = this.visibleColIndex() * cfg.cellWidth + 1;

    if (this.visibleColIndex() === 0) {
      this.virtualScroller.viewport.scrollTo(
        this.virtualScroller.x - scrollStep,
        this.virtualScroller.y
      );
    }

    this.updateAutofillPosition();
  }

  moveUp() {
    if (this.border.rowIndex === 0) {
      return;
    }

    const scrollStep = this.border.height * 3;
    this.border.rowIndex--;

    this.border.y = this.visibleRowIndex() * cfg.cellHeight + 1;

    if (this.visibleRowIndex() === 0) {
      this.virtualScroller.viewport.scrollTo(
        this.virtualScroller.x,
        this.virtualScroller.y - scrollStep
      );
    }

    this.updateAutofillPosition();
  }

  moveDown() {
    if (this.border.rowIndex === this.rows - 1) {
      return;
    }

    const scrollStep = this.border.height * 3;
    this.border.rowIndex++;

    this.border.y = this.visibleRowIndex() * cfg.cellHeight + 1;

    if (this.visibleRowIndex() === this.virtualScroller.viewportLengthY()) {
      this.virtualScroller.viewport.scrollTo(
        this.virtualScroller.x,
        this.virtualScroller.y + scrollStep
      );
    }
    this.updateAutofillPosition();
  }

  select(x, y) {
    const target = this.renderableCells.find((cell) => {
      return (
        x > cell.x &&
        y > cell.y &&
        x < cell.x + cell.width &&
        y < cell.y + cell.height
      );
    });

    if (target) {
      this.border.colIndex = target.colIndex;
      this.border.rowIndex = target.rowIndex;

      this.border.x = this.visibleColIndex() * cfg.cellWidth + 1;
      this.border.y = this.visibleRowIndex() * cfg.cellHeight + 1;
    }

    this.updateAutofillPosition();

    // const rect = container.getBoundingClientRect();

    // moveInput(
    //   this.border.x + rect.left,
    //   this.border.y + rect.top,
    //   cell.text
    // );
  }

  visibleColIndex() {
    return this.border.colIndex - this.virtualScroller.scrollIndexX();
  }

  visibleRowIndex() {
    return this.border.rowIndex - this.virtualScroller.scrollIndexY();
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

  updateByScroll() {
    this.renderableCells = this.cells.filter((cell) => {
      return (
        cell.rowIndex >= this.virtualScroller.scrollIndexY() &&
        cell.rowIndex <=
          this.virtualScroller.scrollIndexY() +
            this.virtualScroller.viewportLengthY() &&
        cell.colIndex >= this.virtualScroller.scrollIndexX() &&
        cell.colIndex <=
          this.virtualScroller.scrollIndexX() +
            this.virtualScroller.viewportLengthX()
      );
    });

    this.renderableCells.forEach((cell) => {
      cell.y =
        (cell.rowIndex - this.virtualScroller.scrollIndexY()) * cell.height;
      cell.x =
        (cell.colIndex - this.virtualScroller.scrollIndexX()) * cell.width;
    });

    this.border.y = this.visibleRowIndex() * cfg.cellHeight + 1;
    this.border.x = this.visibleColIndex() * cfg.cellWidth + 1;

    this.updateAutofillPosition();
  }

  updateAutofillPosition() {
    this.autofillX = this.border.x + this.border.width - 3;
    this.autofillY = this.border.y + this.border.height - 3;
  }

  generateGrid(columns, rows) {
    return [...Array(rows).keys()].map(() =>
      [...Array(columns).keys()].map((x) => x++)
    );
  }

  draw() {
    for (let i = 0; i < this.renderableCells.length; i++) {
      const cell = this.renderableCells[i];
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

    this.layer.context.strokeStyle = "#2376E5";
    this.layer.context.strokeRect(
      this.border.x,
      this.border.y,
      this.border.width,
      this.border.height
    );

    if (this.autofill.dragStart) {
      const xLeft = this.border.x;
      const xRight = this.border.x + this.border.width;

      const yStart = this.border.y + this.border.height;
      const yEnd = this.mouseControls.pos.y - yStart;

      const y =
        yStart +
        Math.round(yEnd / this.border.height) * (this.border.height + 1);

      this.layer.context.beginPath();
      this.layer.context.setLineDash([4, 6]);
      this.layer.context.moveTo(xLeft, yStart);
      this.layer.context.lineTo(xLeft, y);
      this.layer.context.strokeStyle = "black";
      this.layer.context.stroke();

      this.layer.context.beginPath();
      this.layer.context.setLineDash([4, 6]);
      this.layer.context.moveTo(xRight, yStart);
      this.layer.context.lineTo(xRight, y);
      this.layer.context.strokeStyle = "black";
      this.layer.context.stroke();

      this.layer.context.beginPath();
      this.layer.context.setLineDash([4, 6]);
      this.layer.context.moveTo(xLeft, y);
      this.layer.context.lineTo(xRight, y);
      this.layer.context.strokeStyle = "black";
      this.layer.context.stroke();

      this.autofillX = xRight - 3;
      this.autofillY = y - 3;
    }

    this.autofill.changePosition(this.autofillX, this.autofillY);
  }
}
