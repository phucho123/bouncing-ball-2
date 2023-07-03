import { AudioManager } from '../audio/AudioManager'
import { GameOverScene } from '../scene/GameOverScene'
import { PlayScene } from '../scene/PlayScene'
import {
    BALL_SIZE,
    CANVAS_HEIGHT,
    CANVAS_WIDTH,
    COLOR,
    DELTA_TIME,
    FALL_SPEED,
    FLOOR_DOWN_SPEED,
    FLOOR_SPEED,
    JUMP_SPEED,
    TIME_TO_CHANGE_COLOR,
    TIME_TO_SPAWN_OBJECT,
} from '../constant/constant'
import { Gem } from './Gem'
import { Spike } from './Spike'
import { Pipe } from './Pipe'
import { Hitpoint } from './Hitpoint'
import { Floor } from './Floor'
import { ShopScene } from '../scene/ShopScene'
import { Emitter } from './Emitter'

export class ObjectManager {
    public static instance: ObjectManager | null = null
    private scene: Phaser.Scene
    private gems: Gem
    private spikes: Spike
    private floors: Floor
    private pipes: Pipe
    private hitPoints: Hitpoint
    private ball: Phaser.Physics.Matter.Image
    private timeToSpawnObject: number
    private countTimeToSpawnObject: number
    private colors: number[]
    private floorSpeed: number
    private fallSpeed: number
    private jumpSpeed: number
    private timeToChangeColor: number
    private colorIndex: number
    private floorDownSpeed: number
    private emitter: Emitter
    private perfect: boolean
    private delta: number
    private combo: number
    private comboDisplay: Phaser.GameObjects.Text
    private timeToFire: number
    private audioManager: AudioManager

    constructor(scene: Phaser.Scene) {
        this.scene = scene
        this.floors = new Floor(this.scene)
        this.pipes = new Pipe(this.scene)
        this.gems = new Gem(this.scene)
        this.spikes = new Spike(this.scene)
        this.hitPoints = new Hitpoint(this.scene)
        this.colors = COLOR
        this.floorSpeed = FLOOR_SPEED
        this.jumpSpeed = JUMP_SPEED
        this.fallSpeed = FALL_SPEED
        this.timeToChangeColor = TIME_TO_CHANGE_COLOR
        this.colorIndex = 0
        this.timeToSpawnObject = TIME_TO_SPAWN_OBJECT
        this.countTimeToSpawnObject = this.timeToSpawnObject
        this.floorDownSpeed = FLOOR_DOWN_SPEED
        this.delta = DELTA_TIME
        this.timeToFire = 0
        this.perfect = false
        this.comboDisplay = this.scene.add
            .text(100, 200, 'Perfect', {
                fontSize: '20px',
                fontFamily: 'Arial',
                color: '#1c2070',
                testString: '1234y',
            })
            .setAlpha(0)
            .setOrigin(0.5)
            .setDepth(10)
        this.combo = 0
        this.audioManager = AudioManager.getInstance(this.scene)
    }

    public static getInstance(scene: Phaser.Scene): ObjectManager {
        if (!ObjectManager.instance) {
            ObjectManager.instance = new ObjectManager(scene)
        }
        return ObjectManager.instance
    }

    public initial(): void {
        for (let i = 1; i <= 2; i++) {
            this.createObject(Math.floor((i * CANVAS_WIDTH) / 2), CANVAS_WIDTH, 1)
        }
        this.initialBall()
        this.emitter = new Emitter(this.scene)
        this.audioManager.init()
    }

    public initialBall(): void {
        this.ball = this.scene.matter.add.image(0, 0, 'normalball')
        this.ball
            .setScale(BALL_SIZE / this.ball.width)
            .setCircle(this.ball.displayWidth / 2)
            .setFriction(0.005)
            .setBounce(0)
            .setMass(3)
            .setDepth(5)
            .setPosition(CANVAS_WIDTH / 2, BALL_SIZE / 2 + 10)
            .setOnCollide(() => {
                this.audioManager.playHitAudio()
                this.ball.setVelocity(0, Math.max((this.jumpSpeed * this.delta) / DELTA_TIME, -12))
                PlayScene.score++
                this.timeToChangeColor--
                PlayScene.start = true
                if (this.timeToFire > 0) {
                    this.timeToFire--
                }
                this.emitter.setHitEmitterPosition(
                    this.ball.x,
                    this.ball.y + this.ball.displayHeight / 2
                )
                this.emitter.startHitEmitter(this.perfect, this.delta)
            })
        this.scene.input.on('pointerdown', () => {
            if (!PlayScene.gameOver)
                this.ball.setVelocity(0, Math.min((this.fallSpeed * this.delta) / DELTA_TIME, 12))
        })
    }

