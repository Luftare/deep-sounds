import styled from 'styled-components';

export const Container = styled.div`
  display: grid;
  margin: 0 40px;
  padding: 80px 0;
  box-sizing: border-box;
  grid-template-columns: repeat(3, 1fr);
`;

export const ControlGroup = styled.div`
  margin-right: 40px;

  .control {
    margin-top: 12px;

    label {
      margin-bottom: 320px;
    }
  }
`;
