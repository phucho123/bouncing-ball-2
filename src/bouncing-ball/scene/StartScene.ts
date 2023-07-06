import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../constant/constant'

export class StartScene extends Phaser.Scene {
    private text: Phaser.GameObjects.Text

    constructor() {
        super({ key: 'Start Scene' })
    }

    public create(): void {
        console.log(CANVAS_WIDTH / 2)
        this.createButton()
        this.text = this.add
            .text(60, 100, 'Bouncing\n   Ball 2', {
                fontSize: `${(64 * CANVAS_WIDTH) / 400}px`,
                fontFamily: 'Arial',
                color: '#000000',
                testString: '1234y',
            })
            .setStroke('black', 1)
            .setOrigin(0.5)
            .setPosition(CANVAS_WIDTH / 2, (CANVAS_HEIGHT / 2) * 0.5)
    }

    public createButton(): void {
        const startButton = this.add
            .image(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 'start-button')
            .setScale(0.2)
            .setInteractive()
        const shopButton = this.add
            .image(
                CANVAS_WIDTH / 2,
                startButton.y + startButton.displayHeight / 2 + 50,
                'shop-button'
            )
            .setScale(0.2)
            .setOrigin(0.5, 0)
            .setInteractive()

        startButton.on('pointerdown', () => {
            this.tweens.add({
                targets: startButton,
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
                            this.tweens.add({
                                targets: [this.text],
                                y: (CANVAS_HEIGHT / 2) * 0.5,
                                duration: 1000,
                                yoyo: false,
                                alpha: 1,
                            })
                            this.scene.switch('Play Scene')
                        },
                    })

                    this.tweens.add({
                        targets: [startButton, shopButton],
                        y: 800,
                        duration: 1000,
                        alpha: 0,
                        yoyo: true,
                    })
                },
            })
        })

        shopButton.on('pointerdown', () => {
            this.scene.switch('Shop Scene')
        })
    }
}
