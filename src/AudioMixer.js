export default class AudioMixer {
  constructor() {
    const ctx = new AudioContext();
    const masterGain = ctx.createGain();

    masterGain.gain.value = 0.1;

    masterGain.connect(ctx.destination);

    this.ctx = ctx;
    this.masterGain = masterGain;
  }
}
