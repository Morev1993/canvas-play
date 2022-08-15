export class MouseControls {
  constructor(container = document.body, update) {
    this.pos = { x: 0, y: 0 };

    this.container = container;
    this.update = update;
    this.down = false;

    this.container.addEventListener(`mouseup`, (e) => {
      this.changeState(e);
      this.update();
    });
    this.container.addEventListener(`mousedown`, (e) => {
      this.changeState(e);
      this.update();
    });
    this.container.addEventListener(`mousemove`, (e) => this.changeState(e));
    this.container.addEventListener(`contextmenu`, (e) => this.changeState(e));
  }

  changeState(e) {
    const rect = this.container.getBoundingClientRect();

    this.pos.x = e.clientX - rect.left;
    this.pos.y = e.clientY - rect.top;

    if (e.type === "mousedown") {
      this.down = true;
    }

    if (e.type === "mouseup") {
      this.down = false;
    }
  }
}
