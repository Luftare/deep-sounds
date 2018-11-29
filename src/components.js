import styled from 'styled-components';

export const InstrumentRack = styled.div`
  > *:not(:last-child) {
    border-bottom: solid 3px #ccc;
  }
`;

export const ModuleContainer = styled.div`
  position: relative;
  padding: 40px 0;
  margin: 0 40px;

  box-sizing: border-box;
`;
