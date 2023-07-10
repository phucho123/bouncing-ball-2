import { ShopScene } from './ShopScene'
import { BALLS, CANVAS_HEIGHT, CANVAS_WIDTH, DELTA_TIME } from '../constant/constant'
import { ObjectManagerTiled } from '../object/ObjectManagerTiled'
import { AudioManager } from '../audio/AudioManager'

export class PlayScene extends Phaser.Scene {
    public static start: boolean
    public static gameOver: boolean
    public static score: number
    public static highScore: number
    private scoreDisplay: Phaser.GameObjects.Text
    private highScoreDisplay: Phaser.GameObjects.Text
    private objectManager: ObjectManagerTiled
    private balls: string[]
    private currentBall: number
    private map: Phaser.Tilemaps.Tilemap
    private tiledObject: Phaser.Types.Tilemaps.TiledObject[]
    private levelNotify: Phaser.GameObjects.Text
    private level: number
    private levelNotifyTween: Phaser.Tweens.Tween
    private levelUpTimeout: NodeJS.Timeout
    private audioManager: AudioManager

    constructor() {
        super({ key: 'Play Scene' })
    }

    public create(): void {
        console.log('create play scene')
        this.audioManager = AudioManager.getInstance(this)
        this.level = 1
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
                this.audioManager.pauseSound()
            })

        this.highScoreDisplay = this.add
            .text(CANVAS_WIDTH / 2, 10, `High Score: ${PlayScene.highScore}`, {
                fontSize: '32px',
                fontFamily: 'Arial',
                color: '#000000',
            })
            .setOrigin(0.5, 0)
        this.levelNotify = this.add
            .text(CANVAS_WIDTH / 2, 100, `Level ${this.level}`, {
                fontSize: '64px',
                fontFamily: 'Arial',
                color: '#0000ff',
            })
            .setOrigin(0.5, 0)
            .setAlpha(0)
            .setDepth(10)

        this.objectManager.initial()
        this.levelUp('level1')
        this.audioManager.playBM()
    }

    public update(time: number, delta: number): void {
        if (!this.scene.isVisible('Play Scene')) {
            this.restart()
            this.levelUp('level1')
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
            this.levelUp('level1')
            this.audioManager.stopBM()
            if (this.scene.isSleeping('Game Over Scene')) {
                this.scene.sleep('Play Scene')
                this.scene.wake('Game Over Scene')
            } else this.scene.switch('Game Over Scene')
        }

        this.objectManager.changeColor()
        this.scoreDisplay.setText(`${(this, PlayScene.score)}`)

        this.objectManager.checkOutOfBound()
        this.objectManager.update(delta)
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
        clearTimeout(this.levelUpTimeout)
        this.objectManager.handleGameOver()
        this.level = 1
    }

    private levelUp(level: string) {
        this.audioManager.stopBM()
        this.audioManager.playBM()
        this.objectManager.restart()
        this.map.destroy()
        this.map = this.make.tilemap({ key: level })
        this.loadObjectsFromTilemap()
        this.levelNotify.setText(`Level ${this.level}`)
        if (this.levelNotifyTween) {
            this.tweens.remove(this.levelNotifyTween)
            this.levelNotify.setAlpha(0)
        }
        this.levelNotifyTween = this.add.tween({
            targets: this.levelNotify,
            duration: 300,
            alpha: 1,
            yoyo: true,
            repeat: 3,
        })
        this.level = (this.level + 1) % 3 == 0 ? 1 : (this.level + 1) % 3
        this.levelUpTimeout = setTimeout(() => {
            this.levelUp(`level${this.level}`)
        }, 40000)
    }
}
