import { DELTA_TIME } from '../constant/constant'

export class Emitter {
    public hitEmitter: Phaser.GameObjects.Particles.ParticleEmitter
    public fireEmitter: Phaser.GameObjects.Particles.ParticleEmitter
    private scene

    constructor(scene: Phaser.Scene) {
        this.scene = scene

        this.hitEmitter = this.scene.add
            .particles(100, 150, 'red', {
                lifespan: 2000,
                speed: { min: 100, max: 200 },
                scale: { start: 0.6, end: 0.1 },
                gravityX: -500,
                emitting: false,
            })
            .setScale(0.2)

        this.fireEmitter = this.scene.add
            .particles(0, 0, 'whitefire', {
                color: [0xfacc22, 0xf89800, 0xf83600, 0x9f0404],
                x: 0,
                y: 0,
                lifespan: 500,
                angle: { min: -100, max: -80 },
                scale: { start: 0.4, end: 0, ease: 'sine.in' },
                speed: { min: 200, max: 300 },
                alpha: { start: 0.7, end: 0.3 },
                advance: 2000,
                emitting: false,
                colorEase: 'quart.out',
            })
            .setDepth(3)
            .setVisible(false)
    }

    public startHitEmitter(perfect: boolean, delta: number): void {
        if (perfect) {
            this.hitEmitter.gravityX = (-500 * delta) / DELTA_TIME
            this.hitEmitter.gravityY = 0
            this.hitEmitter.explode(3)
        } else {
            this.hitEmitter.gravityX = 0
            this.hitEmitter.speedX = 0
            this.hitEmitter.gravityY = (-500 * delta) / DELTA_TIME
            this.hitEmitter.explode(16)
        }
        this.hitEmitter.start()
        this.hitEmitter.setVisible(true)
    }

    public stopHitEmitter(): void {
        this.hitEmitter.stop()
        this.hitEmitter.setVisible(false)
    }

    public moveHitEmitter(speedX: number, speedY: number): void {
        this.hitEmitter.setX(this.hitEmitter.x + speedX)
        this.hitEmitter.setY(this.hitEmitter.y + speedY)
    }

    public setHitEmitterPosition(x: number, y: number): void {
        this.hitEmitter.setPosition(x, y)
    }

    public setColorHitEmitter(color: string): void {
        this.hitEmitter.setTexture(color)
    }

    public startFireEmitter(): void {
        this.fireEmitter.start()
        this.fireEmitter.setVisible(true)
    }

    public stopFireEmitter(): void {
        this.fireEmitter.stop()
        this.fireEmitter.setVisible(false)
    }

    public setFireEmitterPosition(x: number, y: number): void {
        this.fireEmitter.setPosition(x, y)
    }
}
