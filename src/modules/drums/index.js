import React, { Component } from 'react';

export default class Drums extends Component {
  getSnapshotBeforeUpdate(prevProps) {
    const nextSequenceStepReceived =
      prevProps.sequence !== this.props.sequence && this.props.sequence >= 0;
    if (nextSequenceStepReceived) {
      // play note at sequence this.props.sequence
    }
    return null;
  }

  componentDidUpdate() {}

  render() {
    return <div>Drums, {this.props.sequence}</div>;
  }
}
