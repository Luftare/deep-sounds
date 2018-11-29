import React, { Component } from 'react';

import SpeechGenerator from './SpeechGenerator';
import { ModuleContainer } from '../../components';

export default class Speech extends Component {
  constructor(props) {
    super(props);
    this.speechGenerator = new SpeechGenerator();
  }

  render() {
    return (
      <ModuleContainer>
        <button onClick={() => this.speechGenerator.speak('yo')}>Speak</button>
      </ModuleContainer>
    );
  }
}
