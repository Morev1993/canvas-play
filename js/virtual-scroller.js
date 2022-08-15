import { cfg } from "./config/config.js";

export class VirtualScroller {
  constructor(container, scrollControls, columns, rows) {
    this.container = container;

    this.scrollControls = scrollControls;

    this.viewport = this.scrollControls.container;

    const scrollContainer = container;

    scrollContainer.style.width = `${cfg.cellWidth * columns}px`;
    scrollContainer.style.height = `${cfg.cellHeight * rows}px`;
  }

  get x() {
    return this.scrollControls.scrollPos.x;
  }

  get y() {
    return this.scrollControls.scrollPos.y;
  }

  scrollIndexY() {
    return Math.floor(this.scrollControls.scrollPos.y / cfg.cellHeight);
  }

  scrollIndexX() {
    return Math.floor(this.scrollControls.scrollPos.x / cfg.cellWidth);
  }

  viewportLengthY() {
    return Math.floor(this.viewport.clientHeight / cfg.cellHeight);
  }

  viewportLengthX() {
    return Math.floor(this.viewport.clientWidth / cfg.cellWidth);
  }
}
