export class Layer {
  constructor(container) {
    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d");
    this.container = container;
    this.container.appendChild(this.canvas);

    this.fitToContainer = this.fitToContainer.bind(this);
    // addEventListener('resize', this.fitToContainer);
    this.fitToContainer();
  }

  fitToContainer() {
    const dpr = window.devicePixelRatio;

    const rect = this.canvas.getBoundingClientRect();

    //   // Set the "actual" size of the canvas
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;

    // Scale the context to ensure correct drawing operations
    this.context.scale(dpr, dpr);

    this.w = this.canvas.width;
    this.h = this.canvas.height;

    this.canvas.style.width = `${rect.width}px`;
    this.canvas.style.height = `${rect.height}px`;
  }
}
