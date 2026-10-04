import Phaser from 'phaser';

export class PracticeResultScene extends Phaser.Scene {
  constructor() {
    super('PracticeResultScene');
  }

  create(data: { wordsReviewed: number; score: number; correctAnswers: number }): void {
    this.cameras.main.setBackgroundColor('#0f4c2f');

    const title = this.add.text(this.scale.width * 0.5, 100, '🎉 Practice Complete!', {
      fontFamily: 'Verdana',
      fontSize: '44px',
      color: '#86efac',
      fontStyle: 'bold',
    });
    title.setOrigin(0.5);

    const stats = this.add.text(this.scale.width * 0.5, 200, `Words reviewed: ${data.wordsReviewed}`, {
      fontFamily: 'Verdana',
      fontSize: '24px',
      color: '#a3e635',
    });
    stats.setOrigin(0.5);

    const correct = this.add.text(this.scale.width * 0.5, 250, `Correct answers: ${data.correctAnswers}/${data.wordsReviewed}`, {
      fontFamily: 'Verdana',
      fontSize: '22px',
      color: '#86efac',
    });
    correct.setOrigin(0.5);

    const accuracy = Math.round((data.correctAnswers / data.wordsReviewed) * 100);
    const accuracyText = this.add.text(this.scale.width * 0.5, 300, `Accuracy: ${accuracy}%`, {
      fontFamily: 'Verdana',
      fontSize: '20px',
      color: accuracy >= 80 ? '#86efac' : '#fbbf24',
    });
    accuracyText.setOrigin(0.5);

    const congratsText =
      accuracy >= 90
        ? "You're a master! 🏆"
        : accuracy >= 80
          ? "Great job! 👏"
          : 'Good effort! Keep practicing! 💪';

    const congrats = this.add.text(this.scale.width * 0.5, 360, congratsText, {
      fontFamily: 'Verdana',
      fontSize: '26px',
      color: '#fde68a',
    });
    congrats.setOrigin(0.5);

    const continueButton = this.add.rectangle(this.scale.width * 0.5, 460, 260, 70, 0x16a34a);
    continueButton.setStrokeStyle(4, 0x86efac);
    continueButton.setInteractive({ useHandCursor: true });
    continueButton.on('pointerdown', () => this.scene.start('LevelSelectScene'));

    const continueText = this.add.text(this.scale.width * 0.5, 460, 'Back to Levels', {
      fontFamily: 'Verdana',
      fontSize: '24px',
      color: '#f8fafc',
      fontStyle: 'bold',
    });
    continueText.setOrigin(0.5);
  }
}
