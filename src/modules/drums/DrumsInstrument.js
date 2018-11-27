const silence = 0.00001;

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
        const baseNote = 70;

        const osc = ctx.createOscillator();
        const env = ctx.createGain();

        osc.frequency.value = 1000;
        env.gain.value = silence;

        osc.connect(env);
        env.connect(this.masterGain);

        osc.start();
        env.gain.exponentialRampToValueAtTime(
          1,
          ctx.currentTime + attack / 1000
        );
        osc.frequency.exponentialRampToValueAtTime(
          baseNote,
          ctx.currentTime + diveTime / 1000
        );

        setTimeout(() => {
          env.gain.cancelScheduledValues(ctx.currentTime);
          // env.gain.setValueAtTime(env.gain.value, ctx.currentTime);

          env.gain.exponentialRampToValueAtTime(
            silence,
            ctx.currentTime + release / 1000
          );
          setTimeout(() => {
            osc.stop();
            osc.disconnect();
          }, release + 1000);
        }, attack + hold);
      },
    };
  }

  trigger(name) {
    this.sounds[name]();
  }
}
