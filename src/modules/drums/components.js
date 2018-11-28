import styled from 'styled-components';

export const Step = styled.div`
  display: block;
  width: 40px;
  height: 40px;
  background-color: ${({ active, isCurrent }) => {
    if (isCurrent) return '#0f8';
    if (active) return '#6a6';
    return '#eee';
  }};
  margin: 4px;
  cursor: pointer;
`;

export const Sequence = styled.div`
  display: flex;
`;

export const Track = styled.div`
  display: flex;
`;

export const Container = styled.div``;

export const SequenceLabel = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  width: 200px;
  margin: 4px;
  background-color: ${({ muted }) => (muted ? 'pink' : 'none')};
`;
