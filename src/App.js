import React, { Component } from 'react';
import Drums from './modules/drums';

class App extends Component {
  state = {
    sequence: 0,
    sequenceCount: 8,
  };

  componentDidMount() {
    const { ticker } = this.props;

    ticker.onTick = () => {
      this.setState(({ sequence, sequenceCount }) => ({
        sequence: (sequence + 1) % sequenceCount,
      }));
    };

    ticker.start();
  }

  render() {
    const { sequence } = this.state;
    return <Drums sequence={sequence} />;
  }
}

export default App;
