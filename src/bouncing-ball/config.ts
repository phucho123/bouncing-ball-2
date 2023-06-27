import Phaser from 'phaser'
import { GameOverScene } from './GameOverScene'
import { PlayScene } from './PlayScene'
import { StartScene } from './StartScene'
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constant'

export const config = {
    type: Phaser.AUTO,
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    backgroundColor: '#1d1d1d',
    parent: 'phaser-example',
    physics: {
        default: 'matter',
        matter: {
            enableSleeping: true,
        },
    },
    scene: [StartScene, PlayScene, GameOverScene],
}
