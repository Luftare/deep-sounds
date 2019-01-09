import Overdrive from './audioFX/Overdrive';

export default class AudioMixer {
  constructor() {
    const ctx = new AudioContext();
    const masterGain = ctx.createGain();
    const input = ctx.createGain();
    const overdrive = new Overdrive(ctx);
    
    masterGain.gain.value = 0.1;

    input.connect(overdrive.getInputNode());
    overdrive.connect(masterGain);
    masterGain.connect(ctx.destination);

    this.overdrive = overdrive;
    this.input = input;
    this.ctx = ctx;
    this.masterGain = masterGain;
  }
}
