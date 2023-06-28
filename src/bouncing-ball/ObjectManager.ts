import { GameOverScene } from './GameOverScene'
import { PlayScene } from './PlayScene'
import { CANVAS_HEIGHT, CANVAS_WIDTH, DELTA_TIME } from './constant'

export class ObjectManager {
    private scene: Phaser.Scene
    private gems: Phaser.GameObjects.Image[]
    private spikes: Phaser.GameObjects.Image[]
    private floors: Phaser.Physics.Matter.Image[]
    private pipes: Phaser.GameObjects.Rectangle[]
    private hitPoints: Phaser.GameObjects.Rectangle[]
    private ball: Phaser.Physics.Matter.Image
    private timeToSpawnPipe: number
    private cnt: number
    private colors: number[]
    private floorSpeed: number
    private fallSpeed: number
    private jumpSpeed: number
    private timeToChangeColor: number
    private colorIndex: number
    private floorDownSpeed: number
    private emitter: Phaser.GameObjects.Particles.ParticleEmitter
    private perfect: boolean
    private delta: number
    // private tween: Phaser.Tweens.Tween
    // private combo: number
    // private comboDisplay: Phaser.GameObjects.Text

    constructor(scene: Phaser.Scene) {
        this.scene = scene
        this.floors = []
        this.pipes = []
        this.gems = []
        this.spikes = []
        this.hitPoints = []
        this.colors = [0xf07878, 0x9ad2f5, 0xf5d095, 0xacfabd]
        this.floorSpeed = -2.5
        this.jumpSpeed = -8
        this.fallSpeed = 8
        this.timeToChangeColor = 5
        this.colorIndex = 0
        this.timeToSpawnPipe = 40
        this.cnt = this.timeToSpawnPipe
        this.floorDownSpeed = 2
        this.delta = DELTA_TIME
        // this.comboDisplay = this.scene.add
        //     .text(100, 200, 'Perfect', {
        //         fontSize: '16px',
        //         fontFamily: 'Arial',
        //         color: '#ffffff',
        //         testString: '1234y',
        //     })
        //     .setAlpha(0)
        // this.comboDisplay.setX(200 - this.comboDisplay.displayWidth / 2)
        // this.tween = this.scene.tweens.add({
        //     targets: this.comboDisplay,
        //     duration: 1000,
        //     alpha: 1,
        //     repeat: -1,
        // })
        // this.combo = 0
    }

    initial() {
        // if (this.tween.isPlaying()) this.tween.pause()

        this.ball = this.scene.matter.add.image(0, 0, 'normal-ball')

        for (let i = 2; i <= 4; i++) {
            this.createFloor(Math.floor((i * CANVAS_WIDTH) / 4), CANVAS_WIDTH, 1)
        }

        console.log(this.floors.length)

        this.perfect = false
        this.emitter = this.scene.add
            .particles(100, 150, 'spark', {
                lifespan: 2000,
                speed: { min: 100, max: 200 },
                scale: { start: 0.8, end: 0 },
                gravityX: -500,
                emitting: false,
            })
            .setScale(0.2)

        this.ball
            .setScale(0.12)
            .setCircle(this.ball.displayWidth / 2)
            .setFriction(0.005)
            .setBounce(0)
            .setMass(3)
            .setDepth(5)
            .setPosition(
                CANVAS_WIDTH / 2,
                this.floors[0].y - this.floors[0].displayHeight / 2 - CANVAS_HEIGHT / 2
            )
            .setOnCollide(() => {
                this.ball.setVelocity(0, Math.max((this.jumpSpeed * this.delta) / DELTA_TIME, -10))
                PlayScene.score++
                this.timeToChangeColor--
                PlayScene.start = true
                this.emitter.setPosition(this.ball.x, this.ball.y + this.ball.displayWidth / 2)
                if (!this.emitter.visible) this.emitter.setVisible(true)
                if (this.perfect) {
                    this.emitter.gravityX = 0
                    this.emitter.gravityY = (-500 * this.delta) / DELTA_TIME
                    this.emitter.speed = (300 * this.delta) / DELTA_TIME
                    this.emitter.explode(10)
                } else {
                    this.emitter.gravityX = (-500 * this.delta) / DELTA_TIME
                    this.emitter.gravityY = 0
                    this.emitter.speed = (150 * this.delta) / DELTA_TIME
                    this.emitter.explode(3)
                }
            })

        this.scene.input.on('pointerdown', () => {
            if (!PlayScene.gameOver)
                this.ball.setVelocity(0, (this.fallSpeed * this.delta) / DELTA_TIME)
        })
    }

