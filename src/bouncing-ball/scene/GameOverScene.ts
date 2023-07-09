import { PlayScene } from './PlayScene'
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../constant/constant'
import { AudioManager } from '../audio/AudioManager'

export class GameOverScene extends Phaser.Scene {
    public static score: number
    private scoreDisplay: Phaser.GameObjects.Text
    private highScoreDisplay: Phaser.GameObjects.Text
    private audioManager: AudioManager

    constructor() {
        super({ key: 'Game Over Scene' })
    }

    public create(): void {
        console.log('Create Game Over Scene')
        this.audioManager = AudioManager.getInstance(this.scene.get('Play Scene'))
        this.add
            .text(CANVAS_WIDTH / 2, 100, 'Game Over', {
                color: '#000000',
                fontSize: '32px',
                fontFamily: 'Arial',
            })
            .setOrigin(0.5)
        const replayButton = this.add
            .image(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 'replay-button')
            .setInteractive()
            .setScale(0.2)
            .on('pointerdown', () => {
                if (this.scene.isSleeping('Play Scene')) {
                    this.scene.sleep('Game Over Scene')
                    this.scene.wake('Play Scene')
                } else this.scene.switch('Play Scene')

                // this.audioManager.playBM()
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
                if (this.scene.isSleeping('Start Scene')) {
                    this.scene.sleep('Game Over Scene')
                    this.scene.wake('Start Scene')
                } else this.scene.switch('Start Scene')
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

    public update(): void {
        if (GameOverScene.score > PlayScene.highScore) {
            PlayScene.highScore = GameOverScene.score
            localStorage.setItem('highScore', PlayScene.highScore.toString())
        }
        this.scoreDisplay.setText(`Score: ${GameOverScene.score}`)
        this.highScoreDisplay.setText(`High Score: ${PlayScene.highScore}`)
    }
}
