import React, { Component } from 'react';
import { Step, Sequence, Container, SequenceLabel, Track } from './components';
import DrumInstrument from './DrumsInstrument';

const INIT_SEQUENCE_LENGTH = 8;
let keyGenerator = 1;

export default class Drums extends Component {
  constructor(props) {
    super(props);
    const { audioMixer } = props;

    this.drumInstrument = new DrumInstrument({
      ctx: audioMixer.ctx,
      destination: audioMixer.masterGain,
    });

    this.state = {
      sequenceLength: INIT_SEQUENCE_LENGTH,
      sequences: this.drumInstrument.sounds.map(() =>
        [...Array(INIT_SEQUENCE_LENGTH)].map(() => false)
      ),
      mutes: this.drumInstrument.sounds.map(({ muted }) => muted),
    };
  }

  toggleMute = soundIndex => {
    this.drumInstrument.sounds[soundIndex].muted = !this.drumInstrument.sounds[
      soundIndex
    ].muted;

    this.setState(() => ({
      mutes: this.drumInstrument.sounds.map(({ muted }) => muted),
    }));
  };

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
    this.drumInstrument.sounds.forEach((sound, soundIndex) => {
      const isActive = this.state.sequences[soundIndex][step];
      if (isActive && !sound.muted) {
        sound.trigger();
      }
    });
  }

  componentDidUpdate() {}

  getLocalStep() {
    return this.props.step % this.state.sequenceLength;
  }

  render() {
    const { active } = this.props;
    const { sequences, mutes } = this.state;

    const currentStep = this.getLocalStep();

    return (
      <Container>
        {sequences.map((sequence, sequenceIndex) => (
          <Track key={keyGenerator++}>
            <SequenceLabel
              onMouseDown={() => this.toggleMute(sequenceIndex)}
              muted={mutes[sequenceIndex]}
            >
              {this.drumInstrument.sounds[sequenceIndex].label}
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
