import { BALL_SIZE, CANVAS_WIDTH } from './constant'

export class ShopScene extends Phaser.Scene {
    public static chosenBall: number
    public static playerGem: number
    private balls: Phaser.GameObjects.Image[]
    private ballKey: string[]
    private gemNeedToPay: number[]
    private gemNeedToPayDisplay: Phaser.GameObjects.Text[]
    private playerGameDisplay: Phaser.GameObjects.Text

    constructor() {
        super({ key: 'Shop Scene' })
    }

    public preload() {
        this.load.image('normalball', 'assets/sprites/ball.png')
        this.load.image('basketball', 'assets/images/ball.png')
        this.load.image('pokeball', 'assets/images/poke-ball.png')
        this.load.image('football', 'assets/images/football.png')
        this.load.image('volleyball', 'assets/images/volleyball.png')
        this.load.image('tennisball', 'assets/images/tennisball.png')
        this.load.image('cannonbolt', 'assets/images/cannonbolt.png')
        this.load.image('dragonball', 'assets/images/dragonball.png')
        this.load.image('back', 'assets/images/back.png')
        this.load.image('gem', 'assets/images/gem.png')
    }

    public create() {
        this.balls = []
        this.ballKey = [
            'normalball',
            'basketball',
            'football',
            'volleyball',
            'tennisball',
            'pokeball',
            'cannonbolt',
            'dragonball',
        ]
        this.gemNeedToPay = [0, 10, 20, 30, 40, 50, 60, 70]
        this.gemNeedToPayDisplay = []
        this.getBoughtBall()

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
        const gem = this.add.image(CANVAS_WIDTH - 10, 10, 'gem').setOrigin(1, 0)
        gem.setScale(50 / gem.displayWidth)
        this.playerGameDisplay = this.add
            .text(gem.x - gem.displayWidth - 10, 10, `${ShopScene.playerGem}`, {
                fontSize: '16px',
                color: '0x000000',
            })
            .setOrigin(1, 0)
        this.createBallList()
    }

    public createBall(key: string, x: number, y: number, number: number) {
        const ball = this.add.image(x, y, key).setOrigin(0)
        ball.setScale(100 / ball.width)
            .setInteractive()
            .on('pointerdown', () => {
                if (ShopScene.playerGem >= this.gemNeedToPay[number]) {
                    ShopScene.playerGem -= this.gemNeedToPay[number]
                    if (this.gemNeedToPay[number] > 0) {
                        const tmp = localStorage.getItem('boughtBall')
                        if (tmp) localStorage.setItem('boughtBall', tmp + ` ${number}`)
                    }
                    ShopScene.chosenBall = number
                    this.gemNeedToPay[number] = 0
                    this.gemNeedToPayDisplay[number].setText('0')
                    localStorage.setItem('chosenBall', number.toString())
                    localStorage.setItem('totalGem', ShopScene.playerGem.toString())
                    for (const ball of this.balls) ball.setAlpha(1)
                    ball.setAlpha(0.3)
                }
            })
        if (ShopScene.chosenBall == number) ball.setAlpha(0.3)
        this.balls.push(ball)
    }

    public createGemDisplay(x: number, y: number, gem: number) {
        const gemDisplay = this.add
            .text(x, y, `${gem}`, {
                color: '0x000000',
                fontSize: '16px',
            })
            .setOrigin(0.5)
        gemDisplay.setY(y + gemDisplay.displayHeight / 2)
        this.gemNeedToPayDisplay.push(gemDisplay)
    }

    public createBallList() {
        const align =
            (CANVAS_WIDTH - Math.floor(CANVAS_WIDTH / (BALL_SIZE * 2)) * (BALL_SIZE * 2)) / 2
        const numBallInRow = Math.floor(CANVAS_WIDTH / (BALL_SIZE * 2))
        for (let i = 0; i < this.ballKey.length; i++) {
            const c = i % numBallInRow,
                r = Math.floor(i / numBallInRow)
            this.createBall(
                this.ballKey[i],
                align + c * (BALL_SIZE * 2),
                r * BALL_SIZE * 2 + 100 + 16 * r,
                i
            )
            this.createGemDisplay(
                align + c * (BALL_SIZE * 2) + BALL_SIZE,
                r * BALL_SIZE * 2 + 100 + BALL_SIZE * 2 + 16 * r,
                this.gemNeedToPay[i]
            )
        }
    }

    public getBoughtBall() {
        const boughtBall = localStorage.getItem('boughtBall')
        if (boughtBall) {
            const arr = boughtBall.split(' ')
            for (const number of arr) {
                this.gemNeedToPay[parseInt(number)] = 0
            }
        }
    }

    public update(): void {
        this.playerGameDisplay.setText(`${ShopScene.playerGem}`)
    }
}
