import styled from 'styled-components';

export const MasterControls = styled.div`
  position: sticky;
  bottom: 0;
  display: flex;
  background-color: #eee;
  border-top: solid 2px #aaa;
  z-index: 999;
  align-items: center;
  padding: 20px;

  .range-label {
    font-size: 28px;
  }

  input[type='range'] {
    width: 120px;
  }

  > * {
    margin-left: 10px !important;
    margin-right: 10px !important;
  }
`;

export const InstrumentRack = styled.div`
  background-color: ${({ patternIndex }) =>
    [
      'lime',
      'transparent',
      'mediumslateblue',
      'purple',
      'darkgrey',
      'magenta',
      'lightblue',
      'lightgreen',
      'goldenrod',
      'cyan',
    ][patternIndex]};
`;

export const ModuleContainer = styled.div`
  position: relative;
  padding: 80px 0;
  margin: 0 40px;
`;
