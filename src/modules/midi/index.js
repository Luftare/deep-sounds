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
  }

  render() {
    return <Container />;
  }
}
