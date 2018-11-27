export default class AudioMixer {
  constructor() {
    const ctx = new AudioContext();
    const masterGain = ctx.createGain();

    masterGain.gain.value = 0.3;

    masterGain.connect(ctx.destination);

    this.ctx = ctx;
    this.masterGain = masterGain;
  }

  beep() {
    const { ctx, masterGain } = this;
    const osc = ctx.createOscillator();
    osc.frequency.value = 200;
    osc.connect(masterGain);
    osc.start();
    setTimeout(() => {
      osc.stop();
    }, 200);
  }
}
