import { ObjectManager } from './ObjectManager'

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
        this.load.image('ball', 'assets/sprites/ball.png')
        this.load.image('pipe', 'assets/images/up-pipe.png')
        this.load.image('floor', 'assets/images/floor.png')
        this.load.image('gem', 'assets/images/gem.png')
        this.load.image('spike', 'assets/images/triangle.png')
    }

    create() {
        this.matter.world.setGravity(0, 0.4)
        PlayScene.start = false
        PlayScene.gameOver = false
        PlayScene.score = 0
        this.objectManager = new ObjectManager(this)

        this.scoreDisplay = this.add
            .text(200, 100, `${PlayScene.score}`, {
                fontSize: '100px',
                fontFamily: 'Arial',
                color: '#ffffff',
                testString: '12342',
            })
            .setStroke('black', 1)
            .setAlpha(0.5)
        this.scoreDisplay.setX(this.scoreDisplay.x - this.scoreDisplay.width / 2)
        this.objectManager.initial()
    }

    update() {
        if (PlayScene.gameOver) this.objectManager.handleGameOver()
        this.objectManager.changeColor()
        this.scoreDisplay.setText(`${(this, PlayScene.score)}`)
        this.objectManager.checkOutOfBound()
        if (PlayScene.start) {
            this.objectManager.createObject()
            this.objectManager.moveFloor()
        }
    }
}
