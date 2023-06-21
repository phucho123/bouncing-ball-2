import Phaser from 'phaser'

class Example extends Phaser.Scene {
    private pipes: Phaser.Physics.Matter.Image[]
    private extraPipes: Phaser.Physics.Matter.Image[]
    private ball: Phaser.Physics.Matter.Image
    private start = false
    private timeToSpawnPipe: number
    private cnt: number
    private gameOver: boolean

    preload() {
        this.load.image('ball', 'assets/sprites/pangball.png')
        this.load.image('pipe', 'assets/images/up-pipe.png')
    }

    create() {
        this.pipes = []
        this.extraPipes = []
        this.timeToSpawnPipe = 150
        this.cnt = this.timeToSpawnPipe
        this.matter.world.setBounds(0, 0, 400, 600, 32, false, false, false, false)
        this.matter.world.setGravity(0, 0.3)

        for (let i = 1; i < 3; i++) {
            const pipe = this.matter.add.image(i * 200, 0, 'pipe')
            pipe.setY(700 - pipe.height / 2)
            pipe.setStatic(true)
            this.pipes.push(pipe)
        }

        this.ball = this.matter.add.image(
            Phaser.Math.Between(100, 700),
            Phaser.Math.Between(-600, 0),
            'ball'
            // undefined,
            // { shape: { type: 'polygon', radius: 18 }, ignorePointer: false }
        )

        this.ball.setCircle(this.ball.width / 2)
        this.ball.setFriction(0.005)
        this.ball.setBounce(1)
        this.ball.setMass(1)
        this.ball.setPosition(this.pipes[0].x, this.pipes[0].y - this.pipes[0].height / 2 - 300)

        // console.log(this.ball.getVelocity())

        this.input.on('pointerdown', () => {
            if (!this.gameOver) this.ball.setVelocity(0, 8)
        })
    }

    update() {
        if (this.ball.y >= this.ball.height / 2 + 600) {
            console.log('Game Over')
            this.gameOver = true
        }
        for (const pipe of this.pipes) {
            if (pipe.x + pipe.width / 2 <= 0) {
                const removePipe = this.pipes.shift()
                if (removePipe != undefined) {
                    this.extraPipes.push(removePipe)
                }
            }
        }

        if (this.start) {
            this.ball.rotation = this.ball.rotation + Phaser.Math.DEG_TO_RAD * 3
            this.cnt--
            if (this.cnt <= 0) {
                this.cnt = this.timeToSpawnPipe
                this.createPipe()
            }

            for (const pipe of this.pipes) {
                pipe.setX(pipe.x - 2)
                this.ball.setOnCollideWith(pipe, () => {
                    console.log(pipe.height, pipe.scaleY)
                    if (
                        pipe.y - this.ball.y >=
                        (pipe.height * pipe.scaleY) / 2 +
                            (this.ball.width * this.ball.scaleX) / 2 -
                            10
                    ) {
                        this.ball.setVelocity(0, -9)
                    } else {
                        console.log('Game Over')
                        this.gameOver = true
                    }
                })
                pipe.setOnCollide(() => {
                    pipe.active = false
                })
                if (!pipe.active) {
                    pipe.setY(pipe.y + 2)
                }
            }
        } else {
            for (const pipe of this.pipes) {
                this.ball.setOnCollideWith(pipe, () => {
                    console.log(pipe.height, pipe.scale)
                    if (
                        pipe.y - this.ball.y >=
                        (pipe.height * pipe.scaleY) / 2 +
                            (this.ball.width * this.ball.scaleX) / 2 -
                            10
                    ) {
                        this.ball.setVelocity(0, -9)
                        this.start = true
                    } else {
                        console.log('Game Over')
                        this.gameOver = true
                    }
                })
                pipe.setOnCollide(() => {
                    pipe.active = false
                })
                if (!pipe.active) {
                    pipe.setY(pipe.y + 2)
                }
            }
        }
    }

    createPipe() {
        let newPipe
        if (this.extraPipes.length) {
            newPipe = this.extraPipes.shift()
        } else {
            newPipe = this.matter.add.image(200, 100, 'pipe')
            console.log('create New pipe')
        }
        if (newPipe) {
            newPipe.setStatic(true)
            newPipe.setY(700 - newPipe.height / 2)
            newPipe.setX(400 + newPipe.width / 2)
            newPipe.scaleX = Phaser.Math.Between(1, 2) / 2
            newPipe.scaleY = Phaser.Math.FloatBetween(1, 2) / 2
            newPipe.active = true
            this.pipes.push(newPipe)
        }
    }
}

export const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 600,
    backgroundColor: '#1d1d1d',
    parent: 'phaser-example',
    physics: {
        default: 'matter',
        matter: {
            enableSleeping: true,
        },
    },
    scene: Example,
}
