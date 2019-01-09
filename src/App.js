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
      step: 0,
      active: false,
      BPM: this.ticker.getBPM(),
      overdriveGain: 0,
    };
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
    const { step, active, BPM, overdriveGain } = this.state;
    const { audioMixer } = this.props;
    const stepTime = this.ticker.getIntervalTime();

    return (
      <>
        <InstrumentRack>
          <Drums step={step} audioMixer={audioMixer} active={active} />
          <Canvas
            step={step}
            stepTime={stepTime}
            audioMixer={audioMixer}
            active={active}
          />
          <Speech
            step={step}
            stepTime={stepTime}
            audioMixer={audioMixer}
            active={active}
          />
          <Midi audioMixer={audioMixer} />
        </InstrumentRack>
        <MasterControls>
          <button onMouseDown={this.startSequence}>Start</button>
          <button onMouseDown={this.stopSequence}>Stop</button>
          <input
            type="range"
            className="tempo"
            min="40"
            max="240"
            step="1"
            defaultValue={BPM}
            onChange={this.handleTempoChange}
          />
          <span className="BPM">{BPM}</span>
          <input
            type="range"
            className="overdrive-gain__input"
            min="0"
            max="1"
            step="0.01"
            defaultValue={overdriveGain}
            onChange={this.handleOverdriveGainChange}
          />
          <span className="overdrive-gain__label">{overdriveGain}</span>
        </MasterControls>
      </>
    );
  }
}

export default App;
