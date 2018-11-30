import React, { Component } from 'react';

import { SpeechControls, Container, SlideControl } from './components';
import SpeechGenerator from './SpeechGenerator';
import { ModuleContainer } from '../../components';

let keyCounter = 1;

const TIMING_MAX_VALUE = 100;
const TIMING_MIN_VALUE = -100;
const DEFAULT_TIMING = 0;

const PITCH_MIN_VALUE = 0.1;
const PITCH_MAX_VALUE = 2;
const DEFAULT_PITCH = 1;

const SPEECH_RATE_MIN_VALUE = 0.1;
const SPEECH_RATE_MAX_VALUE = 2;
const DEFAULT_SPEECH_RATE = 1;

export default class Speech extends Component {
  constructor(props) {
    super(props);
    this.speechGenerator = new SpeechGenerator();
    this.state = {
      voices: [],
      selectedVoiceIndex: 0,
      lines: [],
      sequenceLength: 8,
      speechRate: DEFAULT_SPEECH_RATE,
      timingOffset: DEFAULT_TIMING,
      pitch: DEFAULT_PITCH,
    };
    this.speechGenerator.rate = DEFAULT_SPEECH_RATE;
    this.textareaRef = React.createRef();

    this.speechGenerator.synth.onvoiceschanged = () => {
      if (this.state.voices.length > 0) return;
      console.log(this.speechGenerator.getVoices());
      this.setState({
        voices: this.speechGenerator.getVoices(),
      });
    };
  }

  getCurrentStep() {
    return this.props.step % this.state.sequenceLength;
  }

  componentDidUpdate() {}

  getSnapshotBeforeUpdate(prevProps) {
    const nextSequenceStepReceived =
      prevProps.step !== this.props.step && this.props.step >= 0;

    if (!this.props.active && prevProps.active) {
      this.speechGenerator.interrupt();
    }

    if (nextSequenceStepReceived && this.state.lines.length > 0) {
      const step = this.getCurrentStep();
      if (step === 0) {
        const currentCycle = Math.floor(
          this.props.step / this.state.sequenceLength
        );
        const currentLineIndex = currentCycle % this.state.lines.length;
        const currentLine = this.state.lines[currentLineIndex];
        const sequenceTime = this.props.stepTime * this.state.sequenceLength;
        const delayTime = sequenceTime - this.state.timingOffset;
        if (currentLine) {
          setTimeout(() => {
            this.speechGenerator.interrupt();
            const voice = this.state.voices[this.state.selectedVoiceIndex];
            this.speechGenerator.speak(currentLine, voice);
          }, delayTime);
        }
      }
    }
    return null;
  }

  handleVoiceSelection = e => {
    const selectedVoiceIndex = parseInt(e.target.value);
    this.setState({
      selectedVoiceIndex,
    });
  };

  handleTextChange = e => {
    const text = e.target.value;
    const lines = text.split('\n');
    this.setState({ lines });
  };

  handleTimingChange = e => {
    const timingOffset = TIMING_MAX_VALUE - parseInt(e.target.value);
    this.setState({ timingOffset });
  };

  resetTiming = e => {
    e.target.value = DEFAULT_TIMING;
    this.setState({ timingOffset: 0 });
  };

  handleSpeechRateChange = e => {
    const speechRate = parseFloat(e.target.value);
    this.speechGenerator.rate = speechRate;
    this.setState({ speechRate });
  };

  resetSpeechRate = e => {
    e.target.value = DEFAULT_SPEECH_RATE;
    this.speechGenerator.rate = DEFAULT_SPEECH_RATE;
    this.setState({ speechRate: DEFAULT_SPEECH_RATE });
  };

  handlePitchChange = e => {
    const pitch = parseFloat(e.target.value);
    this.speechGenerator.pitch = pitch;
    this.setState({ pitch });
  };

  resetPitch = e => {
    e.target.value = DEFAULT_PITCH;
    this.speechGenerator.rate = DEFAULT_PITCH;
    this.setState({ speechRate: DEFAULT_PITCH });
  };

  render() {
    return (
      <ModuleContainer>
        <Container>
          <SpeechControls>
            <select
              disabled={this.props.active}
              onChange={this.handleVoiceSelection}
              value={this.state.selectedVoiceIndex}
            >
              {this.state.voices.map((voice, index) => (
                <option key={keyCounter++} value={index}>
                  {voice.name} ({voice.lang})
                </option>
              ))}
            </select>
            <SlideControl>
              <label>Timing</label>
              <input
                type="range"
                onChange={this.handleTimingChange}
                onDoubleClick={this.resetTiming}
                defaultValue={this.state.timingOffset}
                step="1"
                min={TIMING_MIN_VALUE}
                max={TIMING_MAX_VALUE}
              />
            </SlideControl>
            <SlideControl>
              <label>Pitch</label>
              <input
                type="range"
                onChange={this.handlePitchChange}
                onDoubleClick={this.resetPitch}
                defaultValue={this.state.pitch}
                step="0.01"
                min={PITCH_MIN_VALUE}
                max={PITCH_MAX_VALUE}
              />
            </SlideControl>
            <SlideControl>
              <label>Rate</label>
              <input
                type="range"
                onChange={this.handleSpeechRateChange}
                onDoubleClick={this.resetSpeechRate}
                defaultValue={this.state.speechRate}
                step="0.01"
                min={SPEECH_RATE_MIN_VALUE}
                max={SPEECH_RATE_MAX_VALUE}
              />
            </SlideControl>
          </SpeechControls>
          <textarea ref={this.textareaRef} onChange={this.handleTextChange} />
        </Container>
      </ModuleContainer>
    );
  }
}
