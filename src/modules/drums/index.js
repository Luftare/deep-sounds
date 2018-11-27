import DrumInstrument from './DrumsInstrument';
import React, { Component } from 'react';

export default class Drums extends Component {
  constructor(props) {
    super(props);
    const { audioMixer } = props;

    this.drumInstrument = new DrumInstrument(audioMixer);
  }

  getSnapshotBeforeUpdate(prevProps) {
    const nextSequenceStepReceived =
      prevProps.sequence !== this.props.sequence && this.props.sequence >= 0;

    if (nextSequenceStepReceived) {
      this.drumInstrument.trigger('kick');
    }
    return null;
  }

  componentDidUpdate() {}

  render() {
    return <div>Drums, {this.props.sequence}</div>;
  }
}
