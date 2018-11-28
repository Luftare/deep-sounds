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
  left: 50%;
  background-color: blue;
  width: 2px;
  height: 100%;
`;
