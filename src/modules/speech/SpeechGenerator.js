export default class SpeechGenerator {
  constructor() {
    this.synth = window.speechSynthesis;
    this.rate = 1;
    this.pitch = 1;
    this.volume = 0.6;
    this.speechCache = {};
  }

  getVoices() {
    return this.synth.getVoices();
  }

  interrupt() {
    this.synth.cancel();
  }

  speak(text, voice) {
    const voiceKey = `${text}_${voice.name}_${this.rate}_${this.pitch}`;

    if (this.speechCache[voiceKey]) {
      this.synth.speak(this.speechCache[voiceKey]);
      return;
    }

    const speech = new SpeechSynthesisUtterance(text);
    speech.voice = voice;
    speech.rate = this.rate;
    speech.pitch = this.pitch;
    speech.volume = this.volume;
    this.speechCache[voiceKey] = speech;
    this.synth.speak(speech);
  }
}
