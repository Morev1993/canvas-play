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
    this._cover.axis = state.axis;
  }

  changePosition(x, y) {
    this.x = x;
    this.y = y;
  }

  drawStart() {
    if (this._cover.axis === "y") {
      this.drawCoverAxisY(true, "black");
    }

    if (this._cover.axis === "x") {
      this.drawCoverAxisX(true, "black");
    }
  }

  drawEnd() {
    if (this._cover.axis === "y") {
      this.drawCoverAxisY(false, "#2376E5");
    }

    if (this._cover.axis === "x") {
      this.drawCoverAxisX(false, "#2376E5");
    }
  }

  drawCoverAxisY(dashed, color) {
    this.drawLine(
      this.cover.xLeft,
      this.cover.yStart,
      this.cover.xLeft,
      this.cover.yEnd,
      dashed,
      color
    );

    this.drawLine(
      this.cover.xRight,
      this.cover.yStart,
      this.cover.xRight,
      this.cover.yEnd,
      dashed,
      color
    );

    this.drawLine(
      this.cover.xLeft,
      this.cover.yEnd,
      this.cover.xRight,
      this.cover.yEnd,
      dashed,
      color
    );
  }

  drawCoverAxisX(dashed, color) {
    this.drawLine(
      this.cover.xLeft,
      this.cover.yStart,
      this.cover.xRight,
      this.cover.yStart,
      dashed,
      color
    );

    this.drawLine(
      this.cover.xLeft,
      this.cover.yEnd,
      this.cover.xRight,
      this.cover.yEnd,
      dashed,
      color
    );

    this.drawLine(
      this.cover.xRight,
      this.cover.yStart,
      this.cover.xRight,
      this.cover.yEnd,
      dashed,
      color
    );
  }

  drawLine(x1, y1, x2, y2, dashed, color) {
    this.layer.context.beginPath();
    this.layer.context.moveTo(x1, y1);
    this.layer.context.lineTo(x2, y2);
    this.layer.context.strokeStyle = color;
    if (dashed) {
      this.layer.context.setLineDash([4, 6]);
    } else {
      this.layer.context.setLineDash([]);
    }
    this.layer.context.stroke();
  }

  draw() {
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
  }
}
