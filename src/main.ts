import Phaser from 'phaser';

import './styles.css';
import { MenuScene } from './scenes/MenuScene';
import { LevelSelectScene } from './scenes/LevelSelectScene';
import { GameScene } from './scenes/GameScene';
import { DragDropScene } from './scenes/DragDropScene';
import { ResultScene } from './scenes/ResultScene';
import { PracticeScene } from './scenes/PracticeScene';
import { PracticeResultScene } from './scenes/PracticeResultScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 900,
  height: 620,
  parent: 'app',
  backgroundColor: '#0f172a',
  pixelArt: false,
  scene: [MenuScene, LevelSelectScene, GameScene, DragDropScene, ResultScene, PracticeScene, PracticeResultScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

new Phaser.Game(config);
