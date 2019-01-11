const resolution = 4;

export default class Ticker {
  BPM = 120;
  onTick = () => {};
  active = false;
  timeoutId = 0;

  getIntervalTime() {
    return 60000 / this.BPM / resolution;
  }

  setIntervalTime(time) {
    this.bpm = 60000 / time / resolution;
  }

  getBPM() {
    return this.BPM;
  }

  setBPM(BPM) {
    this.BPM = BPM;
  }

  tick(previousOffsetTime = 0) {
    if (!this.active) {
      clearTimeout(this.timeoutId);
      return;
    }
    
    const now = Date.now();
    const targetIntervalDuration = this.getIntervalTime();
    const nextTimeoutDuration = targetIntervalDuration - previousOffsetTime;
    
    this.onTick();

    this.timeoutId = setTimeout(() => {
      const nowAfterTimout = Date.now();
      const timeoutActualDuration = nowAfterTimout - now;
      const tickOffsetTime = timeoutActualDuration - nextTimeoutDuration;

      this.tick(tickOffsetTime);
    }, nextTimeoutDuration);
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
