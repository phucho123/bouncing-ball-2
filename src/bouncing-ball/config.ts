import Phaser from 'phaser'
import { GameOverScene } from './GameOverScene'
import { PlayScene } from './PlayScene'
import { StartScene } from './StartScene'
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constant'
import { ShopScene } from './ShopScene'

export const config = {
    type: Phaser.AUTO,
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    backgroundColor: '#ebf9fa',
    // transparent: true,
    parent: 'game',
    physics: {
        default: 'matter',
        matter: {
            enableSleeping: true,
        },
    },
    scene: [StartScene, PlayScene, GameOverScene, ShopScene],
}
