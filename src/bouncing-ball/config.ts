import { GameOverScene } from './GameOverScene'
import { PlayScene } from './PlayScene'
import { StartScene } from './StartScene'

export const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 600,
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
