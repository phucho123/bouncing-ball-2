import Phaser from 'phaser'

class Example extends Phaser.Scene {
    private floors: Phaser.Physics.Matter.Image[]
    private extraFloors: Phaser.Physics.Matter.Image[]
    private pipes: Phaser.GameObjects.Rectangle[]
    private extraPipes: Phaser.GameObjects.Rectangle[]
    private ball: Phaser.Physics.Matter.Image
    private start = false
    private timeToSpawnPipe: number
    private cnt: number
    private gameOver: boolean
    private colors: number[]
    private floorSpeed: number
    private fallSpeed: number
    private jumpSpeed: number
    private score: number
    private scoreDisplay: Phaser.GameObjects.Text

    preload() {
        this.load.image('ball', 'assets/sprites/pangball.png')
        this.load.image('pipe', 'assets/images/up-pipe.png')
        this.load.image('floor', 'assets/images/floor.png')
    }

    create() {
        this.floors = []
        this.extraFloors = []
        this.pipes = []
        this.extraPipes = []
        this.colors = [0x8cff66, 0x668cff, 0xff8533, 0xdf80ff, 0xff3333]
        this.floorSpeed = -2
        this.jumpSpeed = -8
        this.fallSpeed = 8
        this.score = 0

        this.timeToSpawnPipe = 100
        this.cnt = this.timeToSpawnPipe
        this.matter.world.setBounds(0, 0, 400, 600, 32, false, false, false, false)
        this.matter.world.setGravity(0, 0.3)

        for (let i = 1; i < 3; i++) {
            const floor = this.matter.add.image(i * 200, 0, 'floor')
            floor.setY(400)
            floor.setStatic(true)
            this.floors.push(floor)

            const pipe = this.add.rectangle(
                floor.x,
                0,
                floor.width,
                600 - floor.y - floor.height / 2,
                0x0000ff
            )
            pipe.setY(floor.y + floor.height / 2 + pipe.height / 2)

            pipe.fillColor = this.colors[Phaser.Math.Between(0, this.colors.length - 1)]
            this.pipes.push(pipe)
        }

        this.ball = this.matter.add.image(
            Phaser.Math.Between(100, 700),
            Phaser.Math.Between(-600, 0),
            'ball'
        )

        this.ball.setCircle(this.ball.width / 2)
        this.ball.setFriction(0.005)
        this.ball.setBounce(1)
        this.ball.setMass(1)
        this.ball.setPosition(this.floors[0].x, this.floors[0].y - this.floors[0].height / 2 - 300)

        this.input.on('pointerdown', () => {
            if (!this.gameOver) this.ball.setVelocity(0, this.fallSpeed)
        })

        this.ball.setDepth(2)

        this.scoreDisplay = this.add
            .text(200, 100, `${this.score}`, {
                fontSize: '100px',
                fontFamily: 'Arial',
                color: '#ffffff',
                testString: '12342',
            })
            .setStroke('black', 1)
        this.scoreDisplay.setX(this.scoreDisplay.x - this.scoreDisplay.width / 2)
    }

    update() {
        this.scoreDisplay.setText(`${(this, this.score)}`)

        if (this.ball.y >= this.ball.height / 2 + 600) {
            console.log('Game Over')
            this.gameOver = true
        }

        for (const floor of this.floors) {
            if (floor.x + (floor.width * floor.scaleX) / 2 <= 0) {
                const removeFloor = this.floors.shift()
                if (removeFloor != undefined) {
                    this.extraFloors.push(removeFloor)
                }
            }
        }

        for (const pipe of this.pipes) {
            if (pipe.x + (pipe.width * pipe.scaleX) / 2 <= 0) {
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
            for (let i = 0; i < this.floors.length; i++) {
                this.floors[i].setX(this.floors[i].x + this.floorSpeed)
                this.pipes[i].setX(this.pipes[i].x + this.floorSpeed)

                this.ball.setOnCollideWith(this.floors[i], () => {
                    if (
                        this.floors[i].y - this.ball.y >=
                        (this.floors[i].height * this.floors[i].scaleY) / 2 +
                            (this.ball.height * this.ball.scaleY) / 2 -
                            10
                    ) {
                        this.ball.setVelocity(0, this.jumpSpeed)
                        this.score++
                    } else {
                        console.log('Game Over')
                        this.gameOver = true
                        this.ball.setVelocityY(10)
                    }
                })
                this.floors[i].setOnCollide(() => {
                    this.floors[i].active = false
                })
                if (!this.floors[i].active) {
                    this.floors[i].setY(this.floors[i].y + 2)
                    this.pipes[i].setY(this.pipes[i].y + 2)
                }
            }
        } else {
            this.ball.setOnCollideWith(this.floors[0], () => {
                if (
                    this.floors[0].y - this.ball.y >=
                    (this.floors[0].height * this.floors[0].scaleY) / 2 +
                        (this.ball.height * this.ball.scaleY) / 2 -
                        10
                ) {
                    this.floors[0].active = false
                    this.ball.setVelocity(0, this.jumpSpeed)
                    this.start = true
                    this.score++
                } else {
                    console.log('Game Over')
                    this.gameOver = true
                }
            })
        }
    }

    createPipe() {
        let newPipe
        let newFloor
        if (this.extraPipes.length && this.extraFloors) {
            newFloor = this.extraFloors.shift()
            newPipe = this.extraPipes.shift()
        } else {
            newFloor = this.matter.add.image(200, 100, 'floor')
            newPipe = this.add.rectangle(
                200,
                100,
                newFloor.width,
                600 - newFloor.y - newFloor.height / 2,
                0xff0000
            )
            console.log('create New pipe')
        }
        if (newPipe && newFloor) {
            newFloor.setStatic(true)
            newFloor.setY(Phaser.Math.Between(300, 500))
            newFloor.setX(400 + newFloor.width / 2)
            newFloor.scaleX = Phaser.Math.Between(1, 3) / 2
            newFloor.active = true

            newPipe.scaleX = newFloor.scaleX
            newPipe.scaleY = (600 - newFloor.y - newFloor.height / 2) / newPipe.height
            newPipe.setX(newFloor.x)
            newPipe.setY(
                newFloor.y +
                    (newFloor.height * newFloor.scaleY) / 2 +
                    (newPipe.height * newPipe.scaleY) / 2
            )
            newPipe.fillColor = this.colors[Phaser.Math.Between(0, this.colors.length - 1)]

            this.pipes.push(newPipe)
            this.floors.push(newFloor)
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
