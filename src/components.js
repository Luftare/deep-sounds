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

export const InstrumentRack = styled.div``;

export const ModuleContainer = styled.div`
  position: relative;
  padding: 80px 0;
  margin: 0 40px;
`;

export const PatternIndicator = styled.span`
  position: fixed;
  top: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 12px;
  padding-bottom: 12px;
  box-sizing: border-box;
  height: 40px;
  width: 40px;
  font-weight: 600;

  border-bottom-left-radius: 44px;
  background-color: ${({ patternIndex }) =>
    [
      'lime',
      'orange',
      'mediumslateblue',
      'hotpink',
      'darkgrey',
      'magenta',
      'lightblue',
      'lightgreen',
      'goldenrod',
      'cyan',
    ][patternIndex]};
`;
