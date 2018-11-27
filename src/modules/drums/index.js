import React, { Component } from 'react';
import { Step, Sequence, Container, SequenceLabel, Track } from './components';
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

  toggleStep = (sequenceIndex, stepIndex) => {
    this.setState(({ sequences }) => ({
      sequences: sequences.map((sequence, sequenceIterationIndex) =>
        sequenceIterationIndex === sequenceIndex
          ? sequence.map((step, stepIterationIndex) =>
              stepIterationIndex === stepIndex ? !step : step
            )
          : sequence
      ),
    }));
  };

  getSnapshotBeforeUpdate(prevProps) {
    const nextSequenceStepReceived =
      prevProps.step !== this.props.step && this.props.step >= 0;

    if (nextSequenceStepReceived) {
      this.handleNewStep();
    }
    return null;
  }

  handleNewStep() {
    const step = this.getLocalStep();
    this.drumInstrument.soundNames.forEach((soundName, sequenceIndex) => {
      const isActive = this.state.sequences[sequenceIndex][step];
      if (isActive) {
        this.drumInstrument.trigger(soundName);
      }
    });
  }

  componentDidUpdate() {}

  getLocalStep() {
    return this.props.step % this.state.sequenceLength;
  }

  render() {
    const { active } = this.props;
    const { sequences } = this.state;

    const currentStep = this.getLocalStep();

    return (
      <Container>
        {sequences.map((sequence, sequenceIndex) => (
          <Track key={keyGenerator++}>
            <SequenceLabel>
              {this.drumInstrument.soundNames[sequenceIndex]}
            </SequenceLabel>
            <Sequence>
              {sequence.map((stepActive, stepIndex) => (
                <Step
                  key={keyGenerator++}
                  active={stepActive}
                  isCurrent={stepIndex === currentStep && active}
                  onMouseDown={() => this.toggleStep(sequenceIndex, stepIndex)}
                />
              ))}
            </Sequence>
          </Track>
        ))}
      </Container>
    );
  }
}