    setFloorCollideEvent(newFloor: Phaser.Physics.Matter.Image) {
        newFloor.setOnCollide(() => {
            if (newFloor) {
                newFloor.setState(1)
                const pipe = this.pipes.filter((pipe) => {
                    return pipe.x == newFloor.x
                })
                if (pipe[0]) {
                    pipe[0].setState(1)
                }
                const gem = this.gems.filter((gem) => {
                    if (newFloor) return gem.x == newFloor.x
                })
                if (gem[0]) gem[0].setState(1)

                const spike = this.spikes.filter((spike) => {
                    if (newFloor)
                        return (
                            spike.x <= newFloor.x + newFloor.displayWidth / 2 &&
                            spike.x >= newFloor.x - newFloor.displayWidth / 2
                        )
                })

                if (spike[0]) spike[0].setState(1)

                this.createHitpoint(
                    newFloor.x,
                    newFloor.y,
                    newFloor.displayWidth,
                    newFloor.displayHeight,
                    this.ball.x - newFloor.x
                )
            }
        })
    }

    createFloor(x: number | null, y: number, scaleX: number) {
        let newFloor: Phaser.Physics.Matter.Image | undefined

        const newFloorFilter = this.floors.filter((floor) => floor.x + floor.displayWidth / 2 <= 0)
        if (newFloorFilter.length == 0) {
            newFloor = this.scene.matter.add.image(0, 0, 'floor').setBounce(0)
            this.setFloorCollideEvent(newFloor)
            console.log('create New Floor')
            this.floors.push(newFloor)
        } else {
            newFloor = newFloorFilter[0]
        }

        if (newFloor) {
            newFloor.setStatic(true).setY(y).setOrigin
            if (x == null) newFloor.setX(CANVAS_WIDTH + newFloor.displayWidth / 2)
            else newFloor.setX(x)
            newFloor.scaleX = scaleX
            newFloor.setState(0)
            newFloor.setDepth(2)

            this.createPipe(
                newFloor.x,
                newFloor.y + newFloor.displayHeight / 2 + CANVAS_HEIGHT / 2,
                newFloor.displayWidth,
                CANVAS_HEIGHT
            )

            this.createGem(newFloor.x, newFloor.y - newFloor.displayHeight / 2)

            this.createSpike(
                newFloor.x,
                newFloor.y - newFloor.displayHeight / 2,
                newFloor.displayWidth,
                newFloor.scaleX
            )
        }
    }

    createPipe(x: number, y: number, width: number, height: number) {
        let newPipe

        const newPipeFilter = this.pipes.filter((pipe) => pipe.x + pipe.displayWidth / 2 <= 0)
        if (newPipeFilter.length == 0) {
            newPipe = this.scene.add.rectangle(x, y, width, height, 0xff0000)
            console.log('create New Pipe')
            this.pipes.push(newPipe)
        } else {
            newPipe = newPipeFilter[0]
        }
        if (newPipe) {
            newPipe.displayWidth = width
            newPipe.displayHeight = height
            newPipe.setPosition(x, y)
            newPipe.setState(0)
            newPipe.fillColor = this.colors[this.colorIndex]
        }
    }

    createGem(x: number, y: number) {
        const prob = Phaser.Math.Between(0, 100) % 5
        if (prob != 0) return
        let newGem

        const newGemFilter = this.gems.filter(
            (gem) => gem.x + gem.displayWidth / 2 <= 0 || gem.alpha == 0
        )
        if (newGemFilter.length == 0) {
            newGem = this.scene.add.image(x, y, 'gem').setScale(0.3)
            this.gems.push(newGem)
            console.log('create New Gem')
        } else {
            newGem = newGemFilter[0]
        }

        if (newGem) {
            newGem.setState(0)
            newGem.setAlpha(1)
            newGem.setPosition(x, y - newGem.displayHeight / 2)
        }
    }

