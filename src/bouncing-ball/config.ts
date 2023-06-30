import Phaser from 'phaser'
import { GameOverScene } from './GameOverScene'
import { PlayScene } from './PlayScene'
import { StartScene } from './StartScene'
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constant'
import { ShopScene } from './ShopScene'
import { LoadingScene } from './LoadingScene'

export const config = {
    type: Phaser.AUTO,
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    backgroundColor: '#ebf9fa',
    parent: 'game',
    physics: {
        default: 'matter',
        matter: {
            enableSleeping: true,
        },
    },
    scene: [LoadingScene, StartScene, PlayScene, GameOverScene, ShopScene],
}
