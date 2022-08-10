import { cfg } from "./config/config.js";

export class VirtualScroller {
  constructor(container, scrollControls, columns, rows) {
    this.scrollControls = scrollControls;
    this.x = this.scrollControls.scrollPos.x;
    this.y = this.scrollControls.scrollPos.y;

    this.viewport = this.scrollControls.container;

    const scrollContainer = container;

    scrollContainer.style.width = `${cfg.cellWidth * columns}px`;
    scrollContainer.style.height = `${cfg.cellHeight * rows}px`;
  }

  scrollIndexY() {
    return Math.floor(this.scrollControls.scrollPos.y / cfg.cellHeight);
  }

  scrollIndexX() {
    return Math.floor(this.scrollControls.scrollPos.x / cfg.cellWidth);
  }

  viewportLengthY() {
    return this.viewport.clientHeight / cfg.cellHeight;
  }

  viewportLengthX() {
    return Math.floor(this.viewport.clientWidth / cfg.cellWidth);
  }
}
