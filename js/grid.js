import { Cell } from "./cell.js";
import { drawText } from "./utils.js";
import { cfg } from "./config/config.js";

export class Grid {
  constructor(layer, virtualScroller) {
    this.layer = layer;
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
  }

  moveRight() {
    const scrollStep = this.border.width * 3;
    this.border.colIndex++;

    this.border.x = this.visibleColIndex() * cfg.cellWidth + 1;

    if (this.visibleColIndex() === this.viewportLengthX()) {
      this.virtualScroller.viewport.scrollTo(
        this.virtualScroller.x + scrollStep,
        this.virtualScroller.y
      );
    }
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
  }
}
