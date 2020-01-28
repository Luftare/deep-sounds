import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Howl } from 'howler';
import samples from './samples';

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
  transition: all 100ms;

  :active {
    opacity: 0.8;
  }
`;

export default ({ audioMixer, bus }) => {
  useEffect(() => {
    const keysDown = {};

    const handleKeyDown = ({ key }) => {
      const lowKey = key.toLowerCase();
      if (keysDown[lowKey]) return;

      keysDown[lowKey] = true;
      const sampleHotKeys = ['a', 's', 'd', 'f'];
      const sampleIndex = sampleHotKeys.indexOf(lowKey);

      const sample = samples[sampleIndex];

      if (sample) {
        triggerSample(sample)();
      }
    };

    const handleKeyUp = ({ key }) => {
      keysDown[key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    bus.on('TRIGGER_SAMPLE', ({ sampleIndex }) => {
      triggerSample(samples[sampleIndex])();
    });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
    // eslint-disable-next-line
  }, []);

  const triggerSample = ({ src, volume }) => () => {
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
