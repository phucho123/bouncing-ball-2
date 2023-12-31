export class AudioManager {
    private scene: Phaser.Scene
    private gemAudio: Phaser.Sound.NoAudioSound
    private hitAudio: Phaser.Sound.NoAudioSound
    private dieAudio: Phaser.Sound.NoAudioSound
    private fireAudio: Phaser.Sound.NoAudioSound
    private spikeAudio: Phaser.Sound.NoAudioSound
    private BMAudio: Phaser.Sound.NoAudioSound
    public static instance: AudioManager | null = null

    constructor(scene: Phaser.Scene) {
        this.scene = scene
        this.init()
    }

    public static getInstance(scene: Phaser.Scene): AudioManager {
        if (AudioManager.instance == null) {
            console.log('Create new Audio Manager')
            AudioManager.instance = new AudioManager(scene)
        }
        return AudioManager.instance
    }

    public init(): void {
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
        this.BMAudio = this.scene.sound.add('BM-audio') as Phaser.Sound.NoAudioSound
        this.BMAudio.setVolume(0.5)
    }

    public playGemAudio(): void {
        this.gemAudio.play()
    }

    public pauseGemAudio(): void {
        this.gemAudio.pause()
    }

    public playHitAudio(): void {
        this.hitAudio.play()
    }

    public pauseHitAudio(): void {
        this.hitAudio.pause()
    }

    public playDieAudio(): void {
        this.dieAudio.play()
    }

    public pauseDieAudio(): void {
        this.dieAudio.pause()
    }

    public playFireAudio(): void {
        this.fireAudio.play()
    }

    public pauseFireAudio(): void {
        this.fireAudio.pause()
    }

    public playSpikeAudio(): void {
        this.spikeAudio.play()
    }

    public pauseSpikeAudio(): void {
        this.spikeAudio.pause()
    }

    public playBM(): void {
        this.BMAudio.play()
    }

    public stopBM(): void {
        this.BMAudio.stop()
    }

    public pauseBM(): void {
        this.BMAudio.pause()
    }

    public resumeBM(): void {
        this.BMAudio.resume()
    }

    public mute(): void {
        this.gemAudio.setMute(true)
        this.hitAudio.setMute(true)
        this.dieAudio.setMute(true)
        this.fireAudio.setMute(true)
        this.spikeAudio.setMute(true)
        this.BMAudio.setMute(true)
    }

    public unMute(): void {
        this.gemAudio.setMute(false)
        this.hitAudio.setMute(false)
        this.dieAudio.setMute(false)
        this.fireAudio.setMute(false)
        this.spikeAudio.setMute(false)
        this.BMAudio.setMute(false)
    }

    public pauseSound(): void {
        this.gemAudio.pause()
        this.hitAudio.pause()
        this.dieAudio.pause()
        this.fireAudio.pause()
        this.spikeAudio.pause()
        this.BMAudio.pause()
    }

    public resumeSound(): void {
        this.gemAudio.resume()
        this.hitAudio.resume()
        this.dieAudio.resume()
        this.fireAudio.resume()
        this.spikeAudio.resume()
        this.BMAudio.resume()
    }

    public stopSound(): void {
        this.gemAudio.stop()
        this.hitAudio.stop()
        this.dieAudio.stop()
        this.fireAudio.stop()
        this.spikeAudio.stop()
        this.BMAudio.stop()
    }
}
