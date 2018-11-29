export default class SpeechGenerator {
  constructor() {
    this.synth = window.speechSynthesis;
  }

  speak(text) {
    const speech = new SpeechSynthesisUtterance(text);

    this.synth.speak(speech);
  }
}
