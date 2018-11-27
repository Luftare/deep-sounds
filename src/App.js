import React, { Component } from 'react';
import Drums from './modules/drums';

class App extends Component {
  ticker = null;
  state = {
    sequence: 0,
    sequenceCount: 8,
    sequenceActive: false,
  };

  componentDidMount() {
    const { ticker } = this.props;
    this.ticker = ticker;

    ticker.onTick = () => {
      this.setState(({ sequence, sequenceCount }) => ({
        sequence: (sequence + 1) % sequenceCount,
      }));
    };
  }

  startSequence = () => {
    this.setState(
      () => ({
        sequence: -1,
        sequenceActive: true,
      }),
      () => {
        this.ticker.start();
      }
    );
  };

  stopSequence = () => {
    this.setState(
      () => ({
        sequenceActive: false,
      }),
      () => {
        this.ticker.stop();
      }
    );
  };

  render() {
    const { sequence } = this.state;
    const { audioMixer } = this.props;
    return (
      <div>
        <button onMouseDown={this.startSequence}>Start</button>
        <button onMouseDown={this.stopSequence}>Stop</button>
        <div>{this.state.sequenceActive ? 'on' : 'off'}</div>
        <Drums sequence={sequence} audioMixer={audioMixer} />
      </div>
    );
  }
}

export default App;
