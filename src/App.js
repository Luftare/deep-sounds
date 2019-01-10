import React, { Component } from 'react';
import { InstrumentRack, MasterControls } from './components';

import Drums from './modules/drums';
import Canvas from './modules/canvas';
import Speech from './modules/speech';
import Midi from './modules/midi';

class App extends Component {
  constructor(props) {
    super(props);

    this.ticker = props.ticker;

    this.state = {
      patternIndex: 1,
      step: 0,
      active: false,
      BPM: this.ticker.getBPM(),
      overdriveGain: 0,
      filterValue: 0,
    };

    this.setupEventListeners();
  }

  setupEventListeners() {
    window.addEventListener('keydown', ({ key }) => {
      const patternIndex = parseInt(key);
      const isNumber = !isNaN(patternIndex);

      if (isNumber) {
        this.setState({ patternIndex });
      }
    });
  }

  componentDidMount() {
    this.ticker.onTick = () => {
      this.setState(({ step }) => ({
        step: step + 1,
      }));
    };
  }

  handleTempoChange = e => {
    const BPM = parseInt(e.target.value);
    this.ticker.setBPM(BPM);
    this.setState({
      BPM,
    });
  };

  handleOverdriveGainChange = e => {
    const { audioMixer } = this.props;
    const overdriveGain = parseFloat(e.target.value);
    audioMixer.overdrive.gain = overdriveGain;
    this.setState({
      overdriveGain,
    });
  };

  handleFilterValueChange = e => {
    const { audioMixer } = this.props;
    const filterValue = parseFloat(e.target.value);
    audioMixer.doubleFilter.setValue(filterValue);
    this.setState({
      filterValue,
    });
  };

  resetFilterValue = e => {
    const { audioMixer } = this.props;
    const filterValue = 0;
    e.target.value = filterValue;
    audioMixer.doubleFilter.setValue(filterValue);
    this.setState({
      filterValue,
    });
  };

  startSequence = () => {
    this.setState(
      () => ({
        step: -1,
        active: true,
      }),
      () => {
        this.ticker.start();
      }
    );
  };

  stopSequence = () => {
    this.setState(
      () => ({
        active: false,
      }),
      () => {
        this.ticker.stop();
      }
    );
  };

  render() {
    const {
      step,
      active,
      BPM,
      overdriveGain,
      filterValue,
      patternIndex,
    } = this.state;
    const { audioMixer } = this.props;
    const stepTime = this.ticker.getIntervalTime();

    return (
      <>
        <InstrumentRack patternIndex={patternIndex}>
          <Drums
            step={step}
            audioMixer={audioMixer}
            active={active}
            patternIndex={patternIndex}
          />
          <Canvas
            step={step}
            stepTime={stepTime}
            audioMixer={audioMixer}
            active={active}
            patternIndex={patternIndex}
          />
          <Speech
            step={step}
            stepTime={stepTime}
            audioMixer={audioMixer}
            active={active}
            patternIndex={patternIndex}
          />
          <Midi audioMixer={audioMixer} />
        </InstrumentRack>
        <MasterControls>
          <button onMouseDown={active ? this.stopSequence : this.startSequence}>
            {active ? 'Stop' : 'Start'}
          </button>
          <span className="range-label" role="img" aria-label="Clock">
            ⏰
          </span>
          <input
            type="range"
            className="tempo"
            min="40"
            max="240"
            step="1"
            defaultValue={BPM}
            onChange={this.handleTempoChange}
          />
          <span className="range-label" role="img" aria-label="Clock">
            🔥
          </span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            defaultValue={overdriveGain}
            onChange={this.handleOverdriveGainChange}
          />
          <span className="range-label" role="img" aria-label="Scissors">
            ✂️
          </span>
          <input
            type="range"
            min="-1"
            max="1"
            step="0.01"
            defaultValue={filterValue}
            onDoubleClick={this.resetFilterValue}
            onChange={this.handleFilterValueChange}
          />
        </MasterControls>
      </>
    );
  }
}

export default App;
