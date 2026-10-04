export class AudioManager {
  private readonly speech: SpeechSynthesis | null;
  private audioCache: Map<string, HTMLAudioElement> = new Map();

  constructor() {
    this.speech = 'speechSynthesis' in window ? window.speechSynthesis : null;
  }

  /**
   * Speak text using either a cached audio file or browser speech synthesis fallback.
   * Audio files should be placed in public/audio/ folder with naming convention:
   * public/audio/{pinyin}.mp3 or public/audio/{char}.mp3
   */
  public async speak(text: string, options?: { useFallback?: boolean }): Promise<void> {
    const pinyin = this.sanitizePinyin(text);
    const audioPath = `/audio/${pinyin}.mp3`;

    try {
      let audio = this.audioCache.get(text);
      if (!audio) {
        audio = new Audio(audioPath);
        audio.oncanplaythrough = () => {
          this.audioCache.set(text, audio);
        };
      }

      // Try to play the audio file
      audio.currentTime = 0;
      const playPromise = audio.play();

      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // If audio file doesn't exist, fall back to speech synthesis
          this.useSpeechSynthesis(text);
        });
      }
    } catch {
      // Fall back to speech synthesis if file loading fails
      this.useSpeechSynthesis(text);
    }
  }

  private useSpeechSynthesis(text: string): void {
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

  private sanitizePinyin(text: string): string {
    // Remove spaces and convert to lowercase for file naming
    return text.toLowerCase().replace(/\s+/g, '-');
  }

  public stop(): void {
    this.speech?.cancel();
    // Stop all cached audio
    this.audioCache.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
  }

  public preloadAudio(words: Array<{ char: string; pinyin: string }>): void {
    words.forEach((word) => {
      const audioPath = `/audio/${this.sanitizePinyin(word.pinyin)}.mp3`;
      const audio = new Audio(audioPath);
      audio.preload = 'auto';
    });
  }
}
