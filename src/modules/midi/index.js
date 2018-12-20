import React, { Component } from 'react';
import { Container } from './components';

import MidiSynth from './MidiSynth';

export default class Midi extends Component {
  constructor(props) {
    super(props);

    const { audioMixer } = props;

    this.midiSynth = new MidiSynth({
      ctx: audioMixer.ctx,
      destination: audioMixer.masterGain,
    });

    // TODO: remove this once functionality verified with actual midi keyboard
    window.addEventListener('keydown', ({ key }) => {
      if (key === 'a') {
        this.midiSynth.handleMidiEvent({
          data: [144, 50, 127],
        });
      }

      if (key === 's') {
        this.midiSynth.handleMidiEvent({
          data: [128, 50, 127],
        });
      }
    });
  }

  render() {
    return <Container />;
  }
}
