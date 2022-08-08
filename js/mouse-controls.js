export class MouseControls {
  constructor(container = document.body) {
    this.pos = { x: 0, y: 0 };

    container.addEventListener(`mouseup`, (e) => this.changeState(e));
    container.addEventListener(`mousedown`, (e) => this.changeState(e));
    container.addEventListener(`mousemove`, (e) => this.changeState(e));
    container.addEventListener(`contextmenu`, (e) => this.changeState(e));
  }

  changeState(e) {
    const rect = this.container.getBoundingClientRect();

    this.pos.x = e.clientX - rect.left;
    this.pos.y = e.clientY - rect.top;
  }
}
