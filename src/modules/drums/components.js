import styled from 'styled-components';

export const Step = styled.div`
  display: block;
  background-color: ${({ active, isCurrent }) => {
    if (isCurrent) return '#0f8';
    if (active) return '#6a6';
    return '#eee';
  }};
  cursor: pointer;
`;

export const Sequence = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: repeat(1, 40px);
  grid-gap: 8px;
  flex-grow: 1;
`;

export const Track = styled.div`
  display: flex;
  margin: 8px 0;
`;

export const SequenceLabel = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  width: 180px;
  margin-right: 20px;
  background-color: ${({ muted }) => (muted ? 'pink' : 'none')};
`;
