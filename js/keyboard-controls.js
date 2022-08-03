export class KeyboardControls {
  constructor(keyList = []) {
    this.keyList = keyList;
    this.keys = {};

    addEventListener('keydown', (e) => this.changeState(e));
    addEventListener('keyup', (e) => this.changeState(e));

  }

  changeState(e) {
    if (!this.keyList.includes(e.code)) {
      return;
    }

    this.keys[e.code] = e.type === 'keydown' ? true : false;
  }
}