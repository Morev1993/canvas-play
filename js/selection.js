export class Selection {
  constructor(container) {
    this.container = container;

    this.bounds = {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };

    this.element = this.createElement();
  }

  createElement() {
    const element = document.createElement("div");
    element.style.height = `${0}px`;
    element.style.width = `${0}px`;
    element.style.left = `${-9999}px`;
    element.style.top = `${-9999}px`;
    element.classList.add("selection");

    return this.container.appendChild(element);
  }

  setBounds(x, y, width, height) {
    if (!this.element) {
      this.element = this.createElement();
    }

    this.bounds = {
      x,
      y,
      width,
      height,
    };
  }

  draw() {
    if (!this.element) {
      return;
    }
    this.element.style.top = `${this.bounds.y}px`;
    this.element.style.left = `${this.bounds.x}px`;
    this.element.style.height = `${this.bounds.height}px`;
    this.element.style.width = `${this.bounds.width}px`;
  }

  remove() {
    if (this.element) {
      this.container.removeChild(this.element);
      this.element = null;
    }
  }
}
