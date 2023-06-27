import { CANVAS_HEIGHT, CANVAS_WIDTH } from './constant'

export class StartScene extends Phaser.Scene {
    private text: Phaser.GameObjects.Text
    private startButton: Phaser.GameObjects.Image

    constructor() {
        super({ key: 'Start Scene' })
    }

    preload() {
        this.load.image('start-button', 'assets/images/start-button.png')
    }

    create() {
        this.startButton = this.add
            .image(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 'start-button')
            .setScale(0.2)
            .setInteractive()

        this.startButton.on('pointerdown', () => {
            this.tweens.add({
                targets: this.startButton,
                scale: 0.1,
                duration: 500,
                yoyo: true,
                onComplete: () => {
                    this.tweens.add({
                        targets: [this.text],
                        y: -200,
                        duration: 1000,
                        yoyo: false,
                        alpha: 0,
                        onComplete: () => {
                            this.scene.switch('Play Scene')
                        },
                    })

                    this.tweens.add({
                        targets: this.startButton,
                        y: 800,
                        duration: 1000,
                        alpha: 0,
                        yoyo: true,
                    })
                },
            })
        })
        this.startButton.on('pointerover', () => {
            this.startButton.setAlpha(0.5)
        })
        this.startButton.on('pointerout', () => {
            this.startButton.setAlpha(1)
        })
        this.text = this.add
            .text(60, 100, 'Bouncing\n   Ball 2', {
                fontSize: '64px',
                fontFamily: 'Arial',
                color: '#000000',
                testString: '1234y',
            })
            .setStroke('black', 1)
            .setOrigin(0.5)
            .setPosition(CANVAS_WIDTH / 2, (CANVAS_HEIGHT / 2) * 0.5)
    }
}
