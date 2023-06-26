import { GameOverScene } from './GameOverScene'
import { PlayScene } from './PlayScene'

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
    private ball: Phaser.Physics.Matter.Image
    private timeToSpawnPipe: number
    private cnt: number
    private colors: number[]
    private floorSpeed: number
    private fallSpeed: number
    private jumpSpeed: number
    private scoreDisplay: Phaser.GameObjects.Text
    private timeToChangeColor: number
    private colorIndex: number

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
        this.colors = [0x8cff66, 0x668cff, 0xff8533, 0xdf80ff, 0xff3333]
        this.floorSpeed = -2
        this.jumpSpeed = -8
        this.fallSpeed = 8
        this.timeToChangeColor = 5
        this.colorIndex = 0
        this.timeToSpawnPipe = 70
        this.cnt = this.timeToSpawnPipe
    }

    initial() {
        this.ball = this.scene.matter.add.image(
            Phaser.Math.Between(100, 700),
            Phaser.Math.Between(-600, 0),
            'ball'
        )

        for (let i = 1; i < 3; i++) {
            this.createFloor(i * 200, 400, 1)
        }

        this.ball
            .setScale(0.12)
            .setCircle(this.ball.displayWidth / 2)
            .setFriction(0.005)
            .setBounce(1.2)
            .setMass(3)
            .setDepth(2)
            .setPosition(
                this.floors[0].x,
                this.floors[0].y - this.floors[0].displayHeight / 2 - 300
            )
            .setOnCollide(() => {
                this.ball.setVelocity(0, this.jumpSpeed)
                this.timeToChangeColor--
                PlayScene.score++
                PlayScene.start = true
            })

        this.scene.input.on('pointerdown', () => {
            if (!PlayScene.gameOver) this.ball.setVelocity(0, this.fallSpeed)
        })
    }

    createFloor(x: number | null, y: number, scaleX: number) {
        let newFloor: Phaser.Physics.Matter.Image | undefined
        if (this.extraFloors.length) {
            newFloor = this.extraFloors.shift()
        } else {
            newFloor = this.scene.matter.add.image(200, 100, 'floor')
            newFloor.setOnCollide(() => {
                if (newFloor) {
                    newFloor.active = false
                    const gem = this.gems.filter((gem) => {
                        if (newFloor) return gem.x == newFloor.x
                    })
                    if (gem[0]) gem[0].setActive(false)

                    const spike = this.spikes.filter((spike) => {
                        if (newFloor)
                            return (
                                spike.x <= newFloor.x + newFloor.displayWidth / 2 &&
                                spike.x >= newFloor.x - newFloor.displayWidth / 2
                            )
                    })

                    if (spike[0]) spike[0].setActive(false)
                }
            })
            console.log('create New Floor')
        }

        if (newFloor) {
            newFloor.setStatic(true).setY(y)
            if (x == null) newFloor.setX(400 + newFloor.displayWidth / 2)
            else newFloor.setX(x)
            newFloor.scaleX = scaleX
            newFloor.active = true
            this.floors.push(newFloor)

            this.createPipe(
                newFloor.x,
                newFloor.y + newFloor.displayHeight / 2 + 300,
                newFloor.displayWidth,
                600
            )

            this.createGem(newFloor.x, newFloor.y - newFloor.displayHeight / 2)

            if (scaleX >= 1.1) {
                let pos: string
                const tmp = Phaser.Math.Between(0, 1)
                if (tmp == 0) pos = 'left'
                else pos = 'right'
                if (pos == 'left') {
                    this.createSpike(
                        newFloor.x - newFloor.displayWidth / 2,
                        newFloor.y - newFloor.displayHeight / 2,
                        pos
                    )
                } else {
                    this.createSpike(
                        newFloor.x + newFloor.displayWidth / 2,
                        newFloor.y - newFloor.displayHeight / 2,
                        pos
                    )
                }
            }
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
            newGem.setActive(true)
            newGem.setAlpha(1)
            newGem.setPosition(x, y - newGem.displayHeight / 2)

            this.gems.push(newGem)
        }
    }

    createSpike(x: number, y: number, position: string) {
        const tmp = Phaser.Math.Between(0, 5)
        if (tmp != 3) return
        let newSpike
        if (this.extraSpikes.length) {
            newSpike = this.extraSpikes.shift()
        } else {
            newSpike = this.scene.add.image(x, y, 'spike').setScale(0.3)
            newSpike.scaleX = 0.2
            console.log('create New Spike')
        }
        if (newSpike) {
            newSpike.setActive(true)
            newSpike.setAlpha(1).setDepth(0)
            if (position == 'left')
                newSpike.setPosition(x + newSpike.displayWidth / 2, y - newSpike.displayHeight / 2)
            else newSpike.setPosition(x - newSpike.displayWidth / 2, y - newSpike.displayHeight / 2)

            this.spikes.push(newSpike)
        }
    }

    createObject() {
        this.ball.rotation += Phaser.Math.DEG_TO_RAD * 3
        this.cnt--
        if (this.cnt <= 0) {
            this.cnt = this.timeToSpawnPipe
            this.createFloor(
                null,
                Phaser.Math.Between(350, 500),
                Phaser.Math.FloatBetween(1, 2.5) / 2
            )
        }
    }

    handleGameOver() {
        GameOverScene.score = PlayScene.score
        this.scene.tweens.add({
            targets: [this.ball, ...this.pipes, ...this.floors, ...this.gems, this.scoreDisplay],
            duration: 1000,
            yoyo: false,
            alpha: 0,
            onComplete: () => {
                this.restart()
                this.scene.scene.start('Game Over Scene')
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
        if (this.ball.y >= this.ball.displayHeight / 2 + 600) {
            console.log('Game Over')
            PlayScene.gameOver = true
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

        for (const gem of this.gems) {
            if (gem.x + gem.displayWidth / 2 <= 0) {
                const removeGem = this.gems.shift()
                if (removeGem != undefined) {
                    this.extraGems.push(removeGem)
                }
            }
        }

        for (const spike of this.spikes) {
            if (spike.x + spike.displayWidth / 2 <= 0) {
                const removeSpike = this.spikes.shift()
                if (removeSpike != undefined) {
                    this.extraSpikes.push(removeSpike)
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

        for (const gem of this.gems) {
            if (
                this.checkBallCollidGameObject(gem, gem.displayWidth, gem.displayHeight) &&
                gem.alpha
            ) {
                gem.setAlpha(0)
                PlayScene.score += 5
            }
            gem.setX(gem.x + this.floorSpeed)
            if (!gem.active) gem.setY(gem.y + 2)
        }

        for (const spike of this.spikes) {
            if (
                this.checkBallCollidGameObject(
                    spike,
                    0.5 * spike.displayWidth,
                    spike.displayHeight * 0.8
                )
            ) {
                PlayScene.gameOver = true
            }
            spike.setX(spike.x + this.floorSpeed)
            if (!spike.active) spike.setY(spike.y + 2)
        }
    }

    restart() {
        this.timeToChangeColor = 5
        PlayScene.score = 0
        PlayScene.start = false
        PlayScene.gameOver = false
        this.cnt = this.timeToSpawnPipe

        if (this.floors) {
            while (this.floors.length) {
                const removeFloor = this.floors.shift()
                if (removeFloor) {
                    removeFloor.setX(-1000)
                    this.extraFloors.push(removeFloor)
                }
                const removePipe = this.pipes.shift()
                if (removePipe) {
                    removePipe.setX(-1000)
                    this.extraPipes.push(removePipe)
                }
            }
        }
        if (this.gems) {
            while (this.gems.length) {
                const removeGem = this.gems.shift()
                if (removeGem) {
                    removeGem.setX(-1000)
                    this.extraGems.push(removeGem)
                }
            }
        }

        for (let i = 1; i < 3; i++) {
            this.createFloor(i * 200, 400, 1)
        }

        this.ball.setPosition(
            this.floors[0].x,
            this.floors[0].y - this.floors[0].displayHeight / 2 - 300
        )
        this.scene.add.triangle()
    }

    checkBallCollidGameObject(
        gamObject: Phaser.GameObjects.Image,
        width: number,
        height: number
    ): boolean {
        const diff_x = Math.abs(gamObject.x - this.ball.x)
        const diff_y = Math.abs(gamObject.y - this.ball.y)

        if (
            diff_x <= width / 2 + this.ball.displayWidth / 2 &&
            diff_y <= height / 2 + this.ball.displayHeight / 2
        )
            return true
        return false
    }
}
