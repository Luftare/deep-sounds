import React, { PureComponent } from 'react';
import mitt from 'mitt';
import { InstrumentRack, MasterControls, PatternIndicator } from './components';

import Drums from './modules/drums';
import Canvas from './modules/canvas';
import Speech from './modules/speech';
import Midi from './modules/midi';
import SampleBank from './modules/sampleBank';

const bus = mitt();

const MIN_TEMPO = 40;
const MAX_TEMPO = 240;

const normalizedKnobValue = value => (value - 64) / (127 - 64);
const normalizedSliderValue = value => value / 127;

class App extends PureComponent {
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
    const keysDown = {};

    window.addEventListener('keydown', e => {
      const { key } = e;
      const lowKey = key.toLowerCase();
      if (keysDown[lowKey]) return;

      keysDown[lowKey] = true;
      const patternIndex = parseInt(lowKey);
      const isNumber = !isNaN(patternIndex);

      if (isNumber) {
        this.setState({ patternIndex });
      }

      if (lowKey === ' ') {
        e.preventDefault();
        this.state.active ? this.stopSequence() : this.startSequence();
      }
    });

    window.addEventListener('keyup', ({ key }) => {
      keysDown[key.toLowerCase()] = false;
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
    this.setBPM(BPM);
  };

  setBPM = BPM => {
    this.ticker.setBPM(BPM);
    this.setState({
      BPM,
    });
  }

  handleOverdriveGainChange = e => {
    const overdriveGain = parseFloat(e.target.value);
    this.setOverdriveGain(overdriveGain)
  };

  setOverdriveGain = overdriveGain => {
    const { audioMixer } = this.props;
    audioMixer.overdrive.gain = overdriveGain;
    this.setState({ overdriveGain });
  }

  handleFilterValueChange = e => {
    const filterValue = parseFloat(e.target.value);
    this.setFilterValue(filterValue);
  };

  setFilterValue = filterValue => {
    const { audioMixer } = this.props;
    audioMixer.doubleFilter.setValue(filterValue);
    this.setState({ filterValue });
  }

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

  handleControlSignal = ([channel, value]) => {
    console.log(channel, value);
    const normKnob = normalizedKnobValue(value);
    const normSlider = normalizedSliderValue(value);

    switch (channel) {
      case 2: // tempo
        this.setBPM(normKnob * (MAX_TEMPO - MIN_TEMPO) + MIN_TEMPO);
        break;
      case 3: // overdrive
        this.setOverdriveGain(normKnob);
        break;
      case 4: // double filter
        this.setFilterValue(normKnob * 2 - 1);
        break;
      case 5: // transpose lines
        bus.emit('TRANSPOSE_LINES', ({ value: -normKnob + 0.5 }));
        break;
      case 6: // drums volume
        this.props.audioMixer.drumsVolume.gain.setTargetAtTime(normSlider, 0, 0.1);
        break;
      case 7: // lines volume
        this.props.audioMixer.linesVolume.gain.setTargetAtTime(normSlider, 0, 0.1);
        break;
      case 8: // synth volume
        this.props.audioMixer.synthVolume.gain.setTargetAtTime(normSlider, 0, 0.1);
        break;
      case 10: // sample 1
        if (value === 127) {
          bus.emit('TRIGGER_SAMPLE', { sampleIndex: 0 });
        }
        break;
      case 11: // sample 2
        if (value === 127) {
          bus.emit('TRIGGER_SAMPLE', { sampleIndex: 1 });
        }
        break;
      case 12: // sample 3
        if (value === 127) {
          bus.emit('TRIGGER_SAMPLE', { sampleIndex: 2 });
        }
        break;
      case 13: // sample 4
        if (value === 127) {
          bus.emit('TRIGGER_SAMPLE', { sampleIndex: 3 });
        }
        break;
      case 14: // pattern index
        if (value === 127) {
          this.setState({ patternIndex: 1 });
        }
        break;
      case 15: // pattern index
        if (value === 127) {
          this.setState({ patternIndex: 2 });
        }
        break;
      case 16: // pattern index
        if (value === 127) {
          this.setState({ patternIndex: 3 });
        }
        break;
      case 17: // pattern index
        if (value === 127) {
          this.setState({ patternIndex: 4 });
        }
        break;

      default:
        break;
    }
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
    const patternIndexKeyboardNumber = patternIndex === 0 ? 10 : patternIndex;

    return (
      <>
        <PatternIndicator patternIndex={patternIndex}>
          {patternIndexKeyboardNumber}
        </PatternIndicator>
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
            bus={bus}
          />
          <SampleBank audioMixer={audioMixer} bus={bus} />
          <Speech
            step={step}
            stepTime={stepTime}
            audioMixer={audioMixer}
            active={active}
            patternIndex={patternIndex}
          />
          <Midi audioMixer={audioMixer} onControlSignal={this.handleControlSignal} />
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
            min={MIN_TEMPO}
            max={MAX_TEMPO}
            step="1"
            value={BPM}
            onChange={this.handleTempoChange}
          />
          <span className="range-label" role="img" aria-label="Fire">
            🔥
          </span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={overdriveGain}
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
            value={filterValue}
            onDoubleClick={this.resetFilterValue}
            onChange={this.handleFilterValueChange}
          />
        </MasterControls>
      </>
    );
  }
}

export default App;
