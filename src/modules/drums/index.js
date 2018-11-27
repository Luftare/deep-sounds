import React, { Component } from 'react';
import { Step, Sequence, Container } from './components';
import DrumInstrument from './DrumsInstrument';

const INIT_SEQUENCE_LENGTH = 8;
let keyGenerator = 1;

export default class Drums extends Component {
  constructor(props) {
    super(props);
    const { audioMixer } = props;

    this.drumInstrument = new DrumInstrument(audioMixer);

    this.state = {
      sequenceLength: INIT_SEQUENCE_LENGTH,
      sequences: this.drumInstrument.soundNames.map(() =>
        [...Array(INIT_SEQUENCE_LENGTH)].map(() => false)
      ),
    };
  }

  getSnapshotBeforeUpdate(prevProps) {
    const nextSequenceStepReceived =
      prevProps.step !== this.props.step && this.props.step >= 0;

    if (nextSequenceStepReceived) {
      this.drumInstrument.trigger('kick');
    }
    return null;
  }

  componentDidUpdate() {}

  render() {
    const { active, step } = this.props;
    const { sequences, sequenceLength } = this.state;

    const currentStep = step % sequenceLength;

    return (
      <Container>
        {sequences.map(sequence => (
          <Sequence key={keyGenerator++}>
            {sequence.map((step, i) => (
              <Step key={keyGenerator++} active={i === currentStep && active} />
            ))}
          </Sequence>
        ))}
      </Container>
    );
  }
}
