import { CANVAS_WIDTH } from '../constant/constant'
import { Object } from './Object'

export class Floor extends Object {
    constructor(scene: Phaser.Scene) {
        super(scene)
    }

    public create(
        x: number | null,
        y: number,
        scaleX: number
    ): Phaser.Physics.Matter.Image | undefined {
        let newFloor: Phaser.Physics.Matter.Image | undefined

        const newFloorFilter = this.arr.filter((floor) => floor.x + floor.displayWidth / 2 <= 0)
        if (newFloorFilter.length == 0) {
            newFloor = this.scene.matter.add.image(0, 0, 'floor').setBounce(0)
            newFloor.setState(-1)
            console.log('create New Floor')
            this.arr.push(newFloor)
        } else {
            newFloor = newFloorFilter[0] as Phaser.Physics.Matter.Image | undefined
        }

        if (newFloor) {
            newFloor.setStatic(true).setY(y)
            if (x == null) newFloor.setX(CANVAS_WIDTH + newFloor.displayWidth / 2)
            else newFloor.setX(x)
            newFloor.scaleX = scaleX
            newFloor.setDepth(2)
        }
        return newFloor
    }
}
