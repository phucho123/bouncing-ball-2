import { ObjectManager } from './ObjectManager'
import { ShopScene } from './ShopScene'
import { CANVAS_HEIGHT, CANVAS_WIDTH, DELTA_TIME } from './constant'

export class PlayScene extends Phaser.Scene {
    public static start: boolean
    public static gameOver: boolean
    public static score: number
    public static highScore: number
    private scoreDisplay: Phaser.GameObjects.Text
    private highScoreDisplay: Phaser.GameObjects.Text
    private objectManager: ObjectManager
    private balls: string[]
    private currentBall: number

    constructor() {
        super({ key: 'Play Scene' })
    }

    public create() {
        console.log('create play scene')
        this.matter.world.setGravity(0, 0.4)
        PlayScene.start = false
        PlayScene.gameOver = false
        PlayScene.score = 0
        this.objectManager = ObjectManager.getInstance(this)
        this.balls = [
            'normalball',
            'basketball',
            'football',
            'volleyball',
            'tennisball',
            'pokeball',
            'cannonbolt',
            'dragonball',
        ]
        this.currentBall = 0

        this.scoreDisplay = this.add
            .text(0, 0, `${PlayScene.score}`, {
                fontSize: '180px',
                fontFamily: 'Arial',
                color: '#cccccc',
                testString: '123y2',
            })
            .setAlpha(0.5)
            .setOrigin(0.5)
            .setDepth(0)
        this.scoreDisplay.setPosition(CANVAS_WIDTH / 2, (CANVAS_HEIGHT / 2) * 0.5)

        this.highScoreDisplay = this.add
            .text(CANVAS_WIDTH / 2, 10, `High Score: ${PlayScene.highScore}`, {
                fontSize: '32px',
                fontFamily: 'Arial',
                color: '#000000',
            })
            .setOrigin(0.5, 0)
        this.objectManager.initial()
    }

    public update(time: number, delta: number): void {
        this.matter.world.setGravity(0, Math.min((0.5 * delta) / DELTA_TIME, 1.2))
        if (this.currentBall != ShopScene.chosenBall) {
            this.currentBall = ShopScene.chosenBall
            this.objectManager.changeBall(this.balls[this.currentBall])
        }

        if (PlayScene.score > PlayScene.highScore) {
            this.highScoreDisplay.setText(`HighScore: ${PlayScene.score}`)
        }

        if (PlayScene.gameOver) this.objectManager.handleGameOver()

        this.objectManager.changeColor()
        this.scoreDisplay.setText(`${(this, PlayScene.score)}`)

        this.objectManager.checkOutOfBound()
        this.objectManager.update(delta)
    }
}
