import Phaser from 'phaser';

import { AudioManager } from '../game/AudioManager';
import { buildRound, gameSave } from '../game/GameState';
import { progressManager } from '../game/ProgressManager';
import { type Level, type LessonWord } from '../data/lessons';

type PracticeData = {
  level: Level;
  missedWords: LessonWord[];
};

export class PracticeScene extends Phaser.Scene {
  private level!: Level;
  private missedWords: LessonWord[] = [];
  private roundIndex = 0;
  private score = 0;
  private stars = 0;
  private timeout?: Phaser.Time.TimerEvent;
  private currentWord?: LessonWord;
  private audioManager = new AudioManager();

  private promptText?: Phaser.GameObjects.Text;
  private answerButtons: Phaser.GameObjects.Container[] = [];
  private roundSummary?: Phaser.GameObjects.Text;
  private roundCounter?: Phaser.GameObjects.Text;

  constructor() {
    super('PracticeScene');
  }

  create(data: PracticeData): void {
    this.level = data.level;
    this.missedWords = data.missedWords || [];
    this.cameras.main.setBackgroundColor('#0f4c2f');

    const header = this.add.text(40, 30, '📝 Practice Mode', {
      fontFamily: 'Verdana',
      fontSize: '32px',
      color: '#86efac',
      fontStyle: 'bold',
    });
    header.setOrigin(0);

    const levelHint = this.add.text(40, 70, `Focusing on words you missed`, {
      fontFamily: 'Verdana',
      fontSize: '17px',
      color: '#a3e635',
    });
    levelHint.setOrigin(0);

    this.roundCounter = this.add.text(this.scale.width - 40, 30, `Words: ${this.missedWords.length}`, {
      fontFamily: 'Verdana',
      fontSize: '16px',
      color: '#a3e635',
    });
    this.roundCounter.setOrigin(1, 0);

    this.promptText = this.add.text(this.scale.width * 0.5, 170, '', {
      fontFamily: 'Verdana',
      fontSize: '28px',
      color: '#f8fafc',
      align: 'center',
      wordWrap: { width: 720 },
    });
    this.promptText.setOrigin(0.5);

    this.roundSummary = this.add.text(this.scale.width * 0.5, 260, '', {
      fontFamily: 'Verdana',
      fontSize: '18px',
      color: '#d1fae5',
    });
    this.roundSummary.setOrigin(0.5);

    const speakerButton = this.add.text(760, 80, '🔊', {
      fontFamily: 'Verdana',
      fontSize: '32px',
    });
    speakerButton.setInteractive({ useHandCursor: true });
    speakerButton.on('pointerdown', () => {
      if (this.currentWord) {
        this.audioManager.speak(this.currentWord.char);
      }
    });

    const quitButton = this.add.rectangle(110, 560, 170, 55, 0xf59e0b);
    quitButton.setInteractive({ useHandCursor: true });
    quitButton.on('pointerdown', () => this.scene.start('LevelSelectScene'));

    const quitText = this.add.text(110, 560, 'Back to levels', {
      fontFamily: 'Verdana',
      fontSize: '20px',
      color: '#111827',
      fontStyle: 'bold',
    });
    quitText.setOrigin(0.5);

    this.nextRound();
  }

  private nextRound(): void {
    if (this.roundIndex >= this.missedWords.length) {
      this.finishPractice();
      return;
    }

    this.roundIndex += 1;
    this.roundCounter?.setText(`Word ${this.roundIndex}/${this.missedWords.length}`);

    this.answerButtons.forEach((button) => {
      button.destroy(true);
    });
    this.answerButtons = [];

    this.showPracticeRound();
  }

  private showPracticeRound(): void {
    const word = this.missedWords[this.roundIndex - 1];
    if (!word) {
      this.finishPractice();
      return;
    }

    this.currentWord = word;
    this.audioManager.speak(word.char);

    // Randomly choose question type
    const promptType = Phaser.Math.RND.pick(['char', 'pinyin', 'meaning']) as 'char' | 'pinyin' | 'meaning';

    const getOptions = (): string[] => {
      const options = new Set<string>();
      const getValue = (w: LessonWord): string => {
        if (promptType === 'char') return w.char;
        if (promptType === 'pinyin') return w.pinyin;
        return w.meaning;
      };

      options.add(getValue(word));

      while (options.size < 4) {
        const candidate = Phaser.Math.RND.pick(this.level.words);
        const value = getValue(candidate);
        if (!options.has(value)) {
          options.add(value);
        }
      }

      return Phaser.Utils.Array.Shuffle(Array.from(options));
    };

    const options = getOptions();
    const answer = promptType === 'char' ? word.char : promptType === 'pinyin' ? word.pinyin : word.meaning;

    this.promptText?.setText(
      promptType === 'char'
        ? `Choose the character for "${word.meaning}"`
        : promptType === 'pinyin'
          ? `Pick the pinyin for ${word.char}`
          : `What does ${word.char} mean?`
    );

    const baseY = 330;

    options.forEach((option, index) => {
      const x = this.scale.width * 0.5 + (index % 2 === 0 ? -190 : 190);
      const y = baseY + Math.floor(index / 2) * 90;

      const buttonPanel = this.add.rectangle(x, y, 260, 60, 0x15803d);
      buttonPanel.setStrokeStyle(4, 0x86efac);
      buttonPanel.setInteractive({ useHandCursor: true });

      const label = this.add.text(x, y, option, {
        fontFamily: 'Verdana',
        fontSize: '24px',
        color: '#f8fafc',
      });
      label.setOrigin(0.5);

      const container = this.add.container(0, 0, [buttonPanel, label]);
      container.setPosition(x, y);
      container.setDepth(2);

      container.on('pointerdown', () => {
        this.handlePracticeAnswer(option, answer, word);
      });

      this.answerButtons.push(container);
    });
  }

  private handlePracticeAnswer(option: string, correctAnswer: string, word: LessonWord): void {
    const isCorrect = option === correctAnswer;
    progressManager.markWordResult(word.id, isCorrect);

    if (isCorrect) {
      this.score += 10;
      this.stars += 1;
      this.roundSummary?.setText(`Excellent! ${word.char} = ${word.meaning}`);
      this.roundSummary?.setStyle({ color: '#86efac' });
    } else {
      this.roundSummary?.setText(`Not quite. The answer is ${correctAnswer}.`);
      this.roundSummary?.setStyle({ color: '#fbbf24' });
    }

    this.answerButtons.forEach((button) => button.disableInteractive());
    this.time.delayedCall(1000, () => {
      this.nextRound();
    });
  }

  private finishPractice(): void {
    gameSave.addStars(Math.floor(this.stars / 2)); // Half stars for practice mode

    this.scene.start('PracticeResultScene', {
      wordsReviewed: this.missedWords.length,
      score: this.score,
      correctAnswers: this.stars,
    });
  }
}
