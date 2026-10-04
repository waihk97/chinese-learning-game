import Phaser from 'phaser';

import { gameSave } from '../game/GameState';
import { type Level, type LessonWord } from '../data/lessons';

type ResultData = {
  level: Level;
  stars: number;
  score: number;
  isCompleted: boolean;
  missedWords?: LessonWord[];
};

export class ResultScene extends Phaser.Scene {
  constructor() {
    super('ResultScene');
  }

  create(data: ResultData): void {
    this.cameras.main.setBackgroundColor('#111827');

    const title = this.add.text(this.scale.width * 0.5, 80, data.isCompleted ? 'Level Complete!' : 'Keep Practicing!', {
      fontFamily: 'Verdana',
      fontSize: '48px',
      color: '#fef3c7',
      fontStyle: 'bold',
    });
    title.setOrigin(0.5);

    const starsText = this.add.text(this.scale.width * 0.5, 160, `Stars earned: ${data.stars} / 5`, {
      fontFamily: 'Verdana',
      fontSize: '26px',
      color: '#bfdbfe',
    });
    starsText.setOrigin(0.5);

    const scoreText = this.add.text(this.scale.width * 0.5, 210, `Score: ${data.score}/50`, {
      fontFamily: 'Verdana',
      fontSize: '20px',
      color: '#a5f3fc',
    });
    scoreText.setOrigin(0.5);

    const totalStarsText = this.add.text(this.scale.width * 0.5, 260, `Total stars: ${gameSave.getTotalStars()}`, {
      fontFamily: 'Verdana',
      fontSize: '20px',
      color: '#fde68a',
    });
    totalStarsText.setOrigin(0.5);

    if (data.missedWords && data.missedWords.length > 0) {
      const missedText = this.add.text(this.scale.width * 0.5, 310, `Words to review: ${data.missedWords.length}`, {
        fontFamily: 'Verdana',
        fontSize: '18px',
        color: '#fed7aa',
      });
      missedText.setOrigin(0.5);
    }

    const replayButton = this.add.rectangle(this.scale.width * 0.5 - 160, 400, 220, 70, 0x22c55e);
    replayButton.setStrokeStyle(4, 0xe2e8f0);
    replayButton.setInteractive({ useHandCursor: true });
    replayButton.on('pointerdown', () => this.scene.start('GameScene', { level: data.level }));

    const replayText = this.add.text(this.scale.width * 0.5 - 160, 400, 'Play again', {
      fontFamily: 'Verdana',
      fontSize: '24px',
      color: '#052e16',
      fontStyle: 'bold',
    });
    replayText.setOrigin(0.5);

    // Keep Practicing button - shows if there are missed words
    if (data.missedWords && data.missedWords.length > 0) {
      const practiceButton = this.add.rectangle(this.scale.width * 0.5 + 160, 400, 220, 70, 0xf59e0b);
      practiceButton.setStrokeStyle(4, 0xe2e8f0);
      practiceButton.setInteractive({ useHandCursor: true });
      practiceButton.on('pointerdown', () => {
        this.scene.start('PracticeScene', {
          level: data.level,
          missedWords: data.missedWords,
        });
      });

      const practiceText = this.add.text(this.scale.width * 0.5 + 160, 400, 'Keep Practicing', {
        fontFamily: 'Verdana',
        fontSize: '20px',
        color: '#111827',
        fontStyle: 'bold',
      });
      practiceText.setOrigin(0.5);
    }

    const levelSelectButton = this.add.rectangle(this.scale.width * 0.5, 500, 220, 70, 0x38bdf8);
    levelSelectButton.setStrokeStyle(4, 0xe2e8f0);
    levelSelectButton.setInteractive({ useHandCursor: true });
    levelSelectButton.on('pointerdown', () => this.scene.start('LevelSelectScene'));

    const levelSelectText = this.add.text(this.scale.width * 0.5, 500, 'Levels', {
      fontFamily: 'Verdana',
      fontSize: '24px',
      color: '#0f172a',
      fontStyle: 'bold',
    });
    levelSelectText.setOrigin(0.5);
  }
}
