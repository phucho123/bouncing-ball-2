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
        this.startButton = this.add.image(200, 300, 'start-button').setScale(0.2).setInteractive()

        this.startButton.on('pointerdown', () => {
            this.tweens.add({
                targets: [this.text, this.startButton],
                duration: 1000,
                yoyo: false,
                alpha: 0,
                onComplete: () => {
                    this.scene.start('Play Scene')
                },
            })

            this.tweens.add({
                targets: this.startButton,
                duration: 1000,
                yoyo: true,
                scale: 0.5,
            })
        })
        this.text = this.add
            .text(60, 100, 'Bouncing\n   Ball 2', {
                fontSize: '64px',
                fontFamily: 'Arial',
                color: '#ffffff',
                testString: '1234y',
            })
            .setStroke('black', 1)
    }
}
