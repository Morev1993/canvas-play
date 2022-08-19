import { cfg } from "./config/config.js";

export class Input {
  constructor(x, y, text, container) {
    this.element = document.createElement("input");

    this.element.type = "text";
    this.element.style.position = "absolute";
    this.element.style.left = `${x}px`;
    this.element.style.top = `${y}px`;
    this.element.style.height = `${cfg.cellHeight + 1}px`;
    this.element.style.width = `${cfg.cellWidth + 1}px`;
    this.element.classList.add("input");
    this.element.value = text;

    container.appendChild(this.element);
  }

  changePosition(x, y, text) {
    this.element.style.left = `${x - 1}px`;
    this.element.style.top = `${y - 1}px`;
    this.element.value = text;

    setTimeout(() => {
      this.element.focus();
    })

  }
}
