import Overdrive from './audioFX/Overdrive';
import DoubleFilter from './audioFX/DoubleFilter';

export default class AudioMixer {
  constructor() {
    const ctx = new AudioContext();
    const masterGain = ctx.createGain();
    const input = ctx.createGain();
    const overdrive = new Overdrive(ctx);
    const doubleFilter = new DoubleFilter(ctx);
    const drumsVolume = ctx.createGain();
    const linesVolume = ctx.createGain();
    const synthVolume = ctx.createGain();

    masterGain.gain.value = 0.1;

    drumsVolume.connect(input);
    linesVolume.connect(input);
    synthVolume.connect(input);

    input.connect(overdrive.getInputNode());
    overdrive.connect(doubleFilter.getInputNode());
    doubleFilter.connect(masterGain);
    masterGain.connect(ctx.destination);

    this.drumsVolume = drumsVolume;
    this.linesVolume = linesVolume;
    this.synthVolume = synthVolume;

    this.doubleFilter = doubleFilter;
    this.overdrive = overdrive;
    this.input = input;
    this.ctx = ctx;
    this.masterGain = masterGain;
  }
}
