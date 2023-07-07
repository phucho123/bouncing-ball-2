import { AudioManager } from '../audio/AudioManager'
import { CANVAS_WIDTH } from '../constant/constant'

export class SettingScene extends Phaser.Scene {
    private text: Phaser.GameObjects.Text
    private audioManager: AudioManager
    private mute = 0

    constructor() {
        super({ key: 'Setting Scene' })
    }

    public create(): void {
        this.audioManager = AudioManager.getInstance(this.scene.get('Play Scene'))
        this.add
            .image(10, 10, 'back')
            .setOrigin(0)
            .setScale(0.1)
            .setInteractive()
            .on('pointerdown', () => {
                this.scene.switch('Start Scene')
            })
        this.text = this.add
            .text(10, 100, 'Music', {
                fontSize: `${(32 * CANVAS_WIDTH) / 400}px`,
                fontFamily: 'Arial',
                color: '#000000',
                testString: '1234y',
            })
            .setOrigin(0, 0)
        const speaker = this.add
            .sprite(CANVAS_WIDTH - 10, 120, 'speaker', 0)
            .setScale(2)
            .setInteractive()
            .setOrigin(1, 0.5)
        speaker.on('pointerdown', () => {
            this.mute = 1 - this.mute
            speaker.setFrame(this.mute)
            if (this.mute) {
                this.audioManager.mute()
            } else this.audioManager.unMute()
        })
    }
}
