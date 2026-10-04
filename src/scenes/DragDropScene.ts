import Phaser from 'phaser';

import { type LessonWord } from '../data/lessons';

type DragDropSceneData = {
  word: LessonWord;
  onComplete?: (success: boolean) => void;
};

export class DragDropScene extends Phaser.Scene {
  private word!: LessonWord;
  private onComplete?: (success: boolean) => void;
  private feedbackText?: Phaser.GameObjects.Text;

  constructor() {
    super('DragDropScene');
  }

  create(data: DragDropSceneData): void {
    this.word = data.word;
    this.onComplete = data.onComplete;
    this.cameras.main.setBackgroundColor('#0f172a');

    const title = this.add.text(this.scale.width * 0.5, 60, 'Match the meaning', {
      fontFamily: 'Verdana',
      fontSize: '34px',
      color: '#fef3c7',
      fontStyle: 'bold',
    });
    title.setOrigin(0.5);

    const prompt = this.add.text(this.scale.width * 0.5, 110, this.word.char, {
      fontFamily: 'Verdana',
      fontSize: '58px',
      color: '#f8fafc',
    });
    prompt.setOrigin(0.5);

    const answers = [this.word.meaning, 'cat', 'happy', 'blue'];
    const shuffled = Phaser.Utils.Array.Shuffle(answers);

    const dropZone = this.add.zone(this.scale.width * 0.75, 300, 220, 90);
    dropZone.setData('label', this.word.meaning);
    const dropBox = this.add.rectangle(dropZone.x, dropZone.y, 220, 90, 0x16a34a);
    dropBox.setStrokeStyle(4, 0xffffff);
    const dropText = this.add.text(dropZone.x, dropZone.y, 'Drop here', {
      fontFamily: 'Verdana',
      fontSize: '22px',
      color: '#f8fafc',
    });
    dropText.setOrigin(0.5);

    this.feedbackText = this.add.text(this.scale.width * 0.5, 470, '', {
      fontFamily: 'Verdana',
      fontSize: '24px',
      color: '#f8fafc',
    });
    this.feedbackText.setOrigin(0.5);

    const cards: Phaser.GameObjects.Container[] = [];

    shuffled.forEach((item, index) => {
      const card = this.add.container(220, 220 + index * 90);
      const box = this.add.rectangle(0, 0, 220, 60, 0x2563eb);
      box.setStrokeStyle(3, 0xe0f2fe);

      const label = this.add.text(0, 0, item, {
        fontFamily: 'Verdana',
        fontSize: '22px',
        color: '#f8fafc',
      });
      label.setOrigin(0.5);

      card.add([box, label]);
      card.setSize(220, 60);
      card.setData('label', item);
      card.setInteractive();
      this.input.setDraggable(card);

      card.on('dragstart', () => {
        card.setAlpha(0.8);
      });

      card.on('drag', (_, dragX, dragY) => {
        card.x = dragX;
        card.y = dragY;
      });

      card.on('dragend', () => {
        card.setAlpha(1);
      });

      cards.push(card);
    });

    this.input.on('drop', (pointer, gameObject, dropZoneObject) => {
      const selectedLabel = gameObject.getData('label') as string;
      const targetLabel = dropZoneObject.data.get('label') as string;

      if (selectedLabel === targetLabel) {
        this.feedbackText?.setText('Correct!');
        this.feedbackText?.setColor('#86efac');
        this.time.delayedCall(700, () => {
          this.onComplete?.(true);
          this.scene.stop();
        });
      } else {
        this.feedbackText?.setText('Try again!');
        this.feedbackText?.setColor('#fbbf24');
      }
    });

    this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });

    const continueButton = this.add.rectangle(120, 560, 160, 52, 0xf59e0b);
    continueButton.setInteractive({ useHandCursor: true });
    continueButton.on('pointerdown', () => {
      this.onComplete?.(false);
      this.scene.stop();
    });

    const continueText = this.add.text(120, 560, 'Skip', {
      fontFamily: 'Verdana',
      fontSize: '20px',
      color: '#111827',
      fontStyle: 'bold',
    });
    continueText.setOrigin(0.5);
  }
}
