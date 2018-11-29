import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './range-input.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import Ticker from './Ticker';
import AudioMixer from './AudioMixer';

ReactDOM.render(
  <App ticker={new Ticker()} audioMixer={new AudioMixer()} />,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
