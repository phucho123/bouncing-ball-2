import { GameManager } from './bouncing-ball/GameManager'

class Game {
    constructor() {
        console.log('Game created')
        GameManager.getInstance()
    }
}

new Game()
