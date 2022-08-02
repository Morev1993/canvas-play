export class Loop {
  constructor(update, render) {
    this.update = update;
    this.render = render;

    requestAnimationFrame(() => this.animate());
  }
  animate() {
    requestAnimationFrame(() => this.animate());

    this.update();
    this.render();

  }
}