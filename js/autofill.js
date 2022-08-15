export class Autofill {
  constructor(width, height, container) {
    this.element = document.createElement("div");
    this.element.style.height = `${width}px`;
    this.element.style.width = `${height}px`;
    this.element.style.left = `${-9999}px`;
    this.element.style.top = `${-9999}px`;
    this.element.classList.add("autofill");

    container.appendChild(this.element);

    this.dragStart = false;

    this.element.addEventListener("mousedown", () => {
      this.dragStart = true;
    });

    this.element.addEventListener("mouseup", () => {
      this.dragStart = false;
    });
  }

  changePosition(x, y) {
    this.element.style.left = `${x}px`;
    this.element.style.top = `${y}px`;
  }
}
