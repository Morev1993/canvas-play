export class Loop {
  constructor(update, render) {
    this.update = update;
    this.render = render;

    this.deltaTime = 0;

    requestAnimationFrame((stampTime) => this.animate(stampTime));
  }
  animate(currentTime) {
    requestAnimationFrame((stampTime) => this.animate(stampTime));

    this.deltaTime = currentTime - this.lastUpdate;


    this.update(this.deltaTime / 1000);
    this.render();

    this.lastUpdate = currentTime;

  }
}