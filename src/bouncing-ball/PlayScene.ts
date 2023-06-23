import { GameOverScene } from './GameOverScene'

export class PlayScene extends Phaser.Scene {
    private floors: Phaser.Physics.Matter.Image[]
    private extraFloors: Phaser.Physics.Matter.Image[]
    private pipes: Phaser.GameObjects.Rectangle[]
    private extraPipes: Phaser.GameObjects.Rectangle[]
    private ball: Phaser.Physics.Matter.Image
    private start: boolean
    private timeToSpawnPipe: number
    private cnt: number
    private gameOver: boolean
    private colors: number[]
    private floorSpeed: number
    private fallSpeed: number
    private jumpSpeed: number
    private score: number
    private scoreDisplay: Phaser.GameObjects.Text
    private timeToChangeColor: number
    private colorIndex: number
    // private particals: Phaser.GameObjects.Container

    constructor() {
        super({ key: 'Play Scene' })
    }

    preload() {
        this.load.image('ball', 'assets/sprites/pangball.png')
        this.load.image('pipe', 'assets/images/up-pipe.png')
        this.load.image('floor', 'assets/images/floor.png')
    }

    create() {
        this.matter.world.setBounds(0, 0, 400, 600, 32, false, false, false, false)
        this.matter.world.setGravity(0, 0.3)
        this.clearObject()
        if (this.colors == undefined)
            this.colors = [0x8cff66, 0x668cff, 0xff8533, 0xdf80ff, 0xff3333]
        this.floorSpeed = -2
        this.jumpSpeed = -8
        this.fallSpeed = 8
        this.score = 0
        this.timeToChangeColor = 5
        this.colorIndex = 0
        this.start = false
        this.gameOver = false

        this.timeToSpawnPipe = 100
        this.cnt = this.timeToSpawnPipe

        this.ball = this.matter.add.image(
            Phaser.Math.Between(100, 700),
            Phaser.Math.Between(-600, 0),
            'ball'
        )

        for (let i = 1; i < 3; i++) {
            this.createFloor(i * 200, 400, 1)
        }

        this.ball.setCircle(this.ball.width / 2)
        this.ball.setFriction(0.005)
        this.ball.setBounce(1)
        this.ball.setMass(3)
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
            .setAlpha(0.5)
        this.scoreDisplay.setX(this.scoreDisplay.x - this.scoreDisplay.width / 2)

        this.ball.setOnCollide(() => {
            this.ball.setVelocity(0, this.jumpSpeed)
            this.score++
            this.timeToChangeColor--
            this.start = true
        })
    }

    update() {
        if (this.gameOver) this.handleGameOver()

        this.changeColor()

        this.scoreDisplay.setText(`${(this, this.score)}`)

        this.checkOutOfBound()

        if (this.start) {
            this.spawnObject()

            this.moveFloor()
        }
    }

    createFloor(x: number | null, y: number, scaleX: number) {
        let newFloor: Phaser.Physics.Matter.Image | undefined
        if (this.extraFloors.length) {
            // console.log(this.extraFloors.length)
            newFloor = this.extraFloors.shift()
        } else {
            newFloor = this.matter.add.image(200, 100, 'floor')

            newFloor.setOnCollide(() => {
                if (newFloor) {
                    newFloor.active = false
                }
            })
            console.log('create New Floor')
        }

        if (newFloor) {
            newFloor.setStatic(true)
            newFloor.setY(y)
            if (x == null) newFloor.setX(400 + newFloor.displayWidth / 2)
            else newFloor.setX(x)
            newFloor.scaleX = scaleX
            newFloor.active = true
            this.floors.push(newFloor)

            // this.ball.setOnCollideWith(newFloor, () => {
            //     this.ball.setVelocity(0, this.jumpSpeed)
            //     this.score++
            //     this.timeToChangeColor--
            // })

            this.createPipe(
                newFloor.x,
                newFloor.y + newFloor.displayHeight / 2 + 300,
                newFloor.displayWidth,
                600
            )

            // this.createSpike(newFloor.x, newFloor.y - newFloor.height)
        }
    }

    createPipe(x: number, y: number, width: number, height: number) {
        let newPipe
        if (this.extraPipes.length) {
            newPipe = this.extraPipes.shift()
        } else {
            newPipe = this.add.rectangle(x, y, width, height, 0xff0000)
            console.log('create New Pipe')
        }
        if (newPipe) {
            newPipe.displayWidth = width
            newPipe.displayHeight = height
            newPipe.setX(x)
            newPipe.setY(y)
            newPipe.fillColor = this.colors[this.colorIndex]

            this.pipes.push(newPipe)
        }
    }

    // createSpike(x: number, y: number) {
    //     this.add.triangle(x, y - 5, x, y - 10, x - 5, y, x + 5, y, 0xff00ff, 1)
    // }

    createEveryThing() {
        this.createFloor(null, Phaser.Math.Between(300, 500), Phaser.Math.Between(1, 3) / 2)
    }

    handleGameOver() {
        this.tweens.add({
            targets: [this.ball, ...this.pipes, ...this.floors, this.scoreDisplay],
            duration: 1000,
            yoyo: false,
            alpha: 0,
            onComplete: () => {
                this.scene.start('Game Over Scene')
                GameOverScene.score = this.score
                // this.restart()
            },
        })
    }

    changeColor() {
        if (this.timeToChangeColor <= 0) {
            this.colorIndex = (this.colorIndex + 1) % this.colors.length
            this.timeToChangeColor = 5
        }
    }

    checkOutOfBound() {
        console.log(this.ball)
        if (this.ball.y >= this.ball.height / 2 + 600) {
            console.log('Game Over')
            this.gameOver = true
        }

        for (const floor of this.floors) {
            if (floor.x + floor.displayWidth / 2 <= 0) {
                const removeFloor = this.floors.shift()
                if (removeFloor != undefined) {
                    this.extraFloors.push(removeFloor)
                }
            }
        }

        for (const pipe of this.pipes) {
            if (pipe.x + pipe.displayWidth / 2 <= 0) {
                const removePipe = this.pipes.shift()
                if (removePipe != undefined) {
                    this.extraPipes.push(removePipe)
                }
            }
        }
    }

    moveFloor() {
        for (let i = 0; i < this.floors.length; i++) {
            this.floors[i].setX(this.floors[i].x + this.floorSpeed)
            this.pipes[i].setX(this.pipes[i].x + this.floorSpeed)
            if (!this.floors[i].active) {
                this.floors[i].setY(this.floors[i].y + 2)
                this.pipes[i].setY(this.pipes[i].y + 2)
            }
        }
    }

    spawnObject() {
        this.ball.rotation = this.ball.rotation + Phaser.Math.DEG_TO_RAD * 3
        this.cnt--
        if (this.cnt <= 0) {
            this.cnt = this.timeToSpawnPipe
            this.createEveryThing()
        }
    }

    clearObject() {
        // if (this.floors) {
        //     while (this.floors.length) {
        //         const removeFloor = this.floors.shift()
        //         if (removeFloor) this.extraFloors.push(removeFloor)
        //         const removePipe = this.pipes.shift()
        //         if (removePipe) this.extraPipes.push(removePipe)
        //     }
        // } else {
        //     this.floors = []
        //     this.extraFloors = []
        //     this.pipes = []
        //     this.extraPipes = []
        // }
        this.floors = []
        this.extraFloors = []
        this.pipes = []
        this.extraPipes = []
    }
}
