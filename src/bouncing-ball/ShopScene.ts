import { CANVAS_WIDTH } from './constant'

export class ShopScene extends Phaser.Scene {
    private balls: Phaser.GameObjects.Image[]
    static chosenBall: number
    constructor() {
        super({ key: 'Shop Scene' })
    }
    preload() {
        this.load.image('normal-ball', 'assets/sprites/ball.png')
        this.load.image('basket-ball', 'assets/images/ball.png')
        this.load.image('poke-ball', 'assets/images/poke-ball.png')
        this.load.image('back', 'assets/images/back.png')
    }
    create() {
        ShopScene.chosenBall = 0
        this.balls = []
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
        this.createBall('normal-ball', 10, 100, 0)
        this.createBall('basket-ball', 120, 100, 1)
        this.createBall('poke-ball', 230, 100, 2)
        // this.back.
        // this.balls = []
        // const ball_1 = this.add.image(0, 0, 'normal-ball').setOrigin(0).setScale(0.2)
        // const ball_2 = this.add.image(100, 0, 'basket-ball').setOrigin(0)
        // ball_2.setScale((ball_1.width / ball_2.width) * 0.2)
    }
    createBall(key: string, x: number, y: number, number: number) {
        const ball = this.add.image(x, y, key).setOrigin(0)
        ball.setScale(100 / ball.width)
            .setInteractive()
            .on('pointerdown', () => {
                ShopScene.chosenBall = number
                for (const ball of this.balls) ball.setAlpha(1)
                ball.setAlpha(0.5)
            })
        this.balls.push(ball)
    }
}
