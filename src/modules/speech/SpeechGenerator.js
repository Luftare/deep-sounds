export default class SpeechGenerator {
  constructor() {
    this.synth = window.speechSynthesis;
    this.rate = 1;
    this.pitch = 1;
    this.volume = 0.2;
  }

  speak(text) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.rate = this.rate;
    speech.pitch = this.pitch;
    speech.volume = this.volume;

    this.synth.speak(speech);
  }
}
