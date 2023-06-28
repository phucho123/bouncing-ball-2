import { GameOverScene } from './GameOverScene'
import { PlayScene } from './PlayScene'
import { CANVAS_HEIGHT, CANVAS_WIDTH, DELTA_TIME } from './constant'

export class ObjectManager {
    private scene: Phaser.Scene
    private gems: Phaser.GameObjects.Image[]
    private extraGems: Phaser.GameObjects.Image[]
    private spikes: Phaser.GameObjects.Image[]
    private extraSpikes: Phaser.GameObjects.Image[]
    private floors: Phaser.Physics.Matter.Image[]
    private extraFloors: Phaser.Physics.Matter.Image[]
    private pipes: Phaser.GameObjects.Rectangle[]
    private extraPipes: Phaser.GameObjects.Rectangle[]
    private hitPoints: Phaser.GameObjects.Rectangle[]
    private extraHitPoints: Phaser.GameObjects.Rectangle[]
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
        this.extraFloors = []
        this.pipes = []
        this.extraPipes = []
        this.gems = []
        this.extraGems = []
        this.spikes = []
        this.extraSpikes = []
        this.hitPoints = []
        this.extraHitPoints = []
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
        //         fontSize: '32px',
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

        if (this.extraFloors.length) {
            newFloor = this.extraFloors.shift()
        } else {
            newFloor = this.scene.matter.add.image(0, 0, 'floor').setBounce(0)
            this.setFloorCollideEvent(newFloor)
            console.log('create New Floor')
        }

        if (newFloor) {
            newFloor.setStatic(true).setY(y).setOrigin
            if (x == null) newFloor.setX(CANVAS_WIDTH + newFloor.displayWidth / 2)
            else newFloor.setX(x)
            newFloor.scaleX = scaleX
            newFloor.state = 0
            newFloor.setDepth(2)
            this.floors.push(newFloor)

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
        if (this.extraPipes.length) {
            newPipe = this.extraPipes.shift()
        } else {
            newPipe = this.scene.add.rectangle(x, y, width, height, 0xff0000)
            console.log('create New Pipe')
        }
        if (newPipe) {
            newPipe.displayWidth = width
            newPipe.displayHeight = height
            newPipe.setPosition(x, y)
            newPipe.fillColor = this.colors[this.colorIndex]
            this.pipes.push(newPipe)
        }
    }

    createGem(x: number, y: number) {
        const prob = Phaser.Math.Between(0, 100) % 5
        if (prob != 0) return
        let newGem
        if (this.extraGems.length) {
            newGem = this.extraGems.shift()
        } else {
            newGem = this.scene.add.image(x, y, 'gem').setScale(0.3)
            console.log('create New Gem')
        }
        if (newGem) {
            newGem.setState(0)
            newGem.setAlpha(1)
            newGem.setPosition(x, y - newGem.displayHeight / 2)

            this.gems.push(newGem)
        }
    }

    createHitpoint(x: number, y: number, width: number, height: number, diff_x: number) {
        let hitpoint: Phaser.GameObjects.Rectangle | undefined
        if (this.extraHitPoints.length) {
            hitpoint = this.extraHitPoints.shift()
            if (hitpoint) {
                hitpoint.setY(y)
                hitpoint.scaleX = width / (3 * hitpoint.width)
            }
        } else {
            console.log('create new hit point')
            hitpoint = this.scene.add.rectangle(x, y, width / 3, height, 0xff0000).setDepth(3)
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

            // const pipe = this.pipes.filter((pipe) => pipe.x == x)[0]
            // if (pipe) hitpoint.fillColor = pipe.fillColor
            hitpoint.fillColor = this.colors[this.colorIndex]
            hitpoint.setState(1)
            this.hitPoints.push(hitpoint)
        }
    }

    createSpike(x: number, y: number, width: number, scaleX: number) {
        if (scaleX < 1.1) return
        const tmp = Phaser.Math.Between(0, 5)
        if (tmp != 3) return
        const dir = Phaser.Math.Between(0, 1)
        let newSpike
        if (this.extraSpikes.length) {
            newSpike = this.extraSpikes.shift()
        } else {
            newSpike = this.scene.add.image(x, y, 'spike').setScale(0.3)
            console.log('create New Spike')
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
            this.spikes.push(newSpike)
        }
    }

    createObject(delta: number) {
        this.delta = delta
        this.ball.rotation += (Phaser.Math.DEG_TO_RAD * 3 * delta) / DELTA_TIME
        this.cnt -= Math.round((1 * delta) / DELTA_TIME)
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

        this.checkOutOfBoundOfArray(this.floors, this.extraFloors)
        this.checkOutOfBoundOfArray(this.gems, this.extraGems)
        this.checkOutOfBoundOfArray(this.pipes, this.extraPipes)
        this.checkOutOfBoundOfArray(this.spikes, this.extraSpikes)
        this.checkOutOfBoundOfArray(this.hitPoints, this.extraHitPoints)
    }

    moveFloor(delta: number) {
        // if (this.combo >= 2) this.comboDisplay.setText(`Perfect X${this.combo}`)
        // else this.comboDisplay.setText('Perfect')
        this.ball.setMass((3 * delta) / DELTA_TIME)
        // this.ball.setBounce((1.2 * DELTA_TIME) / delta)
        this.emitter.setX(this.emitter.x + (this.floorSpeed * delta) / DELTA_TIME)
        this.emitter.setY(this.emitter.y + (this.floorDownSpeed * delta) / DELTA_TIME)

        if (this.ball.x != 0) this.ball.setX(CANVAS_WIDTH / 2)
        for (let i = 0; i < this.floors.length; i++) {
            this.floors[i].setX(this.floors[i].x + (this.floorSpeed * delta) / DELTA_TIME)
            this.pipes[i].setX(this.pipes[i].x + (this.floorSpeed * delta) / DELTA_TIME)
            if (this.floors[i].state) {
                this.floors[i].setY(this.floors[i].y + (this.floorDownSpeed * delta) / DELTA_TIME)
                this.pipes[i].setY(this.pipes[i].y + (this.floorDownSpeed * delta) / DELTA_TIME)
            }
        }

        for (const gem of this.gems) {
            gem.setX(gem.x + (this.floorSpeed * delta) / DELTA_TIME)
            if (gem.state) gem.setY(gem.y + (this.floorDownSpeed * delta) / DELTA_TIME)
        }

        for (const spike of this.spikes) {
            spike.setX(spike.x + (this.floorSpeed * delta) / DELTA_TIME)
            if (spike.state) spike.setY(spike.y + (this.floorDownSpeed * delta) / DELTA_TIME)
        }

        for (const hitpoint of this.hitPoints) {
            hitpoint.setX(hitpoint.x + (this.floorSpeed * delta) / DELTA_TIME)
            if (hitpoint.state)
                hitpoint.setY(hitpoint.y + (this.floorDownSpeed * delta) / DELTA_TIME)
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

        this.clearArr(this.floors, this.extraFloors)
        this.clearArr(this.pipes, this.extraPipes)
        this.clearArr(this.gems, this.extraGems)
        this.clearArr(this.hitPoints, this.extraHitPoints)
        this.clearArr(this.spikes, this.extraSpikes)

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
        )[],
        extraArr: (
            | Phaser.GameObjects.Rectangle
            | Phaser.Physics.Matter.Image
            | Phaser.GameObjects.Image
        )[]
    ) {
        while (arr.length) {
            const removeItem = arr.shift()
            if (removeItem) {
                removeItem.setX(-1000)
                extraArr.push(removeItem)
            }
        }
    }
}
