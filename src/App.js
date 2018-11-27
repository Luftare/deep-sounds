import React, { Component } from 'react';
import Drums from './modules/drums';

class App extends Component {
  ticker = null;
  state = {
    step: 0,
    active: false,
  };

  componentDidMount() {
    const { ticker } = this.props;
    this.ticker = ticker;

    ticker.onTick = () => {
      this.setState(({ step }) => ({
        step: step + 1,
      }));
    };
  }

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
    const { step, active } = this.state;
    const { audioMixer } = this.props;
    return (
      <div>
        <button onMouseDown={this.startSequence}>Start</button>
        <button onMouseDown={this.stopSequence}>Stop</button>
        <div>{this.state.sequenceActive ? 'on' : 'off'}</div>
        <Drums step={step} audioMixer={audioMixer} active={active} />
      </div>
    );
  }
}

export default App;
