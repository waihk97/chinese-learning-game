import Phaser from 'phaser';

import { levels, type Level, type LessonWord } from '../data/lessons';
import { buildRound, gameSave } from '../game/GameState';
import { progressManager } from '../game/ProgressManager';

export class GameScene extends Phaser.Scene {
  private level!: Level;
  private roundIndex = 0;
  private score = 0;
  private stars = 0;
  private wordsUsed = new Set<string>();
  private timeout?: Phaser.Time.TimerEvent;

  private promptText?: Phaser.GameObjects.Text;
  private answerButtons: Phaser.GameObjects.Container[] = [];
  private roundSummary?: Phaser.GameObjects.Text;

  constructor() {
    super('GameScene');
  }

  create(data: { level: Level }): void {
    this.level = data.level;
    this.cameras.main.setBackgroundColor('#102542');

    const header = this.add.text(40, 30, `${this.level.name} Level`, {
      fontFamily: 'Verdana',
      fontSize: '32px',
      color: '#fef3c7',
      fontStyle: 'bold',
    });

    const levelHint = this.add.text(40, 70, `Theme: ${this.level.theme}`, {
      fontFamily: 'Verdana',
      fontSize: '17px',
      color: '#dbeafe',
    });

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
    const totalRounds = 5;
    if (this.roundIndex >= totalRounds) {
      this.finishLevel();
      return;
    }

    this.roundIndex += 1;
    this.answerButtons.forEach((button) => button.destroy(true));
    this.answerButtons = [];

    const round = buildRound(this.level);
    const word = round.word;

    this.wordsUsed.add(word.id);
    this.promptText?.setText(round.promptType === 'char' ? `Tap the correct character for “${word.meaning}”` : round.promptType === 'pinyin' ? `Which pinyin matches ${word.char}?` : `Choose the meaning of ${word.char}`);

    const baseY = 330;
    const options = round.options;

    options.forEach((option, index) => {
      const x = this.scale.width * 0.5 + (index % 2 === 0 ? -190 : 190);
      const y = baseY + Math.floor(index / 2) * 90;

      const buttonPanel = this.add.rectangle(x, y, 260, 60, 0x2563eb);
      buttonPanel.setStrokeStyle(4, 0xe0f2fe);
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
      container.setSize(260, 60);

      container.on('pointerdown', () => {
        this.handleAnswer(option, round.answer, word);
      });

      buttonPanel.on('pointerdown', () => {
        this.handleAnswer(option, round.answer, word);
      });
      label.on('pointerdown', () => {
        this.handleAnswer(option, round.answer, word);
      });

      this.answerButtons.push(container);
    });
  }

  private handleAnswer(option: string, correctAnswer: string, word: LessonWord): void {
    const isCorrect = option === correctAnswer;
    progressManager.markWordResult(word.id, isCorrect);

    if (isCorrect) {
      this.score += 10;
      this.stars += 1;
      this.roundSummary?.setText(`Great job! ${word.char} = ${word.meaning}`);
      this.roundSummary?.setStyle({ color: '#86efac' });
    } else {
      this.roundSummary?.setText(`Nice try! The correct answer is ${correctAnswer}.`);
      this.roundSummary?.setStyle({ color: '#fbbf24' });
    }

    this.answerButtons.forEach((button) => button.disableInteractive());
    this.timeout = this.time.delayedCall(700, () => {
      this.nextRound();
    });
  }

  private finishLevel(): void {
    const isCompleted = this.score >= 40;
    gameSave.addStars(this.stars);
    if (isCompleted) {
      gameSave.setCompletedLevel(this.level.id);
    }

    this.scene.start('ResultScene', {
      level: this.level,
      stars: this.stars,
      score: this.score,
      isCompleted,
    });
  }
}
