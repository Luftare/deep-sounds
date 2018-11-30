export default class SpeechGenerator {
  constructor() {
    this.synth = window.speechSynthesis;
    this.rate = 1;
    this.pitch = 1;
    this.volume = 0.2;
  }

  getVoices() {
    return this.synth.getVoices();
  }

  interrupt() {
    if (this.synth.speaking) {
      this.synth.cancel();
    }
  }

  speak(text, voice) {
    const speech = new SpeechSynthesisUtterance(text);
    if (voice) speech.voice = voice;
    speech.rate = this.rate;
    speech.pitch = this.pitch;
    speech.volume = this.volume;
    this.synth.speak(speech);
  }
}
