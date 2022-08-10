export class ScrollControls {
  constructor(container, update) {
    this.scrollPos = { x: 0, y: 0 };

    this.container = container;
    // this.update = update;
  }

  listen(update) {
    this.container.addEventListener(`scroll`, (e) => {
      this.scrollPos.x = e.target.scrollLeft;
      this.scrollPos.y = e.target.scrollTop;

      update();
    });
  }

  changeState(e) {
    this.scrollPos.x = e.target.scrollLeft;
    this.scrollPos.y = e.target.scrollTop;
  }
}
