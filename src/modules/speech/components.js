import styled from 'styled-components';

export const Container = styled.div`
  display: grid;
  grid-template-columns: 180px 1fr;
  grid-template-rows: 250px;
  grid-gap: 20px;

  textarea {
    font-size: 20px;
    background-color: #264;
    color: white;
    border: solid 3px #eee;
    padding: 8px;
    box-sizing: border-box;
  }
`;

export const SpeechControls = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const SlideControl = styled.div`
  background: green;
  display: flex;
  flex-direction: column;
  align-items: center;

  label {
    margin-bottom: 8px;
  }

  input {
    width: 140px;
  }
`;
