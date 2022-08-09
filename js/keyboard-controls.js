export class KeyboardControls {
  constructor(keyList = [], update) {
    this.keyList = keyList;
    this.keys = {};
    this.update = update;

    addEventListener("keydown", (e) => {
      this.changeState(e);
      this.update();
    });
    addEventListener("keyup", (e) => this.changeState(e));
  }

  changeState(e) {
    e.preventDefault();

    if (!this.keyList.includes(e.code)) {
      return;
    }

    this.keys[e.code] = e.type === "keydown" ? true : false;
  }
}
