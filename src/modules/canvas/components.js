import styled from 'styled-components';

export const Container = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 200px 1fr;
`;

export const CanvasContainer = styled.div`
  position: relative;
`;

export const DrawingCanvas = styled.canvas`
  background-color: #eee;
  height: 300px;
  width: 100%;
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

export const Controls = styled.div`
  display: flex;
  flex-grow: 0;
  flex-shrink: 0;
  width: 200px;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  .header {
    width: 100%;
    display: flex;
    justify-content: space-around;
  }

  .reset {
    background-color: red;
  }

  .transpose {
    width: 140px;
    transform: rotate(90deg);
  }

  .timing-offset {
    width: 140px;
  }
`;
