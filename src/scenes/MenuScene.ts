import Phaser from 'phaser';

import { levels, type Level, type LessonWord } from '../data/lessons';
import { progressManager } from './ProgressManager';

export type SaveData = {
  completedLevels: number[];
  lastLevelId: number | null;
  totalStars: number;
};

const SAVE_KEY = 'little-hanzi-quest-save';

export class GameSave {
  private data: SaveData = {
    completedLevels: [],
    lastLevelId: null,
    totalStars: 0,
  };

  public constructor() {
    this.load();
  }

  private load(): void {
    const raw = localStorage.getItem(SAVE_KEY);
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
    localStorage.setItem(SAVE_KEY, JSON.stringify(this.data));
  }

  public getCompletedLevels(): number[] {
    return this.data.completedLevels;
  }

  public getLastLevelId(): number | null {
    return this.data.lastLevelId;
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

  public getTotalStars(): number {
    return this.data.totalStars;
  }

  public getLevelProgress(levelId: number): number {
    return this.data.completedLevels.includes(levelId) ? 100 : 0;
  }
}

export const gameSave = new GameSave();

export function getLevelPool(level: Level): LessonWord[] {
  const dueOrdered = progressManager.getDueWords(level.words).slice() as LessonWord[];
  if (dueOrdered.length === 0) {
    return level.words;
  }
  return dueOrdered;
}

export function buildRound(level: Level): { word: LessonWord; options: string[]; promptType: 'meaning' | 'char' | 'pinyin'; answer: string } {
  const wordPool = getLevelPool(level);
  const word = Phaser.Math.RND.pick(wordPool) ?? level.words[0];
  const promptType = Phaser.Math.RND.pick(['meaning', 'char', 'pinyin']);

  let prompt = '';
  let answer = '';

  if (promptType === 'meaning') {
    prompt = `Choose the meaning of ${word.char}`;
    answer = word.meaning;
  } else if (promptType === 'char') {
    prompt = `Which character means “${word.meaning}”?`;
    answer = word.char;
  } else {
    prompt = `What is the pinyin for ${word.char}?`;
    answer = word.pinyin;
  }

  const options = [answer];
  while (options.length < 4) {
    const candidate = Phaser.Math.RND.pick(level.words.filter((entry) => !options.includes(entry.meaning === answer ? entry.meaning : entry[ promptType === 'char' ? 'char' : promptType === 'pinyin' ? 'pinyin' : 'meaning' ])));
    if (!candidate) {
      break;
    }
    const value = promptType === 'char' ? candidate.char : promptType === 'pinyin' ? candidate.pinyin : candidate.meaning;
    if (!options.includes(value)) {
      options.push(value);
    }
  }

  while (options.length < 4) {
    const fallback = Phaser.Math.RND.pick(level.words);
    const value = promptType === 'char' ? fallback.char : promptType === 'pinyin' ? fallback.pinyin : fallback.meaning;
    if (!options.includes(value)) {
      options.push(value);
    }
  }

  return {
    word,
    options: Phaser.Utils.Array.Shuffle(options),
    promptType,
    answer,
  };
}

export function getLevelById(levelId: number): Level | undefined {
  return levels.find((level) => level.id === levelId);
}
