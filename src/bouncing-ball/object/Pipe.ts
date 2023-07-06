import { Object } from './Object'

export class Pipe extends Object {
    constructor(scene: Phaser.Scene) {
        super(scene)
    }

    public create(x: number, y: number, width: number, height: number, color: number): void {
        let newPipe: Phaser.GameObjects.Rectangle | undefined

        const newPipeFilter = this.arr.filter((pipe) => pipe.x + pipe.displayWidth / 2 <= 0)
        if (newPipeFilter.length == 0) {
            newPipe = this.scene.add
                .rectangle(x, y, width, height, 0xff0000)
                .setDepth(0)
                .setOrigin(0.5, 0)
            console.log('create New Pipe')
            this.arr.push(newPipe)
        } else {
            newPipe = newPipeFilter[0] as Phaser.GameObjects.Rectangle | undefined
        }
        if (newPipe) {
            newPipe.displayWidth = width
            newPipe.displayHeight = height
            newPipe.setPosition(x, y)
            newPipe.setState(0)
            newPipe.fillColor = color
        }
    }
}
