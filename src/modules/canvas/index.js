import React, { Component } from 'react';
import { DrawingCanvas, CanvasPlayhead, Container } from './components';

const LINE_MIN_X_DIFF = 20;
const INIT_SEQUENCE_LENGTH = 8;

function getRelativeCoordinates(e) {
  const rect = e.target.getBoundingClientRect();
  const x = e.clientX - rect.left; //x position within the element.
  const y = e.clientY - rect.top; //y position within the element.
  return [x, y];
}

export default class Canvas extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();

    this.state = {
      sequenceLength: INIT_SEQUENCE_LENGTH,
      cursorDown: false,
      lines: [],
    };
  }

  componentDidMount() {
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
    }
    return null;
  }

  paintCanvas() {
    const canvas = this.canvasRef.current;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const ctx = canvas.getContext('2d');
    this.state.lines.forEach(({ points }) => {
      if (points.length < 2) return;

      ctx.lineWidth = 3;

      points.forEach((point, i) => {
        const isFirstPoint = i === 0;
        const isLastPoint = i === points.length - 1;
        if (isFirstPoint) {
          ctx.beginPath();
          ctx.moveTo(...point);
          return;
        }

        ctx.lineTo(...point);

        if (isLastPoint) {
          ctx.stroke();
        }
      });
    });
  }

  handleCanvasMouseDown = e => {
    const point = getRelativeCoordinates(e);

    this.setState(({ lines }) => ({
      cursorDown: true,
      lines: [
        ...lines,
        {
          points: [point],
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
    const pointTooClose = newPoint[0] - previousPoint[0] < LINE_MIN_X_DIFF;

    if (pointTooClose) return;

    this.setState(
      ({ lines }) => ({
        lines: lines.map((line, lineIndex) => {
          const isLastLine = lineIndex === lines.length - 1;
          if (!isLastLine) return line;
          return {
            ...line,
            points: [...line.points, newPoint],
          };
        }),
      }),
      () => {
        this.paintCanvas();
      }
    );
  };

  render() {
    const { sequenceLength } = this.state;

    return (
      <Container>
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
      </Container>
    );
  }
}
