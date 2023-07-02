import { Object } from './Object'

export class Hitpoint extends Object {
    constructor(scene: Phaser.Scene) {
        super(scene)
    }

    public create(
        x: number,
        y: number,
        width: number,
        height: number,
        diff_x: number,
        color: number
    ): void {
        let hitpoint: Phaser.GameObjects.Rectangle | undefined
        const newHitpointFilter = this.arr.filter(
            (hitpoint) => hitpoint.x + hitpoint.displayWidth / 2 <= 0
        )
        if (newHitpointFilter.length == 0) {
            hitpoint = this.scene.add.rectangle(x, y, width / 3, height, 0xff0000).setDepth(3)
            this.arr.push(hitpoint)
            console.log('create New Spike')
        } else {
            hitpoint = newHitpointFilter[0] as Phaser.GameObjects.Rectangle | undefined
            if (hitpoint) {
                hitpoint.setY(y)
                hitpoint.scaleX = width / (3 * hitpoint.width)
            }
        }
        if (hitpoint != undefined) {
            if (diff_x < -width / 6) {
                hitpoint.setX(x - width / 3)
            } else if (diff_x > width / 6) {
                hitpoint.setX(x + width / 3)
            } else {
                hitpoint.setX(x)
            }
            hitpoint.fillColor = color
            hitpoint.setState(1)
        }
    }
}
