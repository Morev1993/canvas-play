import { Cell } from "./cell.js";
import { Autofill } from "./autofill.js";
import { Input } from "./input.js";
import { Selection } from "./selection.js";

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

    this.autofill = new Autofill(
      this.border.x + this.border.width - 3,
      this.border.y + this.border.height - 3,
      6,
      6,
      this.layer
    );
    this.selection = new Selection(this.layer.container);

    const target = this.renderableCells.find(
      (cell) =>
        this.border.colIndex === cell.colIndex &&
        this.border.rowIndex === cell.rowIndex
    );

    this.input = new Input(
      this.border.x,
      this.border.y,
      target && target.text,
      this.layer.container
    );
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

    this.updateControls();
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

    this.updateControls();
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

    this.updateControls();
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
    this.updateControls();
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

    this.updateControls();
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

    this.updateControls();
  }

  updateControls() {
    this.autofill.cover = {};

    this.autofill.changePosition(
      this.border.x + this.border.width - 3,
      this.border.y + this.border.height - 3
    );

    const target = this.renderableCells.find(
      (cell) =>
        this.border.colIndex === cell.colIndex &&
        this.border.rowIndex === cell.rowIndex
    );

    this.input.changePosition(
      this.border.x,
      this.border.y,
      target && target.text
    );

    this.input.element.onkeydown = (e) => {
      setTimeout(() => {
        this.renderableCells.forEach((cell) => {
          if (
            this.border.colIndex === cell.colIndex &&
            this.border.rowIndex === cell.rowIndex
          ) {
            cell.text = this.input.element.value;
          }
        });
      });
    };

    this.selection.remove();
  }

  generateGrid(columns, rows) {
    return [...Array(rows).keys()].map(() =>
      [...Array(columns).keys()].map((x) => x++)
    );
  }

  update() {
    const yStart = this.border.y + this.border.height;
    const yEnd = this.mouseControls.pos.y - yStart;

    this.autofill.cover = {
      xLeft: this.border.x,
      xRight: this.border.x + this.border.width,
      yStart: yStart,
      yEnd:
        yStart +
        Math.round(yEnd / this.border.height) * (this.border.height + 1),
    };
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
    this.layer.context.setLineDash([]);
    this.layer.context.strokeRect(
      this.border.x,
      this.border.y,
      this.border.width,
      this.border.height
    );

    if (this.autofill.dragStart) {
      this.autofill.drawStart();
    } else {
      console.log(this.autofill.cover.yEnd);
      this.autofill.drawEnd();

      const lastIndex =
        (this.autofill.cover.yEnd - this.autofill.cover.yStart) /
        this.border.height;

      this.renderableCells
        .filter((cell) => {
          return (
            cell.colIndex === this.border.colIndex &&
            cell.rowIndex > this.border.rowIndex &&
            cell.rowIndex < this.border.rowIndex + lastIndex
          );
        })
        .forEach((cell) => {
          cell.text = this.input.element.value;
        });

      this.selection.setBounds(
        this.autofill.cover.xLeft,
        this.autofill.cover.yStart,
        this.autofill.cover.xRight - this.autofill.cover.xLeft,
        this.autofill.cover.yEnd - this.autofill.cover.yStart
      );
    }

    this.autofill.draw();
    this.selection.draw();
  }
}
