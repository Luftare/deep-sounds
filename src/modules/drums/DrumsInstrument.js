const silence = 0.00001;
const disconnectTimeOffset = 1000;

export default class DrumInstrument {
  constructor(audioMixer) {
    const { ctx, masterGain } = audioMixer;

    this.masterGain = ctx.createGain();
    this.masterGain.connect(masterGain);

    this.sounds = {
      kick: () => {
        const attack = 10;
        const hold = 50;
        const release = 600;
        const diveTime = 50;
        const startFrq = 1000;
        const endFrq = 70;

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
          }, release + disconnectTimeOffset);
        }, attack + hold);
      },
    };
  }
}
