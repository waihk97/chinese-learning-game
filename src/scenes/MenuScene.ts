import Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create(): void {
    this.cameras.main.setBackgroundColor('#111827');

    const title = this.add.text(this.scale.width * 0.5, 120, 'Little Hanzi Quest', {
      fontFamily: 'Verdana',
      fontSize: '52px',
      color: '#fef3c7',
      fontStyle: 'bold',
    });
    title.setOrigin(0.5);

    const subtitle = this.add.text(this.scale.width * 0.5, 180, 'Learn Chinese one level at a time!', {
      fontFamily: 'Verdana',
      fontSize: '22px',
      color: '#bfdbfe',
    });
    subtitle.setOrigin(0.5);

    const startButton = this.add.rectangle(this.scale.width * 0.5, 330, 260, 74, 0x38bdf8);
    startButton.setStrokeStyle(4, 0xe0f2fe);
    startButton.setInteractive({ useHandCursor: true });

    const startText = this.add.text(this.scale.width * 0.5, 330, 'Start Learning', {
      fontFamily: 'Verdana',
      fontSize: '28px',
      color: '#0f172a',
      fontStyle: 'bold',
    });
    startText.setOrigin(0.5);

    startButton.on('pointerdown', () => {
      this.scene.start('LevelSelectScene');
    });

    const infoText = this.add.text(this.scale.width * 0.5, 470, 'Tap to learn characters, pinyin, and meanings with mini-games.', {
      fontFamily: 'Verdana',
      fontSize: '18px',
      color: '#d1fae5',
      align: 'center',
      wordWrap: { width: 650 },
    });
    infoText.setOrigin(0.5);
  }
}
