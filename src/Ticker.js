export default class Ticker {
  BPM = 120;
  onTick = () => {};
  active = false;
  timeoutId = 0;

  getIntervalTime() {
    return 60000 / this.BPM;
  }

  setIntervalTime(time) {
    this.bpm = 60000 / time;
  }

  getBPM() {
    return this.BPM;
  }

  setBPM(BPM) {
    this.BPM = BPM;
  }

  tick() {
    if (!this.active) {
      clearTimeout(this.timeoutId);
      return;
    }

    this.onTick();
    this.timeoutId = setTimeout(() => {
      this.tick();
    }, this.getIntervalTime());
  }

  start() {
    if (this.active) return;
    this.active = true;
    this.tick();
  }

  stop() {
    this.active = false;
    clearTimeout(this.timeoutId);
  }
}
