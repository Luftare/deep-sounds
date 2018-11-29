const MIN_FREQUENCY = 40;
const OCTAVES = 6;
const SILENCE = 0.0001;
const DISCONNECT_OFFSET_TIME = 1000;

function yToFrequency(y) {
  const height = 1 - y;
  const exponent = OCTAVES * height;
  return MIN_FREQUENCY * Math.pow(2, exponent);
}

export default class LinePlayer {
  constructor({ ctx, destination }) {
    this.ctx = ctx;
    this.destination = destination;
    this.level = 1;
    this.waveform = 'sine';
  }

  playLine(points, offsetX, sequenceTime) {
    const { ctx, destination } = this;
    const attack = 10;
    const release = 20;
    const offsetTime = offsetX * sequenceTime;

    const firstPoint = points[0];
    const lastPoint = points[points.length - 1];
    if (firstPoint[0] >= lastPoint[0]) return;
    const relativeDuration = lastPoint[0] - firstPoint[0];
    const lineDuration = sequenceTime * relativeDuration;
    const lineStartX = firstPoint[0];
    const lineStartTimeFromSequenceStart = lineStartX * sequenceTime;

    const osc = ctx.createOscillator();
    osc.type = this.waveform;
    const env = ctx.createGain();

    env.gain.value = SILENCE;

    osc.connect(env);
    env.connect(destination);

    const startTime =
      ctx.currentTime + (lineStartTimeFromSequenceStart - offsetTime) * 0.001;
    const stopTime = startTime + lineDuration * 0.001;

    points.forEach(([x, y], index) => {
      const timeSinceStart = (x - lineStartX) * sequenceTime;
      const isFirstPoint = index === 0;
      const frequency = yToFrequency(y);
      if (isFirstPoint) {
        osc.frequency.value = frequency;
      } else {
        const previousPoint = points[index - 1];
        const timeSincePrevious = (x - previousPoint[0]) * sequenceTime;
        if (timeSincePrevious !== 0) {
          osc.frequency.setTargetAtTime(
            frequency,
            startTime + timeSinceStart * 0.001,
            timeSincePrevious * 0.001
          );
        }
      }
    });
    osc.start(startTime);
    env.gain.setTargetAtTime(this.level, startTime, attack * 0.001);
    env.gain.setTargetAtTime(SILENCE, stopTime, release * 0.001);
    osc.stop(stopTime + release * 0.001 + DISCONNECT_OFFSET_TIME * 0.001);

    setTimeout(() => {
      osc.disconnect();
      env.disconnect();
    }, lineDuration + release + DISCONNECT_OFFSET_TIME);
  }
}