    public setFloorCollideEvent(newFloor: Phaser.Physics.Matter.Image): void {
        newFloor.setOnCollide(() => {
            if (newFloor) {
                newFloor.setState(1)
                const pipe = this.pipes.get().filter((pipe) => {
                    return pipe.x == newFloor.x
                })
                if (pipe[0]) {
                    pipe[0].setState(1)
                }
                const gem = this.gems.get().filter((gem) => {
                    if (newFloor) return gem.x == newFloor.x
                })
                if (gem[0]) gem[0].setState(1)

                const spike = this.spikes.get().filter((spike) => {
                    if (newFloor)
                        return (
                            spike.x <= newFloor.x + newFloor.displayWidth / 2 &&
                            spike.x >= newFloor.x - newFloor.displayWidth / 2
                        )
                })

                if (spike[0]) spike[0].setState(1)

                this.hitPoints.create(
                    newFloor.x,
                    newFloor.y,
                    newFloor.displayWidth,
                    newFloor.displayHeight,
                    this.ball.x - newFloor.x,
                    this.colors[this.colorIndex]
                )

                if (this.ball.x - newFloor.x < -newFloor.displayWidth / 6) {
                    this.perfect = false
                    this.combo = 0
                    const spike = this.spikes
                        .get()
                        .filter(
                            (spike) =>
                                spike.x < newFloor.x &&
                                spike.x > newFloor.x - newFloor.displayWidth / 2
                        )[0]
                    if (spike && this.timeToFire <= 0) {
                        PlayScene.gameOver = true
                        this.audioManager.playSpikeAudio()
                    }
                    this.emitter.startHitEmitter(this.perfect, this.delta)
                } else if (this.ball.x - newFloor.x > newFloor.displayWidth / 6) {
                    this.combo = 0
                    this.perfect = false
                    const spike = this.spikes
                        .get()
                        .filter(
                            (spike) =>
                                spike.x > newFloor.x &&
                                spike.x < newFloor.x + newFloor.displayWidth / 2
                        )[0]
                    if (spike && this.timeToFire <= 0) {
                        PlayScene.gameOver = true
                        this.audioManager.playSpikeAudio()
                    }
                    this.emitter.startHitEmitter(this.perfect, this.delta)
                } else {
                    this.combo++
                    this.perfect = true
                    const gem = this.gems
                        .get()
                        .filter((gem) => gem.x == newFloor.x)[0] as Phaser.GameObjects.Image
                    if (gem && gem.alpha) {
                        gem.setAlpha(0)
                        PlayScene.score += 5
                        if (gem.texture.key == 'firegem') {
                            if (this.timeToFire <= 0) {
                                this.emitter.startFireEmitter()
                                const tmp = document.getElementById('game')
                                if (tmp) tmp.style.backgroundColor = '#000000'
                                this.audioManager.playFireAudio()
                            }
                            this.timeToFire += 20
                        } else {
                            ShopScene.playerGem++
                            localStorage.setItem('totalGem', ShopScene.playerGem.toString())
                        }
                        this.audioManager.playGemAudio()
                    }
                    this.emitter.startHitEmitter(this.perfect, this.delta)
                }
            }
        })
    }

    public createObject(x: number | null, y: number, scaleX: number): void {
        this.countTimeToSpawnObject = this.timeToSpawnObject
        const newFloor = this.floors.create(x, y, scaleX)
        if (newFloor) {
            if (newFloor.state == -1) {
                this.setFloorCollideEvent(newFloor)
            }
            newFloor.setState(0)
            this.pipes.create(
                newFloor.x,
                newFloor.y + newFloor.displayHeight / 2 + CANVAS_HEIGHT / 2,
                newFloor.displayWidth,
                CANVAS_HEIGHT,
                this.colors[this.colorIndex]
            )
            this.gems.create(newFloor.x, newFloor.y - newFloor.displayHeight / 2)
            this.spikes.create(
                newFloor.x,
                newFloor.y - newFloor.displayHeight / 2,
                newFloor.displayWidth,
                newFloor.scaleX
            )
        }
    }

    public handleGameOver(): void {
        GameOverScene.score = PlayScene.score
        this.restart()
        this.scene.scene.switch('Game Over Scene')
    }

