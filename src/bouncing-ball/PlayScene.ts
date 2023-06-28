import { ObjectManager } from './ObjectManager'
import { CANVAS_HEIGHT, CANVAS_WIDTH, DELTA_TIME } from './constant'

export class PlayScene extends Phaser.Scene {
    public static start: boolean
    public static gameOver: boolean
    public static score: number
    private scoreDisplay: Phaser.GameObjects.Text
    private objectManager: ObjectManager

    constructor() {
        super({ key: 'Play Scene' })
    }

    preload() {
        this.load.image('normal-ball', 'assets/sprites/ball.png')
        this.load.image('basket-ball', 'assets/images/ball.png')
        this.load.image('pipe', 'assets/images/up-pipe.png')
        this.load.image('floor', 'assets/images/floor.png')
        this.load.image('gem', 'assets/images/gem.png')
        this.load.image('spike', 'assets/images/triangle.png')
        this.load.image('spark', 'assets/images/spark.png')
    }

    create() {
        console.log('create play scene')
        this.matter.world.setGravity(0, 0.5)
        PlayScene.start = false
        PlayScene.gameOver = false
        PlayScene.score = 0
        this.objectManager = new ObjectManager(this)

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
        // this.add
        //     .rectangle(0, CANVAS_HEIGHT * 0.95)
        //     .setOrigin(0)
        //     .setFillStyle(0xebf9fa, 0.3)
        //     .setSize(CANVAS_WIDTH, CANVAS_HEIGHT * 0.1)
        //     .setDepth(5)
        // .setStrokeStyle(0, 0xebf9fa)
    }

    // update(time) {
    //     if (PlayScene.gameOver) this.objectManager.handleGameOver()
    //     this.objectManager.changeColor()
    //     this.scoreDisplay.setText(`${(this, PlayScene.score)}`)

    //     this.objectManager.checkOutOfBound()
    //     if (PlayScene.start) {
    //         this.objectManager.createObject()
    //         this.objectManager.moveFloor()
    //     }
    // }
    // update(): void {
    //     if (PlayScene.gameOver) this.objectManager.handleGameOver()
    //     this.objectManager.changeColor()
    //     this.scoreDisplay.setText(`${(this, PlayScene.score)}`)

    //     this.objectManager.checkOutOfBound()
    //     if (PlayScene.start) {
    //         this.objectManager.createObject()
    //         this.objectManager.moveFloor()
    //     }
    // }
    update(time: number, delta: number): void {
        this.matter.world.setGravity(0, (0.5 * delta) / DELTA_TIME)
        // console.log(delta)
        if (PlayScene.gameOver) this.objectManager.handleGameOver()
        this.objectManager.changeColor()
        this.scoreDisplay.setText(`${(this, PlayScene.score)}`)
        // if (this.scoreDisplay.displayWidth > CANVAS_WIDTH) {
        //     console.log(this.scoreDisplay.displayWidth)
        //     this.scoreDisplay.setScale(0.4)
        // }

        this.objectManager.checkOutOfBound()
        if (PlayScene.start) {
            this.objectManager.createObject(delta)
            this.objectManager.moveFloor(delta)
        }
    }
}
