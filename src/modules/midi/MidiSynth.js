const SILENCE = 0.0001;
const DISCONNECT_OFFSET_TIME = 1000;

function midiNumberToFrequency(midiNumber) {
  return 440 * Math.pow(2, (midiNumber - 69) / 12);
}

export default class MidiSynth {
  constructor({ ctx, destination }) {
    this.ctx = ctx;
    this.destination = destination;
    this.notes = [];

    if (this.canUseMidi()) {
      navigator
        .requestMIDIAccess({
          sysex: false,
        })
        .then(midiAccess => {
          const inputs = midiAccess.inputs.values();
          for (
            let input = inputs.next();
            input && !input.done;
            input = inputs.next()
          ) {
            input.value.onmidimessage = this.handleMidiEvent;
          }
        });
    }
  }

  canUseMidi() {
    return 'requestMIDIAccess' in navigator;
  }

  handleMidiEvent = ({ data }) => {
    const [typeNumber, midiNumber, velocity] = data;
    const MIDI_MESSAGE_START_NOTE = 144;
    const MIDI_MESSAGE_STOP_NOTE = 128;

    if (typeNumber === MIDI_MESSAGE_START_NOTE) {
      this.startNote(midiNumber, velocity);
    }

    if (typeNumber === MIDI_MESSAGE_STOP_NOTE) {
      this.stopNote(midiNumber);
    }
  };

  startNote(midiNumber, velocity) {
    const noteAlreadyExists = this.notes[midiNumber];

    if (noteAlreadyExists) {
      this.stopNote(midiNumber);
    }
    const attackInMs = 12;

    const frequency = midiNumberToFrequency(midiNumber);
    const { ctx, destination } = this;
    const osc = ctx.createOscillator();
    const env = ctx.createGain();
    const lowPassFilter = ctx.createBiquadFilter();
    const lowPassStartFrequency = 14000;
    const lowPassEndFrequency = 200;
    const lowPassDiveDuration = 250;
    const gainValue = velocity / 127;

    lowPassFilter.frequency.value = lowPassStartFrequency;
    lowPassFilter.Q.value = 8;
    osc.type = 'square';
    env.gain.value = SILENCE;
    osc.frequency.value = frequency;

    osc.connect(env);
    env.connect(lowPassFilter);
    lowPassFilter.connect(destination)
    osc.start(0);
    env.gain.exponentialRampToValueAtTime(
      gainValue,
      ctx.currentTime + attackInMs / 1000
    );
    lowPassFilter.frequency.exponentialRampToValueAtTime(
      lowPassEndFrequency,
      ctx.currentTime + lowPassDiveDuration / 1000
    );

    const note = {
      osc,
      env,
      lowPassFilter
    };

    this.notes[midiNumber] = note;
  }

  stopNote(midiNumber) {
    if (!this.notes[midiNumber]) return;

    const { ctx } = this;
    const { osc, env, lowPassFilter } = this.notes[midiNumber];
    const releaseInMs = 100;

    this.notes[midiNumber] = null;

    env.gain.cancelScheduledValues(0);
    env.gain.linearRampToValueAtTime(
      SILENCE,
      ctx.currentTime + releaseInMs / 1000
    );

    setTimeout(() => {
      osc.stop(0);
      osc.disconnect();
      env.disconnect();
      lowPassFilter.disconnect();
    }, releaseInMs + DISCONNECT_OFFSET_TIME);
  }
}