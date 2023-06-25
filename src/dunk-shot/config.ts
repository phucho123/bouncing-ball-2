import Phaser from 'phaser'
import { PlayScene } from './PlayScene'

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
    scene: [PlayScene],
}
