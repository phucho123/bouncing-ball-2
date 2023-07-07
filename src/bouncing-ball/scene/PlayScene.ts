import { ShopScene } from './ShopScene'
import { BALLS, CANVAS_HEIGHT, CANVAS_WIDTH, DELTA_TIME } from '../constant/constant'
import { ObjectManagerTiled } from '../object/ObjectManagerTiled'

export class PlayScene extends Phaser.Scene {
    public static start: boolean
    public static gameOver: boolean
    public static score: number
    public static highScore: number
    public static levelup = false
    private scoreDisplay: Phaser.GameObjects.Text
    private highScoreDisplay: Phaser.GameObjects.Text
    private objectManager: ObjectManagerTiled
    private balls: string[]
    private currentBall: number
    private map: Phaser.Tilemaps.Tilemap
    private tiledObject: Phaser.Types.Tilemaps.TiledObject[]

    constructor() {
        super({ key: 'Play Scene' })
    }

    public create(): void {
        console.log('create play scene')
        this.map = this.make.tilemap({ key: 'level1' })
        this.matter.world.setGravity(0, 0.4)
        PlayScene.start = false
        PlayScene.gameOver = false
        PlayScene.score = 0
        this.objectManager = ObjectManagerTiled.getInstance(this)
        this.balls = BALLS
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

        this.add
            .text(10, 10, 'II', {
                fontSize: '32px',
                fontFamily: 'Arial',
                color: '#000000',
                testString: '123y2',
            })
            .setOrigin(0)
            .setInteractive()
            .on('pointerdown', () => {
                this.scene.pause('Play Scene')
                if (this.scene.isSleeping('Pause Scene')) this.scene.wake('Pause Scene')
                else this.scene.launch('Pause Scene')
            })

        this.highScoreDisplay = this.add
            .text(CANVAS_WIDTH / 2, 10, `High Score: ${PlayScene.highScore}`, {
                fontSize: '32px',
                fontFamily: 'Arial',
                color: '#000000',
            })
            .setOrigin(0.5, 0)

        this.loadObjectsFromTilemap()
        this.objectManager.initial()
        setTimeout(() => this.levelUp('level2'), 30000)
    }

    public update(time: number, delta: number): void {
        if (!this.scene.isVisible('Play Scene')) {
            this.restart()
            this.scene.sleep('Play Scene')
        }
        this.matter.world.setGravity(0, Math.min((0.5 * delta) / DELTA_TIME, 1.2))
        if (this.currentBall != ShopScene.chosenBall) {
            this.currentBall = ShopScene.chosenBall
            this.objectManager.changeBall(this.balls[this.currentBall])
        }

        if (PlayScene.score > PlayScene.highScore) {
            this.highScoreDisplay.setText(`HighScore: ${PlayScene.score}`)
        }

        if (PlayScene.gameOver) {
            this.restart()
            if (this.scene.isSleeping('Game Over Scene')) {
                this.scene.sleep('Play Scene')
                this.scene.wake('Game Over Scene')
            } else this.scene.switch('Game Over Scene')
        }

        this.objectManager.changeColor()
        this.scoreDisplay.setText(`${(this, PlayScene.score)}`)

        this.objectManager.checkOutOfBound()
        this.objectManager.update(delta)

        if (PlayScene.levelup) this.levelUp('level2')
    }

    private loadObjectsFromTilemap(): void {
        const objects = this.map.getObjectLayer('objects')
        if (objects) {
            this.tiledObject = objects.objects
            this.tiledObject.forEach((object) => {
                if (object.type == 'pipe') {
                    if (
                        object.x &&
                        object.height &&
                        object.x &&
                        object.width &&
                        object.properties
                    ) {
                        this.objectManager.createObject(
                            object.x,
                            object.height,
                            object.width,
                            object.properties[1].value,
                            object.properties[0].value
                        )
                    }
                }
            })
        }
    }

    private restart() {
        this.objectManager.handleGameOver()
        this.tiledObject.forEach((object) => {
            if (object.type == 'pipe') {
                if (object.x && object.height && object.x && object.width && object.properties) {
                    this.objectManager.createObject(
                        object.x,
                        object.height,
                        object.width,
                        object.properties[1].value,
                        object.properties[0].value
                    )
                }
            }
        })
    }

    private levelUp(level: string) {
        this.objectManager.restart()
        this.map = this.make.tilemap({ key: level })
        this.loadObjectsFromTilemap()
        PlayScene.levelup = false
    }
}
