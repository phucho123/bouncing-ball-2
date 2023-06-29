import { config } from './config'

export class GameManager {
    public static instance: GameManager | null = null
    constructor() {
        new Phaser.Game(config)
    }

    public static getInstance() {
        if (!GameManager.instance) {
            GameManager.instance = new GameManager()
        }
        return GameManager.instance
    }
}
