export type ProgressEntry = {
  dueAt: number;
  interval: number;
  ease: number;
  streak: number;
};

export class ProgressManager {
  private static readonly STORAGE_KEY = 'little-hanzi-quest-progress';

  private data: Record<string, ProgressEntry> = {};

  constructor() {
    this.load();
  }

  private load(): void {
    const raw = localStorage.getItem(ProgressManager.STORAGE_KEY);
    if (!raw) {
      this.data = {};
      return;
    }

    try {
      this.data = JSON.parse(raw) as Record<string, ProgressEntry>;
    } catch {
      this.data = {};
    }
  }

  private save(): void {
    localStorage.setItem(ProgressManager.STORAGE_KEY, JSON.stringify(this.data));
  }

  public getWordProgress(wordId: string): ProgressEntry {
    return (
      this.data[wordId] ?? {
        dueAt: 0,
        interval: 1,
        ease: 2.5,
        streak: 0,
      }
    );
  }

  public markWordResult(wordId: string, isCorrect: boolean): void {
    const current = this.getWordProgress(wordId);

    if (isCorrect) {
      const nextInterval = Math.max(1, Math.round(current.interval * current.ease));
      this.data[wordId] = {
        dueAt: Date.now() + nextInterval * 24 * 60 * 60 * 1000,
        interval: nextInterval,
        ease: Math.min(3.2, current.ease + 0.2),
        streak: current.streak + 1,
      };
    } else {
      this.data[wordId] = {
        dueAt: Date.now() + 60 * 60 * 1000,
        interval: 1,
        ease: 2.2,
        streak: 0,
      };
    }

    this.save();
  }

  public getDueWords(words: { id: string }[]): { id: string }[] {
    return [...words].sort((a, b) => {
      const aDue = this.getWordProgress(a.id).dueAt;
      const bDue = this.getWordProgress(b.id).dueAt;
      return aDue - bDue;
    });
  }
}

export const progressManager = new ProgressManager();
