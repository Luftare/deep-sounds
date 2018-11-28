import styled from 'styled-components';

export const Container = styled.div`
  position: relative;
`;

export const DrawingCanvas = styled.canvas`
  background-color: #eee;
  width: 100%;
  height: 300px;
  vertical-align: top;
`;

export const CanvasPlayhead = styled.div`
  position: absolute;
  top: 0;
  left: ${({ step, sequenceLength }) => (100 * step) / sequenceLength}%;
  background-color: blue;
  opacity: ${({ active }) => (active ? 0.2 : 0)};
  width: ${({ sequenceLength }) => 100 / sequenceLength}%;
  height: 100%;
  pointer-events: none;
`;
