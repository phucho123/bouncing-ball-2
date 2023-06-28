import { BALL_SIZE, CANVAS_WIDTH } from './constant'

export class ShopScene extends Phaser.Scene {
    private balls: Phaser.GameObjects.Image[]
    static chosenBall: number
    private ballKey: string[]
    constructor() {
        super({ key: 'Shop Scene' })
    }
    preload() {
        this.load.image('normalball', 'assets/sprites/ball.png')
        this.load.image('basketball', 'assets/images/ball.png')
        this.load.image('pokeball', 'assets/images/poke-ball.png')
        this.load.image('football', 'assets/images/football.png')
        this.load.image('back', 'assets/images/back.png')
    }
    create() {
        this.balls = []
        this.ballKey = ['normalball', 'basketball', 'pokeball', 'football']
        this.add
            .image(10, 10, 'back')
            .setOrigin(0)
            .setScale(0.1)
            .setInteractive()
            .on('pointerdown', () => {
                this.scene.switch('Start Scene')
            })
        this.add
            .text(CANVAS_WIDTH / 2, 10, 'Shop', {
                fontSize: `32px`,
                fontFamily: 'Arial',
                color: '#000000',
                testString: '1234y',
            })
            .setStroke('black', 1)
            .setOrigin(0.5, 0)
        this.createBallList()
    }
    createBall(key: string, x: number, y: number, number: number) {
        const ball = this.add.image(x, y, key).setOrigin(0)
        ball.setScale(100 / ball.width)
            .setInteractive()
            .on('pointerdown', () => {
                ShopScene.chosenBall = number
                localStorage.setItem('chosenBall', number.toString())
                for (const ball of this.balls) ball.setAlpha(1)
                ball.setAlpha(0.3)
            })
        if (ShopScene.chosenBall == number) ball.setAlpha(0.3)
        this.balls.push(ball)
    }
    createBallList() {
        const align =
            (CANVAS_WIDTH - Math.floor(CANVAS_WIDTH / (BALL_SIZE * 2)) * (BALL_SIZE * 2)) / 2
        const numBallInRow = Math.floor(CANVAS_WIDTH / (BALL_SIZE * 2))
        for (let i = 0; i < this.ballKey.length; i++) {
            const c = i % numBallInRow,
                r = Math.floor(i / numBallInRow)
            this.createBall(
                this.ballKey[i],
                align + c * (BALL_SIZE * 2),
                r * BALL_SIZE * 2 + 100,
                i
            )
        }
    }
}
