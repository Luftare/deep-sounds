function hardClipCurve(value, gain) {
  const weightedGain = gain ** 0.2;
  const maxValue = 1.0001 - weightedGain;
  const sign = value >= 0 ? 1 : -1;
  const multiplier = 1 / (1.0001 - weightedGain);
  return multiplier * Math.min(maxValue, Math.abs(value)) * sign;
}

export default class Overdrive implements Connectable {
  constructor(ctx) {
    const bufferSize = 2 ** 10;
    const channelsCount = 1;
    this.gain = 0;

    this.shaper = ctx.createScriptProcessor(bufferSize, channelsCount, channelsCount);

    this.shaper.onaudioprocess = ({inputBuffer, outputBuffer }) => {
      for (let channel = 0; channel < outputBuffer.numberOfChannels; channel++) {
        const inputData = inputBuffer.getChannelData(channel);
        const outputData = outputBuffer.getChannelData(channel);

        for (let sample = 0; sample < inputBuffer.length; sample++) {
          const outputValue = this.gain === 0 ? inputData[sample] : hardClipCurve(inputData[sample], this.gain);
          outputData[sample] = outputValue;
        }
      }
    }
  }

  connect(node) {
    this.shaper.connect(node);
  }

  getInputNode() {
    return this.shaper;
  }
}