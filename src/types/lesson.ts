export type LessonWord = {
  id: string;
  char: string;
  pinyin: string;
  meaning: string;
  hint: string;
  emoji: string;
};

export type Level = {
  id: number;
  name: string;
  theme: string;
  description: string;
  difficulty: number;
  words: LessonWord[];
};
