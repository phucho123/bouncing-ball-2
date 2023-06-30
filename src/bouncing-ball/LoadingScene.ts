import { CANVAS_WIDTH } from './constant'

export class LoadingScene extends Phaser.Scene {
    private graphics: Phaser.GameObjects.Graphics
    private newGraphics: Phaser.GameObjects.Graphics
    private loadingText: Phaser.GameObjects.Text

    constructor() {
        super({ key: 'Loading Scene' })
    }

    public preload() {
        this.graphics = this.add.graphics()
        this.newGraphics = this.add.graphics()
        const progressBar = new Phaser.Geom.Rectangle(10, 200, CANVAS_WIDTH - 20, 50)
        const progressBarFill = new Phaser.Geom.Rectangle(15, 205, 100, 40)

        this.graphics.fillStyle(0xffffff, 1)
        this.graphics.fillRectShape(progressBar)

        this.newGraphics.fillStyle(0x3587e2, 1)
        this.newGraphics.fillRectShape(progressBarFill)

        this.loadingText = this.add
            .text(CANVAS_WIDTH / 2, 260, 'Loading: ', {
                fontSize: '32px',
                color: '#000000',
            })
            .setOrigin(0.5)

        this.load.image('normalball', 'assets/sprites/ball.png')
        this.load.image('basketball', 'assets/images/ball.png')
        this.load.image('pokeball', 'assets/images/poke-ball.png')
        this.load.image('football', 'assets/images/football.png')
        this.load.image('volleyball', 'assets/images/volleyball.png')
        this.load.image('tennisball', 'assets/images/tennisball.png')
        this.load.image('cannonbolt', 'assets/images/cannonbolt.png')
        this.load.image('dragonball', 'assets/images/dragonball.png')
        this.load.image('pipe', 'assets/images/up-pipe.png')
        this.load.image('floor', 'assets/images/floor.png')
        this.load.image('gem', 'assets/images/gem.png')
        this.load.image('spike', 'assets/images/triangle.png')
        this.load.image('red', 'assets/images/red-partical.png')
        this.load.image('blue', 'assets/images/blue-partical.png')
        this.load.image('orange', 'assets/images/orange-partical.png')
        this.load.image('green', 'assets/images/green-partical.png')
        this.load.image('blackfire', 'assets/images/blackfire.png')
        this.load.image('whitefire', 'assets/images/whitefire.png')
        this.load.image('firegem', 'assets/images/fire-gem.png')
        this.load.image('start-button', 'assets/images/start-button.png')
        this.load.image('shop-button', 'assets/images/shop.png')
        this.load.image('replay-button', 'assets/images/replay.png')
        this.load.image('home-button', 'assets/images/home.png')
        this.load.image('back', 'assets/images/back.png')
        this.load.audio('gem-audio', 'assets/audios/coin.wav')
        this.load.audio('hit-audio', 'assets/audios/point.wav')
        this.load.audio('die-audio', 'assets/audios/die.wav')
        this.load.audio('spike-audio', 'assets/audios/hit.wav')
        this.load.audio('fire-audio', 'assets/audios/fire.mp3')

        this.load.on('progress', this.updateBar, {
            newGraphics: this.newGraphics,
            loadingText: this.loadingText,
        })

        this.load.on('complete', () => {
            this.scene.switch('Start Scene')
        })
    }

    public updateBar(percentage: number) {
        this.newGraphics.clear()
        this.newGraphics.fillStyle(0x3587e2, 1)
        this.newGraphics.fillRectShape(
            new Phaser.Geom.Rectangle(15, 205, percentage * (CANVAS_WIDTH - 30), 40)
        )

        percentage = percentage * 100
        this.loadingText.setText('Loading: ' + percentage.toFixed(2) + '%')
    }
}
