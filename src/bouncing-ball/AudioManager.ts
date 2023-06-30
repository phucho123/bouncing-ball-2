export class AudioManager {
    private scene: Phaser.Scene
    private gemAudio: Phaser.Sound.NoAudioSound
    private hitAudio: Phaser.Sound.NoAudioSound
    private dieAudio: Phaser.Sound.NoAudioSound
    private fireAudio: Phaser.Sound.NoAudioSound
    private spikeAudio: Phaser.Sound.NoAudioSound
    public static instance: AudioManager | null = null

    constructor(scene: Phaser.Scene) {
        this.scene = scene
    }

    public static getInstance(scene: Phaser.Scene) {
        if (!AudioManager.instance) {
            AudioManager.instance = new AudioManager(scene)
        }
        return AudioManager.instance
    }

    public init() {
        this.gemAudio = this.scene.sound.add('gem-audio') as Phaser.Sound.NoAudioSound
        this.gemAudio.setRate(1.5)
        this.hitAudio = this.scene.sound.add('hit-audio') as Phaser.Sound.NoAudioSound
        this.hitAudio.setRate(1.5)
        this.dieAudio = this.scene.sound.add('die-audio') as Phaser.Sound.NoAudioSound
        this.fireAudio = this.scene.sound
            .add('fire-audio')
            .setLoop(true) as Phaser.Sound.NoAudioSound
        this.spikeAudio = this.scene.sound.add('spike-audio') as Phaser.Sound.NoAudioSound
        this.spikeAudio.setRate(1.5)
    }

    public playGemAudio() {
        this.gemAudio.play()
    }

    public pauseGemAudio() {
        this.gemAudio.pause()
    }

    public playHitAudio() {
        this.hitAudio.play()
    }

    public pauseHitAudio() {
        this.hitAudio.pause()
    }

    public playDieAudio() {
        this.dieAudio.play()
    }

    public pauseDieAudio() {
        this.dieAudio.pause()
    }

    public playFireAudio() {
        this.fireAudio.play()
    }

    public pauseFireAudio() {
        this.fireAudio.pause()
    }

    public playSpikeAudio() {
        this.spikeAudio.play()
    }

    public pauseSpikeAudio() {
        this.spikeAudio.pause()
    }
}
