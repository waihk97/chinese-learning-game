import Phaser from 'phaser';

import { levels } from '../data/lessons';
import { gameSave } from '../game/GameState';

export class LevelSelectScene extends Phaser.Scene {
  constructor() {
    super('LevelSelectScene');
  }

  create(): void {
    this.cameras.main.setBackgroundColor('#0f172a');

    const title = this.add.text(this.scale.width * 0.5, 70, 'Choose a level', {
      fontFamily: 'Verdana',
      fontSize: '38px',
      color: '#fef3c7',
      fontStyle: 'bold',
    });
    title.setOrigin(0.5);

    const totalStars = this.add.text(40, 22, `Stars: ${gameSave.getTotalStars()}`, {
      fontFamily: 'Verdana',
      fontSize: '20px',
      color: '#fde68a',
    });

    const cards = levels.map((level, index) => {
      const x = this.scale.width * 0.5;
      const y = 150 + index * 110;
      const card = this.add.rectangle(x, y, 520, 80, gameSave.getCompletedLevels().includes(level.id) ? 0x10b981 : 0x1d4ed8);
      card.setStrokeStyle(4, 0xcbd5e1);
      card.setInteractive({ useHandCursor: true });

      const titleText = this.add.text(x - 170, y - 20, `${level.id}. ${level.name}`, {
        fontFamily: 'Verdana',
        fontSize: '24px',
        color: '#f8fafc',
      });
      const detailText = this.add.text(x - 170, y + 18, `${level.description}`, {
        fontFamily: 'Verdana',
        fontSize: '15px',
        color: '#dbeafe',
      });

      const badge = this.add.text(x + 185, y, gameSave.getCompletedLevels().includes(level.id) ? '✅' : '▶', {
        fontFamily: 'Verdana',
        fontSize: '30px',
        color: '#fef3c7',
      });
      badge.setOrigin(0.5);

      card.on('pointerdown', () => {
        this.scene.start('GameScene', { level });
      });

      return [card, titleText, detailText, badge];
    });

    const homeButton = this.add.rectangle(110, 560, 150, 52, 0xf59e0b);
    homeButton.setInteractive({ useHandCursor: true });
    homeButton.on('pointerdown', () => this.scene.start('MenuScene'));

    const homeText = this.add.text(110, 560, 'Home', {
      fontFamily: 'Verdana',
      fontSize: '22px',
      color: '#111827',
      fontStyle: 'bold',
    });
    homeText.setOrigin(0.5);

    this.add.text(40, 560, `Latest: ${gameSave.getLastLevelId() ?? 'None'}`, {
      fontFamily: 'Verdana',
      fontSize: '18px',
      color: '#c7d2fe',
    });

    this.children.add(totalStars);
    cards.flat().forEach((child) => this.children.add(child));
  }
}
