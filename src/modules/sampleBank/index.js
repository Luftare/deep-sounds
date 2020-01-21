import React from 'react';
import styled from 'styled-components';
import { Howl, Howler } from 'howler';

export const PadContainer = styled.div`
  display: grid;
  margin: 0 40px;
  padding: 80px 0;
  box-sizing: border-box;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 8px;
`;

const Pad = styled.div`
  background-color: ${({ color }) => color};
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;
  cursor: pointer;
  color: white;
  font-size: 36px;
`;

export default ({ audioMixer }) => {
  const samples = [
    {
      label: 'Cat',
      color: '#843',
      src: require('./samples/cat.mp3'),
      volume: 1.4,
    },
    {
      label: 'Laser',
      color: '#348',
      src: require('./samples/laser.mp3'),
      volume: 0.9,
    },
    {
      label: 'Laugh',
      color: '#838',
      src: require('./samples/laugh.mp3'),
      volume: 0.9,
    },
    {
      label: 'Night',
      color: '#383',
      src: require('./samples/night.mp3'),
      volume: 2,
    },
  ];

  const triggerSample = ({ src, volume }) => e => {
    new Howl({
      src: [src],
      volume,
    }).play();
  };

  return (
    <PadContainer>
      {samples.map(sample => (
        <Pad
          key={sample.label}
          color={sample.color}
          onMouseDown={triggerSample(sample)}
        >
          {sample.label}
        </Pad>
      ))}
    </PadContainer>
  );
};