    createHitpoint(x: number, y: number, width: number, height: number, diff_x: number) {
        let hitpoint: Phaser.GameObjects.Rectangle | undefined
        const newHitpointFilter = this.hitPoints.filter(
            (hitpoint) => hitpoint.x + hitpoint.displayWidth / 2 <= 0
        )
        if (newHitpointFilter.length == 0) {
            hitpoint = this.scene.add.rectangle(x, y, width / 3, height, 0xff0000).setDepth(3)
            this.hitPoints.push(hitpoint)
            console.log('create New Spike')
        } else {
            hitpoint = newHitpointFilter[0]
            if (hitpoint) {
                hitpoint.setY(y)
                hitpoint.scaleX = width / (3 * hitpoint.width)
            }
        }
        if (hitpoint != undefined) {
            if (diff_x < -width / 6) {
                // this.combo = 0
                // if (this.tween.isPlaying()) this.tween.pause()
                hitpoint.setX(x - width / 3)
                this.perfect = false
                const spike = this.spikes.filter(
                    (spike) => spike.x < x && spike.x > x - width / 2
                )[0]
                if (spike) PlayScene.gameOver = true
            } else if (diff_x > width / 6) {
                // this.combo = 0
                // if (this.tween.isPlaying()) this.tween.pause()
                hitpoint.setX(x + width / 3)
                this.perfect = false
                const spike = this.spikes.filter(
                    (spike) => spike.x > x && spike.x < x + width / 2
                )[0]
                if (spike) PlayScene.gameOver = true
            } else {
                hitpoint.setX(x)
                this.perfect = true
                const gem = this.gems.filter((gem) => gem.x == x)[0]
                if (gem && gem.alpha) {
                    gem.setAlpha(0)
                    PlayScene.score += 5
                }
                // this.combo++
                // if (!this.tween.isPlaying()) this.tween.play()
            }
            hitpoint.fillColor = this.colors[this.colorIndex]
            hitpoint.setState(1)
        }
    }

    createSpike(x: number, y: number, width: number, scaleX: number) {
        if (scaleX < 1.1) return
        const tmp = Phaser.Math.Between(0, 5)
        if (tmp != 3) return
        const dir = Phaser.Math.Between(0, 1)
        let newSpike
        const newSpikeFilter = this.spikes.filter((spike) => spike.x + spike.displayWidth / 2 <= 0)
        if (newSpikeFilter.length == 0) {
            newSpike = this.scene.add.image(x, y, 'spike').setScale(0.3)
            this.spikes.push(newSpike)
            console.log('create New Spike')
        } else {
            newSpike = newSpikeFilter[0]
        }

        if (newSpike) {
            newSpike.setState(0)
            newSpike.setAlpha(1).setDepth(0)
            if (dir == 0)
                newSpike.setPosition(
                    x - width / 2 + newSpike.displayWidth / 2,
                    y - newSpike.displayHeight / 2
                )
            else
                newSpike.setPosition(
                    x + width / 2 - newSpike.displayWidth / 2,
                    y - newSpike.displayHeight / 2
                )
        }
    }

    createObject() {
        this.ball.rotation += (Phaser.Math.DEG_TO_RAD * 3 * this.delta) / DELTA_TIME
        this.cnt -= Math.round((1 * this.delta) / DELTA_TIME)
        if (this.cnt <= 0) {
            this.cnt = this.timeToSpawnPipe
            this.createFloor(
                null,
                Phaser.Math.Between(CANVAS_HEIGHT * 0.5, CANVAS_HEIGHT * 0.6),
                Phaser.Math.FloatBetween(1, 2.5) / 2
            )
        }
    }

