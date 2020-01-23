const SILENCE = 0.0001;
const DISCONNECT_OFFSET_TIME = 100;

function midiNumberToFrequency(midiNumber) {
  return 440 * Math.pow(2, (midiNumber - 69) / 12);
}

export default class MidiSynth {
  constructor({ ctx, destination, onControlSignal }) {
    this.ctx = ctx;
    this.destination = destination;
    this.notes = [];
    this.gain = 0.5;
    this.waveforms = ['sine', 'square', 'sawtooth', 'triangle'];
    this.waveform = this.waveforms[2];
    this.onControlSignal = onControlSignal;

    this.attack = 20;
    this.release = 500;
    this.filterFrequency = 400;
    this.filterModStartFrequency = 800;
    this.filterModDecay = 300;

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
    const MIDI_MESSAGE_CONTROL_SIGNAL = 188;

    switch (typeNumber) {
      case MIDI_MESSAGE_START_NOTE:
        this.startNote(midiNumber, velocity);
        break;
      case MIDI_MESSAGE_STOP_NOTE:
        this.stopNote(midiNumber);
        break;
      case MIDI_MESSAGE_CONTROL_SIGNAL:
        this.onControlSignal([midiNumber, velocity]);
        break;
      default:
        break;
    }
  };

  startNote(midiNumber, velocity) {
    const noteAlreadyExists = this.notes[midiNumber];

    if (noteAlreadyExists) {
      this.stopNote(midiNumber);
    }

    const frequency = midiNumberToFrequency(midiNumber);
    const { ctx, destination } = this;
    const osc = ctx.createOscillator();
    const env = ctx.createGain();
    const lowPassFilter = ctx.createBiquadFilter();
    const gainValue = this.gain * velocity / 127;

    lowPassFilter.frequency.value = this.filterModStartFrequency;
    lowPassFilter.Q.value = 2;
    osc.type = this.waveform;
    env.gain.value = SILENCE;
    osc.frequency.value = frequency;

    osc.connect(env);
    env.connect(lowPassFilter);
    lowPassFilter.connect(destination);

    osc.start(0);
    env.gain.exponentialRampToValueAtTime(
      gainValue,
      ctx.currentTime + this.attack / 1000
    );
    lowPassFilter.frequency.exponentialRampToValueAtTime(
      this.filterFrequency,
      ctx.currentTime + this.filterModDecay / 1000
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

    this.notes[midiNumber] = null;

    env.gain.cancelScheduledValues(0);
    env.gain.linearRampToValueAtTime(
      SILENCE,
      ctx.currentTime + this.release / 1000
    );

    setTimeout(() => {
      osc.stop(0);
      osc.disconnect();
      env.disconnect();
      lowPassFilter.disconnect();
    }, this.release + DISCONNECT_OFFSET_TIME);
  }
}
