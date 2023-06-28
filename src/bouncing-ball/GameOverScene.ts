import { CANVAS_HEIGHT, CANVAS_WIDTH } from './constant'

export class GameOverScene extends Phaser.Scene {
    static score: number
    private scoreDisplay: Phaser.GameObjects.Text
    private highScoreDisplay: Phaser.GameObjects.Text
    private highScore: number

    constructor() {
        super({ key: 'Game Over Scene' })
    }

    preload() {
        this.load.image('replay-button', 'assets/images/replay.png')
        this.load.image('home-button', 'assets/images/home.png')
    }

    create() {
        const replayButton = this.add
            .image(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 'replay-button')
            .setInteractive()
            .setScale(0.2)
            .on('pointerdown', () => {
                this.scene.switch('Play Scene')
            })
        this.add
            .image(
                CANVAS_WIDTH / 2,
                replayButton.y + replayButton.displayHeight / 2 + 50,
                'home-button'
            )
            .setInteractive()
            .setScale(0.2)
            .setOrigin(0.5, 0)
            .on('pointerdown', () => {
                this.scene.switch('Start Scene')
            })

        this.scoreDisplay = this.add
            .text(100, 100, `Score: ${GameOverScene.score}`, {
                fontSize: '32px',
                fontFamily: 'Arial',
                color: '#000000',
                testString: '1234y',
                align: 'center',
            })
            .setStroke('black', 1)
            .setInteractive()
            .setOrigin(0.5)
            .setPosition(CANVAS_WIDTH / 2, (CANVAS_HEIGHT / 2) * 0.5)

        this.highScoreDisplay = this.add
            .text(100, 200, `High Score: ${this.highScore}`, {
                fontSize: '32px',
                fontFamily: 'Arial',
                color: '#000000',
                testString: '1234y',
                align: 'center',
            })
            .setStroke('black', 1)
            .setInteractive()
            .setOrigin(0.5)
            .setPosition(CANVAS_WIDTH / 2, (CANVAS_HEIGHT / 2) * 0.7)
    }

    update() {
        const tmp = localStorage.getItem('highScore')
        if (tmp != null) {
            this.highScore = parseInt(tmp)
        } else this.highScore = 0

        if (GameOverScene.score > this.highScore) {
            this.highScore = Math.max(this.highScore, GameOverScene.score)
            localStorage.setItem('highScore', this.highScore.toString())
        }
        this.scoreDisplay.setText(`Score: ${GameOverScene.score}`)
        this.highScoreDisplay.setText(`High Score: ${this.highScore}`)
    }
}
