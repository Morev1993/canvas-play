export class Autofill {
  constructor(width, height, container) {
    this.element = document.createElement("div");
    this.element.style.height = `${width}px`;
    this.element.style.width = `${height}px`;
    this.element.style.left = `${-9999}px`;
    this.element.style.top = `${-9999}px`;
    this.element.classList.add("autofill");

    this.pos = {};

    this._cover = {
      xLeft: 0,
      xRight: 0,
      yStart: 0,
      yEnd: 0,
    };

    container.appendChild(this.element);

    this.dragStart = false;

    this.element.addEventListener("mousedown", () => {
      this.dragStart = true;
    });

    this.element.addEventListener("mouseup", () => {
      this.dragStart = false;
    });
  }

  get cover() {
    return this._cover;
  }

  set cover(state) {
    this._cover.xLeft = state.xLeft;
    this._cover.xRight = state.xRight;
    this._cover.yStart = state.yStart;
    this._cover.yEnd = state.yEnd;
  }

  changePosition(x, y) {
    this.element.style.left = `${x}px`;
    this.element.style.top = `${y}px`;
  }

  draw() {}
}
