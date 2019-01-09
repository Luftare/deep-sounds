const SILENCE = 0.00001;
const DISCONNECT_TIME_OFFSET = 100;

function createNoiseBuffer(ctx) {
  const bufferSize = 4096 * 16;
  const buffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate);
  const leftChannelData = buffer.getChannelData(0);
  const rightChannelData = buffer.getChannelData(1);

  for (let i = 0; i < bufferSize; i++) {
    leftChannelData[i] = (Math.random() - 0.5) * 2;
    rightChannelData[i] = (Math.random() - 0.5) * 2;
  }

  return buffer;
}

function createNoiseNode(buffer, ctx) {
  const node = ctx.createBufferSource();
  node.buffer = buffer;
  node.loop = true;
  return node;
}

export default class DrumInstrument {
  constructor({ ctx, destination }) {
    const noiseBuffer = createNoiseBuffer(ctx);

    const masterGain = ctx.createGain();
    masterGain.connect(destination);

    this.sounds = [
      {
        label: 'Closed hihat',
        level: 1,
        muted: false,
        trigger() {
          const release = 100;

          const env = ctx.createGain();
          const noise = createNoiseNode(noiseBuffer, ctx);
          const highPassFilter = ctx.createBiquadFilter();

          env.gain.value = this.level;
          highPassFilter.type = 'highpass';
          highPassFilter.frequency.value = 8000;

          noise.connect(highPassFilter);
          highPassFilter.connect(env);
          env.connect(masterGain);

          noise.start();

          env.gain.exponentialRampToValueAtTime(
            SILENCE,
            ctx.currentTime + release * 0.001
          );

          setTimeout(() => {
            noise.stop();
            noise.disconnect();
            env.disconnect();
          }, release + DISCONNECT_TIME_OFFSET);
        },
      },
      {
        label: 'Open hihat',
        level: 1,
        muted: false,
        trigger() {
          const release = 500;

          const env = ctx.createGain();
          const noise = createNoiseNode(noiseBuffer, ctx);
          const highPassFilter = ctx.createBiquadFilter();

          env.gain.value = this.level;
          highPassFilter.type = 'highpass';
          highPassFilter.frequency.value = 6000;

          noise.connect(highPassFilter);
          highPassFilter.connect(env);
          env.connect(masterGain);

          noise.start();

          env.gain.exponentialRampToValueAtTime(
            SILENCE,
            ctx.currentTime + release * 0.001
          );

          setTimeout(() => {
            noise.stop();
            noise.disconnect();
            env.disconnect();
          }, release + DISCONNECT_TIME_OFFSET);
        },
      },
      {
        label: 'Snare',
        level: 0.8,
        muted: false,
        trigger() {
          const attack = 5;
          const hold = 50;
          const release = 100;
          const diveTime = 20;
          const startFrq = 2000;
          const endFrq = 220;

          const noise = createNoiseNode(noiseBuffer, ctx);
          const noiseLowpassFilter = ctx.createBiquadFilter();
          const noiseGain = ctx.createGain();
          const osc = ctx.createOscillator();
          const env = ctx.createGain();

          osc.frequency.value = startFrq;
          env.gain.value = SILENCE;
          noiseLowpassFilter.frequency.value = 2000;
          noiseGain.gain.value = 1;

          noise.connect(noiseLowpassFilter);
          noiseLowpassFilter.connect(noiseGain);
          noiseGain.connect(env);
          osc.connect(env);
          env.connect(masterGain);

          osc.start();
          noise.start();
          env.gain.exponentialRampToValueAtTime(
            this.level,
            ctx.currentTime + attack * 0.001
          );
          osc.frequency.exponentialRampToValueAtTime(
            endFrq,
            ctx.currentTime + diveTime * 0.001
          );

          setTimeout(() => {
            env.gain.cancelScheduledValues(ctx.currentTime);

            env.gain.exponentialRampToValueAtTime(
              SILENCE,
              ctx.currentTime + release * 0.001
            );
            setTimeout(() => {
              osc.stop();
              noise.stop();
              noiseLowpassFilter.disconnect();
              osc.disconnect();
              env.disconnect();
              noise.disconnect();
              noiseGain.disconnect();
            }, release + DISCONNECT_TIME_OFFSET);
          }, attack + hold);
        },
      },
      {
        label: 'Kick',
        level: 1,
        muted: false,
        trigger() {
          const attack = 10;
          const hold = 50;
          const release = 200;
          const diveTime = 30;
          const startFrq = 2000;
          const endFrq = 60;

          const osc = ctx.createOscillator();
          const env = ctx.createGain();

          osc.frequency.value = startFrq;
          env.gain.value = SILENCE;

          osc.connect(env);
          env.connect(masterGain);

          osc.start();
          env.gain.exponentialRampToValueAtTime(
            this.level,
            ctx.currentTime + attack * 0.001
          );
          osc.frequency.exponentialRampToValueAtTime(
            endFrq,
            ctx.currentTime + diveTime * 0.001
          );

          setTimeout(() => {
            env.gain.cancelScheduledValues(ctx.currentTime);

            env.gain.exponentialRampToValueAtTime(
              SILENCE,
              ctx.currentTime + release * 0.001
            );
            setTimeout(() => {
              osc.stop();
              osc.disconnect();
              env.disconnect();
            }, release + DISCONNECT_TIME_OFFSET);
          }, attack + hold);
        },
      },
    ];
  }
}
