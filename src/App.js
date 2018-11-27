import React, { Component } from 'react';
import Drums from './modules/drums';

class App extends Component {
  ticker = null;
  state = {
    sequence: 0,
    sequenceCount: 8,
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
      }),
      () => {
        this.ticker.start();
      }
    );
  };

  stopSequence = () => {
    this.ticker.stop();
  };

  render() {
    const { sequence } = this.state;
    return (
      <div>
        <button onMouseDown={this.startSequence}>Start</button>
        <button onMouseDown={this.stopSequence}>Stop</button>
        <Drums sequence={sequence} />
      </div>
    );
  }
}

export default App;
