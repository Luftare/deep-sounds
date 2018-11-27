import styled from 'styled-components';

export const Step = styled.div`
  display: block;
  width: 40px;
  height: 40px;
  background-color: ${({ active }) => (active ? '#0f6' : '#ddd')};
  margin: 4px;
`;

export const Sequence = styled.div`
  display: flex;
`;
export const Container = styled.div``;
