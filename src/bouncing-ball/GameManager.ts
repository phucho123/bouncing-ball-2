import { config } from './config/config'

export class GameManager {
    public static instance: GameManager | null = null
    constructor() {
        new Phaser.Game(config)
    }

    public static getInstance(): GameManager {
        if (!GameManager.instance) {
            GameManager.instance = new GameManager()
        }
        return GameManager.instance
    }
}
