import React, { Component } from 'react';
import { Container, ControlGroup } from './components';

import MidiSynth from './MidiSynth';

let keyCounter = 1;

function exponentToFrequency(exponent) {
  return Math.max(60, Math.min(60 * 2 ** exponent, 20000));
}

export default class Midi extends Component {
  constructor(props) {
    super(props);

    const { audioMixer, onControlSignal } = props;

    this.state = {
      attack: 15,
      release: 250,
      filterModDecay: 250,
      filterFrequencyExponent: 4,
      filterFrequencyModExponent: 2,
      selectedWaveformIndex: 2,
    };

    this.midiSynth = new MidiSynth({
      ctx: audioMixer.ctx,
      destination: audioMixer.synthVolume,
      onControlSignal,
    });

    this.midiSynth.attack = this.state.attack;
    this.midiSynth.release = this.state.release;
    this.midiSynth.filterModDecay = this.state.filterModDecay;
    this.midiSynth.filterFrequency = exponentToFrequency(
      this.state.filterFrequencyExponent
    );
    this.midiSynth.filterModStartFrequency = exponentToFrequency(
      this.state.filterFrequencyExponent + this.state.filterFrequencyModExponent
    );
    this.midiSynth.waveform = this.midiSynth.waveforms[
      this.state.selectedWaveformIndex
    ];
  }

  handleAttackChange = e => {
    const attack = parseInt(e.target.value);
    this.midiSynth.attack = attack;
    this.setState({ attack });
  };

  handleReleaseChange = e => {
    const release = parseInt(e.target.value);
    this.midiSynth.release = release;
    this.setState({ release });
  };

  handleFilterModDecayChange = e => {
    const filterModDecay = parseInt(e.target.value);
    this.midiSynth.filterModDecay = filterModDecay;
    this.setState({ filterModDecay });
  };

  handleWaveformSelection = e => {
    const selectedWaveformIndex = parseInt(e.target.value);
    this.midiSynth.waveform = this.midiSynth.waveforms[selectedWaveformIndex];
    this.setState({ selectedWaveformIndex });
  };

  handleFilterFrequencyExponentChange = e => {
    const filterFrequencyExponent = parseInt(e.target.value);
    const filterFrequency = exponentToFrequency(filterFrequencyExponent);
    this.midiSynth.filterFrequency = filterFrequency;
    this.midiSynth.filterModStartFrequency = exponentToFrequency(
      this.state.filterFrequencyModExponent + filterFrequencyExponent
    );
    this.setState({ filterFrequencyExponent });
  };

  handleFilterFrequencyModExponentChange = e => {
    const filterFrequencyModExponent = parseInt(e.target.value);
    const filterModStartFrequency = exponentToFrequency(
      filterFrequencyModExponent + this.state.filterFrequencyExponent
    );
    this.midiSynth.filterModStartFrequency = filterModStartFrequency;
    this.setState({ filterFrequencyModExponent });
  };

  render() {
    const {
      attack,
      release,
      filterFrequencyExponent,
      filterFrequencyModExponent,
      filterModDecay,
    } = this.state;
    const { waveforms } = this.midiSynth;

    return (
      <Container>
        <ControlGroup>
          <h3>Oscillator</h3>
          <select
            onChange={this.handleWaveformSelection}
            value={this.state.selectedWaveformIndex}
          >
            {waveforms.map((waveform, index) => (
              <option key={keyCounter++} value={index}>
                {waveform}
              </option>
            ))}
          </select>
        </ControlGroup>
        <ControlGroup>
          <h3>Envelope</h3>
          <div className="control">
            <label>Attack</label>
            <input
              type="range"
              min="15"
              max="250"
              step="1"
              defaultValue={attack}
              onChange={this.handleAttackChange}
            />
          </div>
          <div className="control">
            <label>Release</label>
            <input
              type="range"
              min="5"
              max="500"
              step="1"
              defaultValue={release}
              onChange={this.handleReleaseChange}
            />
          </div>
        </ControlGroup>
        <ControlGroup>
          <h3>Filter</h3>
          <div className="control">
            <label>Frequency</label>
            <input
              type="range"
              min="0"
              max="8"
              step="0.01"
              defaultValue={filterFrequencyExponent}
              onChange={this.handleFilterFrequencyExponentChange}
            />
          </div>
          <div className="control">
            <label>Mod amount</label>
            <input
              type="range"
              min="-8"
              max="8"
              step="0.01"
              defaultValue={filterFrequencyModExponent}
              onChange={this.handleFilterFrequencyModExponentChange}
            />
          </div>
          <div className="control">
            <label>Mod time</label>
            <input
              type="range"
              min="5"
              max="505"
              step="0.01"
              defaultValue={filterModDecay}
              onChange={this.handleFilterModDecayChange}
            />
          </div>
        </ControlGroup>
      </Container>
    );
  }
}