    handleGameOver() {
        GameOverScene.score = PlayScene.score
        this.restart()
        this.scene.scene.switch('Game Over Scene')
        // this.scene.tweens.add({
        //     targets: [this.ball, ...this.pipes, ...this.floors, ...this.gems, this.scoreDisplay],
        //     duration: 1000,
        //     yoyo: false,
        //     alpha: 0,
        //     onComplete: () => {
        //         //
        //     },
        // })
    }

    changeColor() {
        if (this.timeToChangeColor <= 0) {
            this.colorIndex = (this.colorIndex + 1) % this.colors.length
            this.timeToChangeColor = 5
            for (const pipe of this.pipes) {
                pipe.fillColor = this.colors[this.colorIndex]
            }
        }
    }

    checkOutOfBoundOfArray(
        arr: (
            | Phaser.GameObjects.Rectangle
            | Phaser.Physics.Matter.Image
            | Phaser.GameObjects.Image
        )[],
        extraArr: (
            | Phaser.GameObjects.Rectangle
            | Phaser.Physics.Matter.Image
            | Phaser.GameObjects.Image
        )[]
    ) {
        for (const item of arr) {
            if (item.x + item.displayWidth / 2 <= 0) {
                const removeItem = arr.shift()
                if (removeItem != undefined) {
                    extraArr.push(removeItem)
                }
            } else break
        }
    }

    checkOutOfBound() {
        if (this.ball.y >= this.ball.displayHeight / 2 + CANVAS_HEIGHT || this.ball.x <= 0) {
            console.log('Game Over')
            PlayScene.gameOver = true
        }
    }

    update(delta: number) {
        this.delta = delta
        this.createObject()
        this.moveFloor()
    }

    moveFloor() {
        // if (this.combo >= 2) this.comboDisplay.setText(`Perfect X${this.combo}`)
        // else this.comboDisplay.setText('Perfect')
        this.ball.setMass((3 * this.delta) / DELTA_TIME)
        // this.ball.setBounce((1.2 * DELTA_TIME) / delta)
        this.emitter.setX(this.emitter.x + (this.floorSpeed * this.delta) / DELTA_TIME)
        this.emitter.setY(this.emitter.y + (this.floorDownSpeed * this.delta) / DELTA_TIME)

        if (this.ball.x != 0) this.ball.setX(CANVAS_WIDTH / 2)

        this.moveGameObject(this.floors)
        this.moveGameObject(this.pipes)
        this.moveGameObject(this.spikes)
        this.moveGameObject(this.gems)
        this.moveGameObject(this.hitPoints)
    }

    moveGameObject(
        arr: (
            | Phaser.GameObjects.Rectangle
            | Phaser.Physics.Matter.Image
            | Phaser.GameObjects.Image
        )[]
    ) {
        for (const item of arr) {
            item.setX(item.x + (this.floorSpeed * this.delta) / DELTA_TIME)
            if (item.state) {
                item.setY(item.y + (this.floorDownSpeed * this.delta) / DELTA_TIME)
            }
        }
    }

    restart() {
        this.emitter.setVisible(false)
        this.ball.setVelocity(0, 0)
        this.timeToChangeColor = 5
        PlayScene.score = 0
        PlayScene.start = false
        PlayScene.gameOver = false
        this.cnt = this.timeToSpawnPipe

        this.clearArr(this.floors)
        this.clearArr(this.pipes)
        this.clearArr(this.spikes)
        this.clearArr(this.hitPoints)
        this.clearArr(this.gems)

        for (let i = 2; i <= 4; i++) {
            this.createFloor(Math.floor((i * CANVAS_WIDTH) / 4), CANVAS_WIDTH, 1)
        }

        this.ball.setPosition(
            CANVAS_WIDTH / 2,
            this.floors[0].y - this.floors[0].displayHeight / 2 - CANVAS_HEIGHT / 2
        )
    }

    clearArr(
        arr: (
            | Phaser.GameObjects.Rectangle
            | Phaser.Physics.Matter.Image
            | Phaser.GameObjects.Image
        )[]
    ) {
        for (const item of arr) {
            item.setX(-1000)
        }
    }
}
