import Overdrive from './audioFX/Overdrive';
import DoubleFilter from './audioFX/DoubleFilter';

export default class AudioMixer {
  constructor() {
    const ctx = new AudioContext();
    const masterGain = ctx.createGain();
    const input = ctx.createGain();
    const overdrive = new Overdrive(ctx);
    const doubleFilter = new DoubleFilter(ctx);
    
    masterGain.gain.value = 0.1;

    input.connect(overdrive.getInputNode());
    overdrive.connect(doubleFilter.getInputNode());
    doubleFilter.connect(masterGain);
    masterGain.connect(ctx.destination);

    this.doubleFilter = doubleFilter;
    this.overdrive = overdrive;
    this.input = input;
    this.ctx = ctx;
    this.masterGain = masterGain;
  }
}
