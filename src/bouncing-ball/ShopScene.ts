export class ShopScene extends Phaser.Scene {
    constructor() {
        super({ key: 'Shop Scene' })
    }
    preload() {
        this.load.image('normal-ball', 'assets/sprites/ball.png')
        this.load.image('basket-ball', 'assets/images/ball.png')
    }
    create() {
        const ball_1 = this.add.image(0, 0, 'normal-ball').setOrigin(0).setScale(0.2)
        const ball_2 = this.add.image(100, 0, 'basket-ball').setOrigin(0)
        ball_2.setScale((ball_1.width / ball_2.width) * 0.2)
    }
}
