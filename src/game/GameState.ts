import Phaser from 'phaser';

import { type Level, type LessonWord } from '../data/lessons';

export type SaveData = {
  completedLevels: number[];
  lastLevelId: number | null;
  totalStars: number;
};

export class GameSave {
  private static readonly KEY = 'little-hanzi-quest-save';

  private data: SaveData = {
    completedLevels: [],
    lastLevelId: null,
    totalStars: 0,
  };

  constructor() {
    this.load();
  }

  private load(): void {
    const raw = localStorage.getItem(GameSave.KEY);
    if (!raw) {
      return;
    }

    try {
      this.data = { ...this.data, ...JSON.parse(raw) } as SaveData;
    } catch {
      this.data = {
        completedLevels: [],
        lastLevelId: null,
        totalStars: 0,
      };
    }
  }

  private save(): void {
    localStorage.setItem(GameSave.KEY, JSON.stringify(this.data));
  }

  public getCompletedLevels(): number[] {
    return this.data.completedLevels;
  }

  public getLastLevelId(): number | null {
    return this.data.lastLevelId;
  }

  public getTotalStars(): number {
    return this.data.totalStars;
  }

  public setCompletedLevel(levelId: number): void {
    if (!this.data.completedLevels.includes(levelId)) {
      this.data.completedLevels.push(levelId);
    }
    this.data.lastLevelId = levelId;
    this.save();
  }

  public addStars(amount: number): void {
    this.data.totalStars += amount;
    this.save();
  }
}

export const gameSave = new GameSave();

export function getLevelPool(level: Level): LessonWord[] {
  return level.words;
}

export function buildRound(level: Level): {
  word: LessonWord;
  options: string[];
  promptType: 'meaning' | 'char' | 'pinyin';
  answer: string;
} {
  const wordPool = getLevelPool(level);
  const word = Phaser.Math.RND.pick(wordPool) ?? level.words[0];
  const promptType = Phaser.Math.RND.pick(['meaning', 'char', 'pinyin']) as 'meaning' | 'char' | 'pinyin';

  const getValue = (entry: LessonWord): string => {
    if (promptType === 'char') {
      return entry.char;
    }
    if (promptType === 'pinyin') {
      return entry.pinyin;
    }
    return entry.meaning;
  };

  const answer = getValue(word);
  const options = new Set<string>([answer]);

  while (options.size < 4) {
    const candidate = Phaser.Math.RND.pick(level.words);
    const value = getValue(candidate);
    if (!options.has(value)) {
      options.add(value);
    }
  }

  return {
    word,
    options: Phaser.Utils.Array.Shuffle(Array.from(options)),
    promptType,
    answer,
  };
}

export function getLevelById(levelId: number): Level | undefined {
  return levelId >= 1 ? undefined : undefined;
}
