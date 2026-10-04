import Phaser from 'phaser';

import { type Level } from '../data/lessons';
import { gameSave } from '../game/GameState';

export class ResultScene extends Phaser.Scene {
  constructor() {
    super('ResultScene');
  }

  create(data: { level: Level; stars: number; score: number; isCompleted: boolean }): void {
    this.cameras.main.setBackgroundColor('#111827');

    const title = this.add.text(this.scale.width * 0.5, 120, data.isCompleted ? 'Level Complete!' : 'Keep Practicing!', {
      fontFamily: 'Verdana',
      fontSize: '42px',
      color: '#fef3c7',
      fontStyle: 'bold',
    });
    title.setOrigin(0.5);

    const scoreText = this.add.text(this.scale.width * 0.5, 210, `Stars earned: ${data.stars} / 5`, {
      fontFamily: 'Verdana',
      fontSize: '26px',
      color: '#bfdbfe',
    });
    scoreText.setOrigin(0.5);

    const levelText = this.add.text(this.scale.width * 0.5, 270, `${data.level.name} complete`, {
      fontFamily: 'Verdana',
      fontSize: '22px',
      color: '#d1fae5',
    });
    levelText.setOrigin(0.5);

    const totalStarsText = this.add.text(this.scale.width * 0.5, 330, `Total stars: ${gameSave.getTotalStars()}`, {
      fontFamily: 'Verdana',
      fontSize: '20px',
      color: '#fde68a',
    });
    totalStarsText.setOrigin(0.5);

    const replayButton = this.add.rectangle(this.scale.width * 0.5 - 160, 430, 220, 70, 0x22c55e);
    replayButton.setStrokeStyle(4, 0xe2e8f0);
    replayButton.setInteractive({ useHandCursor: true });
    replayButton.on('pointerdown', () => this.scene.start('GameScene', { level: data.level }));

    const replayText = this.add.text(this.scale.width * 0.5 - 160, 430, 'Play again', {
      fontFamily: 'Verdana',
      fontSize: '24px',
      color: '#052e16',
      fontStyle: 'bold',
    });
    replayText.setOrigin(0.5);

    const levelSelectButton = this.add.rectangle(this.scale.width * 0.5 + 160, 430, 220, 70, 0x38bdf8);
    levelSelectButton.setStrokeStyle(4, 0xe2e8f0);
    levelSelectButton.setInteractive({ useHandCursor: true });
    levelSelectButton.on('pointerdown', () => this.scene.start('LevelSelectScene'));

    const levelSelectText = this.add.text(this.scale.width * 0.5 + 160, 430, 'Levels', {
      fontFamily: 'Verdana',
      fontSize: '24px',
      color: '#0f172a',
      fontStyle: 'bold',
    });
    levelSelectText.setOrigin(0.5);
  }
}
