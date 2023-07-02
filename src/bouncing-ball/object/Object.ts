export class Object {
    protected scene: Phaser.Scene
    protected arr: (
        | Phaser.GameObjects.Image
        | Phaser.Physics.Matter.Image
        | Phaser.GameObjects.Rectangle
    )[]

    constructor(scene: Phaser.Scene) {
        this.scene = scene
        this.arr = []
    }

    public clear(): void {
        for (const item of this.arr) {
            item.setX(-1000)
        }
    }

    public move(speedX: number, speedY: number): void {
        for (const item of this.arr) {
            item.setX(item.x + speedX)

            if (item.state == 1) item.setY(item.y + speedY)
        }
    }

    public get(): (
        | Phaser.GameObjects.Image
        | Phaser.Physics.Matter.Image
        | Phaser.GameObjects.Rectangle
    )[] {
        return this.arr
    }
}
