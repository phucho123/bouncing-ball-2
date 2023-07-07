import { CANVAS_WIDTH } from '../constant/constant'
import { PlayScene } from './PlayScene'
import { ShopScene } from './ShopScene'

export class LoadingScene extends Phaser.Scene {
    private graphics: Phaser.GameObjects.Graphics
    private newGraphics: Phaser.GameObjects.Graphics
    private loadingText: Phaser.GameObjects.Text

    constructor() {
        super({ key: 'Loading Scene' })
    }

    public preload(): void {
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

        this.load.pack('preload', './assets/pack.json', 'preload')

        this.getDataFromStorage()

        this.load.on('progress', this.updateBar, {
            newGraphics: this.newGraphics,
            loadingText: this.loadingText,
        })

        this.load.on('complete', () => {
            this.scene.switch('Start Scene')
        })
    }

    public updateBar(percentage: number): void {
        this.newGraphics.clear()
        this.newGraphics.fillStyle(0x3587e2, 1)
        this.newGraphics.fillRectShape(
            new Phaser.Geom.Rectangle(15, 205, percentage * (CANVAS_WIDTH - 30), 40)
        )

        percentage = percentage * 100
        this.loadingText.setText('Loading: ' + percentage.toFixed(2) + '%')
    }

    public getDataFromStorage(): void {
        const chosenBall = localStorage.getItem('chosenBall')
        if (chosenBall) {
            ShopScene.chosenBall = parseInt(chosenBall)
        } else {
            ShopScene.chosenBall = 0
        }
        const playerGem = localStorage.getItem('totalGem')
        if (playerGem) {
            ShopScene.playerGem = parseInt(playerGem)
        } else {
            ShopScene.playerGem = 0
        }
        const boughtBall = localStorage.getItem('boughtBall')
        if (!boughtBall) {
            localStorage.setItem('boughtBall', '0')
        }
        const tmp = localStorage.getItem('highScore')
        if (tmp != null) {
            PlayScene.highScore = parseInt(tmp)
        } else PlayScene.highScore = 0
    }
}
