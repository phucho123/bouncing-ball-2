import { PlayScene } from './PlayScene'
import { CANVAS_HEIGHT, CANVAS_WIDTH } from './constant'

export class GameOverScene extends Phaser.Scene {
    public static score: number
    private scoreDisplay: Phaser.GameObjects.Text
    private highScoreDisplay: Phaser.GameObjects.Text

    constructor() {
        super({ key: 'Game Over Scene' })
    }

    public preload() {
        ///
    }

    public create() {
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
            .text(100, 200, `High Score: ${PlayScene.highScore}`, {
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

    public update() {
        if (GameOverScene.score > PlayScene.highScore) {
            PlayScene.highScore = GameOverScene.score
            localStorage.setItem('highScore', PlayScene.highScore.toString())
        }
        this.scoreDisplay.setText(`Score: ${GameOverScene.score}`)
        this.highScoreDisplay.setText(`High Score: ${PlayScene.highScore}`)
    }
}