    public changeColor(): void {
        if (this.timeToChangeColor <= 0) {
            this.colorIndex = (this.colorIndex + 1) % this.colors.length
            this.timeToChangeColor = 5
            for (const pipe of this.pipes.get()) {
                const pipeTmp = pipe as Phaser.GameObjects.Rectangle
                pipeTmp.fillColor = this.colors[this.colorIndex]
            }
            switch (this.colorIndex) {
                case 0:
                    this.emitter.setColorHitEmitter('red')
                    break
                case 1:
                    this.emitter.setColorHitEmitter('blue')
                    break
                case 2:
                    this.emitter.setColorHitEmitter('orange')
                    break
                case 3:
                    this.emitter.setColorHitEmitter('green')
                    break
                default:
                    break
            }
        }
    }

    public checkOutOfBound(): void {
        if (this.ball.y >= this.ball.displayHeight / 2 + CANVAS_HEIGHT || this.ball.x <= 0) {
            console.log('Game Over')
            this.audioManager.playDieAudio()
            PlayScene.gameOver = true
        }
    }

    public move(): void {
        if (this.emitter.hitEmitter.visible) {
            this.emitter.moveHitEmitter(
                (this.floorSpeed * this.delta) / DELTA_TIME,
                (this.floorDownSpeed * this.delta) / DELTA_TIME
            )
        }

        if (this.ball.x != 0) this.ball.setX(CANVAS_WIDTH / 2)

        this.floors.move(
            (this.floorSpeed * this.delta) / DELTA_TIME,
            (this.floorDownSpeed * this.delta) / DELTA_TIME
        )
        this.pipes.move(
            (this.floorSpeed * this.delta) / DELTA_TIME,
            (this.floorDownSpeed * this.delta) / DELTA_TIME
        )
        this.spikes.move(
            (this.floorSpeed * this.delta) / DELTA_TIME,
            (this.floorDownSpeed * this.delta) / DELTA_TIME
        )

        this.gems.move(
            (this.floorSpeed * this.delta) / DELTA_TIME,
            (this.floorDownSpeed * this.delta) / DELTA_TIME
        )
        this.hitPoints.move(
            (this.floorSpeed * this.delta) / DELTA_TIME,
            (this.floorDownSpeed * this.delta) / DELTA_TIME
        )
    }

    public update(delta: number): void {
        this.delta = delta
        this.ball.rotation += (Phaser.Math.DEG_TO_RAD * 3 * this.delta) / DELTA_TIME

        if (this.emitter.fireEmitter.visible)
            this.emitter.fireEmitter.setPosition(this.ball.x, this.ball.y)
        if (this.timeToFire <= 0) {
            this.audioManager.pauseFireAudio()
            this.emitter.stopFireEmitter()
        }
        if (PlayScene.start) {
            if (this.perfect) {
                if (this.combo >= 2) this.comboDisplay.setText(`Perfect x${this.combo}`)
                else {
                    this.comboDisplay.setText('Perfect')
                }
                this.comboDisplay
                    .setPosition(
                        this.ball.x,
                        this.ball.y -
                            this.ball.displayWidth / 2 -
                            this.comboDisplay.displayHeight / 2 -
                            30
                    )
                    .setAlpha(1)
            } else {
                this.comboDisplay.setAlpha(0)
            }

            this.countTimeToSpawnObject -= Math.round((1 * this.delta) / DELTA_TIME)
            if (this.countTimeToSpawnObject <= 0) {
                this.createObject(
                    null,
                    Phaser.Math.Between(CANVAS_HEIGHT * 0.5, CANVAS_HEIGHT * 0.6),
                    Phaser.Math.FloatBetween(1, 2.5) / 2
                )
            }
            this.move()
        }
    }

    public restart(): void {
        PlayScene.score = 0
        PlayScene.start = false
        PlayScene.gameOver = false
        this.emitter.stopHitEmitter()
        this.emitter.stopFireEmitter()
        this.ball.setVelocity(0, 0)
        this.timeToChangeColor = 5
        this.countTimeToSpawnObject = this.timeToSpawnObject
        this.comboDisplay.setAlpha(0)
        this.combo = 0
        this.timeToFire = 0

        this.floors.clear()
        this.hitPoints.clear()
        this.gems.clear()
        this.spikes.clear()
        this.pipes.clear()

        this.audioManager.pauseFireAudio()

        for (let i = 1; i <= 2; i++) {
            this.createObject(Math.floor((i * CANVAS_WIDTH) / 2), CANVAS_WIDTH, 1)
        }

        this.ball.setPosition(CANVAS_WIDTH / 2, BALL_SIZE / 2 + 10)
    }

    public changeBall(ball: string): void {
        this.ball.setTexture(ball)
        this.ball.setScale(BALL_SIZE / this.ball.width)
    }
}
