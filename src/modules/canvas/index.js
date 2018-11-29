import React, { Component } from 'react';
import {
  Container,
  DrawingCanvas,
  CanvasPlayhead,
  Controls,
  CanvasContainer,
} from './components';
import { ModuleContainer } from '../../components';

import LinePlayer from './LinePlayer';

const LINE_MIN_X_DIFF = 0.005;
const INIT_SEQUENCE_LENGTH = 8;

function getRelativeCoordinates(e) {
  const { width, height } = e.target;
  const rect = e.target.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  return [x / width, y / height];
}

export default class Canvas extends Component {
  constructor(props) {
    super(props);

    const { audioMixer } = props;

    this.linePlayer = new LinePlayer({
      destination: audioMixer.masterGain,
      ctx: audioMixer.ctx,
    });

    this.canvasRef = React.createRef();

    this.state = {
      sequenceLength: INIT_SEQUENCE_LENGTH,
      cursorDown: false,
      transpose: 0,
      timingOffset: 0,
      lines: [],
    };
  }

  componentDidMount() {
    this.canvasRef.current.addEventListener('resize', this.paintCanvas);
    this.paintCanvas();
  }

  componentDidUpdate() {
    this.paintCanvas();
  }

  getCurrentStep() {
    return this.props.step % this.state.sequenceLength;
  }

  getSnapshotBeforeUpdate(prevProps) {
    const nextSequenceStepReceived =
      prevProps.step !== this.props.step && this.props.step >= 0;

    if (nextSequenceStepReceived) {
      const step = this.getCurrentStep();
      const relativeStartX = step / this.state.sequenceLength;
      const relativeEndX = (step + 1) / this.state.sequenceLength;
      const sequenceTotalTime = this.props.stepTime * this.state.sequenceLength;
      const currentLines = this.state.lines.filter(line => {
        if (line.points.length < 2) return false;
        const [x] = this.getTransposedPoint(line.points[0]);
        return x >= relativeStartX && x < relativeEndX;
      });

      currentLines.forEach(line => {
        this.linePlayer.playLine(
          line.points.map(this.getTransposedPoint),
          relativeStartX,
          sequenceTotalTime
        );
      });
    }
    return null;
  }

  handleTransposeChange = e => {
    const transpose = parseFloat(e.target.value);

    this.setState(
      {
        transpose,
      },
      this.paintCanvas
    );
  };

  resetTranspose = e => {
    e.target.value = 0;

    this.setState(
      {
        transpose: 0,
      },
      this.paintCanvas
    );
  };

  handleTimingOffsetChange = e => {
    const timingOffset = parseFloat(e.target.value);

    this.setState(
      {
        timingOffset,
      },
      this.paintCanvas
    );
  };

  resetTimingOffset = e => {
    e.target.value = 0;

    this.setState(
      {
        timingOffset: 0,
      },
      this.paintCanvas
    );
  };

  removeRecentLine = () => {
    this.setState(({ lines }) => ({
      lines: lines.filter((line, index) => index !== lines.length - 1),
    }));
  };

  removeAllLines = () => {
    this.setState(() => ({
      lines: [],
    }));
  };

  getTransposedPoint = ([x, y]) => {
    return [
      Math.max(0, Math.min(1, x + this.state.timingOffset)),
      Math.max(0, Math.min(1, y + this.state.transpose)),
    ];
  };

  paintCanvas = () => {
    const dpr = window.devicePixelRatio || 1;
    const canvas = this.canvasRef.current;
    const ctx = canvas.getContext('2d');

    const rect = canvas.getBoundingClientRect();
    const width = rect.width * dpr;
    const height = rect.height * dpr;

    canvas.width = width;
    canvas.height = height;
    ctx.scale(dpr, dpr);

    this.state.lines.forEach(({ points }) => {
      if (points.length < 2) return;

      ctx.lineWidth = 3;

      points.forEach((point, i) => {
        const isFirstPoint = i === 0;
        const isLastPoint = i === points.length - 1;
        const [relativeX, relativeY] = this.getTransposedPoint(point);
        const x = relativeX * width;
        const y = relativeY * height;
        if (isFirstPoint) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          return;
        }

        ctx.lineTo(x, y);

        if (isLastPoint) {
          ctx.stroke();
        }
      });
    });
  };

  handleCanvasMouseDown = e => {
    const point = getRelativeCoordinates(e);
    const transposedPoint = [
      point[0] - this.state.timingOffset,
      point[1] - this.state.transpose,
    ];

    this.setState(({ lines }) => ({
      cursorDown: true,
      lines: [
        ...lines,
        {
          points: [transposedPoint],
        },
      ],
    }));
  };

  endDrawing = e => {
    this.setState(({ lines }) => ({
      cursorDown: false,
      lines: lines.filter(line => line.points.length > 1),
    }));
  };

  handleCanvasMouseMove = e => {
    if (!this.state.cursorDown) return;
    if (this.state.lines.length < 1) return;

    const currentLine = this.state.lines[this.state.lines.length - 1];

    if (!currentLine) return;
    if (currentLine.length < 1) return;

    const previousPoint = currentLine.points[currentLine.points.length - 1];

    if (!previousPoint) return;
    const newPoint = getRelativeCoordinates(e);
    const pointTooClose =
      newPoint[0] - this.state.timingOffset - previousPoint[0] <
      LINE_MIN_X_DIFF;

    if (pointTooClose) return;

    const transposedNewPoint = [
      newPoint[0] - this.state.timingOffset,
      newPoint[1] - this.state.transpose,
    ];

    this.setState(
      ({ lines }) => ({
        lines: lines.map((line, lineIndex) => {
          const isLastLine = lineIndex === lines.length - 1;
          if (!isLastLine) return line;
          return {
            ...line,
            points: [...line.points, transposedNewPoint],
          };
        }),
      }),
      () => {
        this.paintCanvas();
      }
    );
  };

  render() {
    const { sequenceLength, lines } = this.state;
    const noLines = lines.length === 0;

    return (
      <ModuleContainer>
        <Container>
          <Controls>
            <div className="header">
              <button
                onClick={this.removeAllLines}
                className="reset"
                disabled={noLines}
              >
                Reset
              </button>
              <button
                onClick={this.removeRecentLine}
                className="undo"
                disabled={noLines}
              >
                Undo
              </button>
            </div>
            <input
              type="range"
              className="transpose"
              defaultValue={this.state.transpose}
              onInput={this.handleTransposeChange}
              onDoubleClick={this.resetTranspose}
              min="-0.5"
              max="0.5"
              step="0.001"
            />
            <input
              type="range"
              className="timing-offset"
              defaultValue={this.state.timingOffset}
              onInput={this.handleTimingOffsetChange}
              onDoubleClick={this.resetTimingOffset}
              min="-0.5"
              max="0.5"
              step="0.001"
            />
          </Controls>
          <CanvasContainer>
            <DrawingCanvas
              ref={this.canvasRef}
              onMouseDown={this.handleCanvasMouseDown}
              onMouseUp={this.endDrawing}
              onMouseLeave={this.endDrawing}
              onMouseMove={this.handleCanvasMouseMove}
            />
            <CanvasPlayhead
              step={this.getCurrentStep()}
              sequenceLength={sequenceLength}
              active={this.props.active}
            />
          </CanvasContainer>
        </Container>
      </ModuleContainer>
    );
  }
}
