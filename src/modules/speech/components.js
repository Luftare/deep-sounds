import styled from 'styled-components';

export const Container = styled.div`
  display: flex;

  textarea {
    flex-grow: 1;
    font-size: 20px;
    min-width: 20px;
    background-color: #264;
    color: white;
    border: solid 3px #eee;
    padding: 8px;
    box-sizing: border-box;
  }
`;

export const SpeechControls = styled.div`
  display: flex;
  flex-grow: 0;
  flex-shrink: 0;
  flex-direction: column;
  width: 180px;
  height: 250px;
  margin-right: 20px;
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
