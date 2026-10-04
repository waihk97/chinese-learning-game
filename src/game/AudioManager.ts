export class AudioManager {
  private readonly speech: SpeechSynthesis | null;

  constructor() {
    this.speech = 'speechSynthesis' in window ? window.speechSynthesis : null;
  }

  public speak(text: string): void {
    if (!this.speech) {
      return;
    }

    this.speech.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.volume = 1;

    this.speech.speak(utterance);
  }

  public stop(): void {
    this.speech?.cancel();
  }
}
