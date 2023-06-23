import { GameManager } from './bouncing-ball/GameManager'

class Game {
    constructor() {
        console.log('Game created')
        new GameManager()
    }
}

new Game()
