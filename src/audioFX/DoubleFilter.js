const MIN_FREQUENCY = 60;
const MAX_FREQUENCY = 8000;
const INPUT_WEIGHT_EXPONENT = 3;
const ACTIVE_Q = 4;

export default class DoubleFilter {
  constructor(ctx) {
    this.ctx = ctx;
    this.lowPassFilter = ctx.createBiquadFilter();
    this.highPassFilter = ctx.createBiquadFilter();
    this.highPassFilter.type = 'highpass';
    this.highPassFilter.frequency.value = MIN_FREQUENCY;
    this.lowPassFilter.frequency.value = MAX_FREQUENCY;

    this.lowPassFilter.connect(this.highPassFilter);
  }

  setValue(value) {
    const { ctx } = this;
    this.lowPassFilter.frequency.cancelScheduledValues(ctx.currentTime);
    this.highPassFilter.frequency.cancelScheduledValues(ctx.currentTime);


    if(value >= 0) {
      this.lowPassFilter.Q.cancelScheduledValues(ctx.currentTime);
      this.highPassFilter.Q.cancelScheduledValues(ctx.currentTime);
      if(value === 0) {
        this.lowPassFilter.Q.setTargetAtTime(1, ctx.currentTime, 0.1);
        this.highPassFilter.Q.setTargetAtTime(1, ctx.currentTime, 0.1);
      } else {
        this.lowPassFilter.Q.setTargetAtTime(1, ctx.currentTime, 0.1);
        this.highPassFilter.Q.setTargetAtTime(ACTIVE_Q, ctx.currentTime, 0.1);
      }
      const frequency = MIN_FREQUENCY + MAX_FREQUENCY * value ** INPUT_WEIGHT_EXPONENT;
      this.lowPassFilter.frequency.setTargetAtTime(MAX_FREQUENCY, ctx.currentTime, 0.1);
      this.highPassFilter.frequency.setTargetAtTime(frequency, ctx.currentTime, 0.1);
    } else {
      this.lowPassFilter.Q.cancelScheduledValues(ctx.currentTime);
      this.highPassFilter.Q.cancelScheduledValues(ctx.currentTime);
      this.lowPassFilter.Q.setTargetAtTime(ACTIVE_Q, ctx.currentTime, 0.1);
      this.highPassFilter.Q.setTargetAtTime(1, ctx.currentTime, 0.1);

      const frequency = MIN_FREQUENCY + MAX_FREQUENCY * Math.max(0, (1 + value)) ** INPUT_WEIGHT_EXPONENT;
      this.highPassFilter.frequency.setTargetAtTime(MIN_FREQUENCY, ctx.currentTime, 0.1);
      this.lowPassFilter.frequency.setTargetAtTime(frequency, ctx.currentTime, 0.1);
    }
  }

  connect(node) {
    this.highPassFilter.connect(node);
  }

  getInputNode() {
    return this.lowPassFilter;
  }
}