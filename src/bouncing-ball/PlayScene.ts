import { ObjectManager } from './ObjectManager'
import { ShopScene } from './ShopScene'
import { CANVAS_HEIGHT, CANVAS_WIDTH, DELTA_TIME } from './constant'

export class PlayScene extends Phaser.Scene {
    public static start: boolean
    public static gameOver: boolean
    public static score: number
    private scoreDisplay: Phaser.GameObjects.Text
    private objectManager: ObjectManager
    private balls: string[]
    private currentBall: number

    constructor() {
        super({ key: 'Play Scene' })
    }

    preload() {
        this.load.image('normalball', 'assets/sprites/ball.png')
        this.load.image('basketball', 'assets/images/ball.png')
        this.load.image('pokeball', 'assets/images/poke-ball.png')
        this.load.image('football', 'assets/images/football.png')
        this.load.image('pipe', 'assets/images/up-pipe.png')
        this.load.image('floor', 'assets/images/floor.png')
        this.load.image('gem', 'assets/images/gem.png')
        this.load.image('spike', 'assets/images/triangle.png')
        this.load.image('red', 'assets/images/red-partical.png')
        this.load.image('blue', 'assets/images/blue-partical.png')
        this.load.image('orange', 'assets/images/orange-partical.png')
        this.load.image('green', 'assets/images/green-partical.png')
    }

    create() {
        console.log('create play scene')
        this.matter.world.setGravity(0, 0.5)
        PlayScene.start = false
        PlayScene.gameOver = false
        PlayScene.score = 0
        this.objectManager = new ObjectManager(this)
        this.balls = ['normalball', 'basketball', 'pokeball', 'football']
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
        this.scoreDisplay.setPosition(CANVAS_WIDTH / 2, (CANVAS_HEIGHT / 2) * 0.5)
        this.objectManager.initial()
    }
    update(time: number, delta: number): void {
        this.matter.world.setGravity(0, (0.5 * delta) / DELTA_TIME)
        if (this.currentBall != ShopScene.chosenBall) {
            this.currentBall = ShopScene.chosenBall
            this.objectManager.changeBall(this.balls[this.currentBall])
        }
        // console.log(delta)
        if (PlayScene.gameOver) this.objectManager.handleGameOver()
        this.objectManager.changeColor()
        this.scoreDisplay.setText(`${(this, PlayScene.score)}`)

        this.objectManager.checkOutOfBound()
        if (PlayScene.start) {
            this.objectManager.update(delta)
        }
    }
}
