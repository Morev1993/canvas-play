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
    if (!this.keyList.includes(e.code)) {
      return;
    } else {
      e.preventDefault();
    }

    this.keys[e.code] = e.type === "keydown" ? true : false;
  }
}
