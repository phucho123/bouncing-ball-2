import { Object } from './Object'

export class Spike extends Object {
    constructor(scene: Phaser.Scene) {
        super(scene)
    }

    public create(x: number, y: number, width: number, scaleX: number): void {
        if (scaleX < 1.1) return
        const tmp = Phaser.Math.Between(0, 5)
        if (tmp != 3) return
        const dir = Phaser.Math.Between(0, 1)
        let newSpike
        const newSpikeFilter = this.arr.filter((spike) => spike.x + spike.displayWidth / 2 <= 0)
        if (newSpikeFilter.length == 0) {
            newSpike = this.scene.add.image(x, y, 'spike').setScale(0.3)
            this.arr.push(newSpike)
            console.log('create New Spike')
        } else {
            newSpike = newSpikeFilter[0]
        }

        if (newSpike) {
            newSpike.setState(0)
            newSpike.setAlpha(1).setDepth(0)
            if (dir == 0)
                newSpike.setPosition(
                    x - width / 2 + newSpike.displayWidth / 2,
                    y - newSpike.displayHeight / 2
                )
            else
                newSpike.setPosition(
                    x + width / 2 - newSpike.displayWidth / 2,
                    y - newSpike.displayHeight / 2
                )
        }
    }

    public createWithTile(x: number, y: number, width: number, dir: string): void {
        if (dir == '') return
        let newSpike
        const newSpikeFilter = this.arr.filter((spike) => spike.x + spike.displayWidth / 2 <= 0)
        if (newSpikeFilter.length == 0) {
            newSpike = this.scene.add.image(x, y, 'spike').setScale(0.3)
            this.arr.push(newSpike)
            console.log('create New Spike')
        } else {
            newSpike = newSpikeFilter[0]
        }

        if (newSpike) {
            newSpike.setState(0)
            newSpike.setAlpha(1).setDepth(0)
            if (dir == 'left')
                newSpike.setPosition(
                    x - width / 2 + newSpike.displayWidth / 2,
                    y - newSpike.displayHeight / 2
                )
            else
                newSpike.setPosition(
                    x + width / 2 - newSpike.displayWidth / 2,
                    y - newSpike.displayHeight / 2
                )
        }
    }
}
