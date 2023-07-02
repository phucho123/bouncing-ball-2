import { Object } from './Object'

export class Gem extends Object {
    constructor(scene: Phaser.Scene) {
        super(scene)
    }

    public create(x: number, y: number): void {
        const prob = Phaser.Math.Between(0, 100) % 5
        if (prob != 0) return
        let newGem: Phaser.GameObjects.Image

        const newGemFilter = this.arr.filter(
            (gem) => gem.x + gem.displayWidth / 2 <= 0 || gem.alpha == 0
        )
        if (newGemFilter.length == 0) {
            newGem = this.scene.add.image(x, y, 'gem')
            newGem.setScale(20 / newGem.width)
            this.arr.push(newGem)
            console.log('create New Gem')
        } else {
            newGem = newGemFilter[0] as Phaser.GameObjects.Image
        }

        if (newGem) {
            const prob = Phaser.Math.Between(1, 100) % 5
            if (prob == 0) {
                newGem.setTexture('firegem')
                newGem.setScale(20 / newGem.width)
            } else {
                newGem.setTexture('gem')
                newGem.setScale(20 / newGem.width)
            }
            newGem.setState(0)
            newGem.setAlpha(1)
            newGem.setPosition(x, y - newGem.displayHeight / 2)
        }
    }
}
