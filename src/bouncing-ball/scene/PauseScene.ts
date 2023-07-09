import { AudioManager } from '../audio/AudioManager'
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../constant/constant'

export class PauseScene extends Phaser.Scene {
    private text: Phaser.GameObjects.Text
    private audioManager: AudioManager

    constructor() {
        super({ key: 'Pause Scene' })
    }

    public create(): void {
        console.log('Create Pause Scene')
        this.audioManager = AudioManager.getInstance(this.scene.get('Play Scene'))
        const box = this.add
            .rectangle(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 300, 200, 0xebf9fa, 0.6)
            .setStrokeStyle(1, 0x000000, 0.6)
        this.add
            .text(box.x, box.y - box.displayHeight / 2 + 10, 'Resume', {
                fontFamily: 'Arial',
                color: '0x000000',
                fontSize: '32px',
            })
            .setOrigin(0.5, 0)
            .setInteractive()
            .on('pointerdown', () => {
                this.scene.resume('Play Scene')
                this.scene.sleep('Pause Scene')
                this.audioManager.resumeSound()
            })
        this.add
            .text(box.x, box.y - box.displayHeight / 2 + 110, 'Home', {
                fontFamily: 'Arial',
                color: '0x000000',
                fontSize: '32px',
            })
            .setOrigin(0.5, 0)
            .setInteractive()
            .on('pointerdown', () => {
                this.scene.resume('Play Scene')
                this.scene.setVisible(false, 'Play Scene')
                this.scene.switch('Start Scene')
            })
    }
}
