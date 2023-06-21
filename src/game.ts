import Phaser from 'phaser'
import { config } from './bouncing-ball/Scene'

class Game {
    constructor() {
        console.log('Game created')
        new Phaser.Game(config)
    }
}

new Game()
