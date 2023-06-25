import { config } from './config'

export class GameManager {
    constructor() {
        new Phaser.Game(config)
    }
}
