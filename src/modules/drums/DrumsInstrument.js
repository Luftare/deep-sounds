const silence = 0.00001;
const disconnectTimeOffset = 1000;

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
    this.noiseBuffer = createNoiseBuffer(ctx);

    this.masterGain = ctx.createGain();
    this.masterGain.connect(destination);

    this.sounds = [
      {
        label: 'Closed hihat',
        muted: false,
        trigger: () => {
          const release = 100;

          const env = ctx.createGain();
          const noise = createNoiseNode(this.noiseBuffer, ctx);
          const highPassFilter = ctx.createBiquadFilter();

          env.gain.value = 1;
          highPassFilter.type = 'highpass';
          highPassFilter.frequency.value = 8000;

          noise.connect(highPassFilter);
          highPassFilter.connect(env);
          env.connect(this.masterGain);

          noise.start();

          env.gain.exponentialRampToValueAtTime(
            silence,
            ctx.currentTime + release * 0.001
          );

          setTimeout(() => {
            noise.stop();
            noise.disconnect();
            env.disconnect();
          }, release + disconnectTimeOffset);
        },
      },
      {
        label: 'Open hihat',
        muted: false,
        trigger: () => {
          const release = 500;

          const env = ctx.createGain();
          const noise = createNoiseNode(this.noiseBuffer, ctx);
          const highPassFilter = ctx.createBiquadFilter();

          env.gain.value = 1;
          highPassFilter.type = 'highpass';
          highPassFilter.frequency.value = 6000;

          noise.connect(highPassFilter);
          highPassFilter.connect(env);
          env.connect(this.masterGain);

          noise.start();

          env.gain.exponentialRampToValueAtTime(
            silence,
            ctx.currentTime + release * 0.001
          );

          setTimeout(() => {
            noise.stop();
            noise.disconnect();
            env.disconnect();
          }, release + disconnectTimeOffset);
        },
      },
      {
        label: 'Snare',
        muted: false,
        trigger: () => {
          const attack = 5;
          const hold = 50;
          const release = 100;
          const diveTime = 20;
          const startFrq = 1000;
          const endFrq = 180;

          const noise = createNoiseNode(this.noiseBuffer, ctx);
          const noiseLowpassFilter = ctx.createBiquadFilter();
          const noiseGain = ctx.createGain();
          const osc = ctx.createOscillator();
          const env = ctx.createGain();

          osc.frequency.value = startFrq;
          env.gain.value = silence;
          noiseLowpassFilter.frequency.value = 2000;
          noiseGain.gain.value = 1;

          noise.connect(noiseLowpassFilter);
          noiseLowpassFilter.connect(noiseGain);
          noiseGain.connect(env);
          osc.connect(env);
          env.connect(this.masterGain);

          osc.start();
          noise.start();
          env.gain.exponentialRampToValueAtTime(
            0.8,
            ctx.currentTime + attack * 0.001
          );
          osc.frequency.exponentialRampToValueAtTime(
            endFrq,
            ctx.currentTime + diveTime * 0.001
          );

          setTimeout(() => {
            env.gain.cancelScheduledValues(ctx.currentTime);

            env.gain.exponentialRampToValueAtTime(
              silence,
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
            }, release + disconnectTimeOffset);
          }, attack + hold);
        },
      },
      {
        label: 'Kick',
        muted: false,
        trigger: () => {
          const attack = 10;
          const hold = 50;
          const release = 200;
          const diveTime = 30;
          const startFrq = 2000;
          const endFrq = 60;

          const osc = ctx.createOscillator();
          const env = ctx.createGain();

          osc.frequency.value = startFrq;
          env.gain.value = silence;

          osc.connect(env);
          env.connect(this.masterGain);

          osc.start();
          env.gain.exponentialRampToValueAtTime(
            1,
            ctx.currentTime + attack * 0.001
          );
          osc.frequency.exponentialRampToValueAtTime(
            endFrq,
            ctx.currentTime + diveTime * 0.001
          );

          setTimeout(() => {
            env.gain.cancelScheduledValues(ctx.currentTime);

            env.gain.exponentialRampToValueAtTime(
              silence,
              ctx.currentTime + release * 0.001
            );
            setTimeout(() => {
              osc.stop();
              osc.disconnect();
              env.disconnect();
            }, release + disconnectTimeOffset);
          }, attack + hold);
        },
      },
    ];
  }
}
