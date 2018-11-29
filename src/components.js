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

  .tempo {
    width: 120px;
  }

  .BPM {
    width: 40px;
    text-align: center;
    font-size: 20px;
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
