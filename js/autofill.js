export class Autofill {
  constructor(x, y, width, height, layer) {
    this.x = x;
    this.y = y;

    this.element = document.createElement("div");
    this.element.style.height = `${width}px`;
    this.element.style.width = `${height}px`;
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
    this.element.classList.add("autofill");

    this._cover = {
      xLeft: 0,
      xRight: 0,
      yStart: 0,
      yEnd: 0,
    };

    this.layer = layer;

    this.layer.container.appendChild(this.element);

    this.dragStart = false;

    this.element.addEventListener("mousedown", (e) => {
      e.stopPropagation();
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
    this.x = x;
    this.y = y;
  }

  drawStart() {
    this.layer.context.beginPath();
    this.layer.context.moveTo(this.cover.xLeft, this.cover.yStart);
    this.layer.context.lineTo(this.cover.xLeft, this.cover.yEnd);
    this.layer.context.strokeStyle = "black";
    this.layer.context.setLineDash([4, 6]);
    this.layer.context.stroke();

    this.layer.context.beginPath();
    this.layer.context.moveTo(this.cover.xRight, this.cover.yStart);
    this.layer.context.lineTo(this.cover.xRight, this.cover.yEnd);
    this.layer.context.strokeStyle = "black";
    this.layer.context.setLineDash([4, 6]);
    this.layer.context.stroke();

    this.layer.context.beginPath();
    this.layer.context.moveTo(this.cover.xLeft, this.cover.yEnd);
    this.layer.context.lineTo(this.cover.xRight, this.cover.yEnd);
    this.layer.context.strokeStyle = "black";
    this.layer.context.setLineDash([4, 6]);
    this.layer.context.stroke();
  }

  drawEnd() {
    this.layer.context.beginPath();
    this.layer.context.moveTo(this.cover.xLeft, this.cover.yStart);
    this.layer.context.lineTo(this.cover.xLeft, this.cover.yEnd);
    this.layer.context.strokeStyle = "#2376E5";
    this.layer.context.setLineDash([]);
    this.layer.context.stroke();

    this.layer.context.beginPath();
    this.layer.context.moveTo(this.cover.xRight, this.cover.yStart);
    this.layer.context.lineTo(this.cover.xRight, this.cover.yEnd);
    this.layer.context.strokeStyle = "#2376E5";
    this.layer.context.setLineDash([]);
    this.layer.context.stroke();

    this.layer.context.beginPath();
    this.layer.context.moveTo(this.cover.xLeft, this.cover.yEnd);
    this.layer.context.lineTo(this.cover.xRight, this.cover.yEnd);
    this.layer.context.strokeStyle = "#2376E5";
    this.layer.context.setLineDash([]);
    this.layer.context.stroke();
  }

  draw() {
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
  }
}
