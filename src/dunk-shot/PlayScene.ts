export class PlayScene extends Phaser.Scene {
    ball: Phaser.Physics.Matter.Image
    container: Phaser.GameObjects.Container
    speed = 0
    flag = 0
    constructor() {
        super({ key: 'Play Scene' })
    }

    preload() {
        this.load.image('basket1', '../assets/images/basket1.png')
        this.load.image('basket2', '../assets/images/basket2.png')
        this.load.image('basket3', '../assets/images/basket3.png')
        this.load.image('ball', '../assets/images/ball.png')
    }

    create() {
        this.matter.world.setBounds(0, 0, 400, 600, 32, true, true, true, true)
        const image1 = this.add.image(0, 0, 'basket1').setScale(0.2, 0.2)
        const image2 = this.add.image(0, 10, 'basket2').setScale(0.2, 0.2).setDepth(2)
        const image3 = this.add.image(0, 25, 'basket3').setDepth(1)
        image3.setScale(image2.displayWidth / image3.displayWidth, 0.2).setDepth(0)

        this.container = this.add.container(0, 0, [image1, image3, image2])

        this.container.setSize(image1.displayWidth, (image3.displayHeight / 2 + 25) * 2)

        this.container.setPosition(200, 300)

        const tmp_rect = this.matter.add
            .image(200, this.container.y + this.container.height / 2, 'basket3')
            .setScale(0.25, 0.25)
            .setAlpha(0)

        tmp_rect.setRectangle(this.container.width, 1)

        tmp_rect.setStatic(true)

        const tmp_rect_2 = this.matter.add
            .image(this.container.x - this.container.width / 2, this.container.y + 20, 'basket3')
            .setScale(0.25, 0.25)
            .setAlpha(0)

        tmp_rect_2.setCircle(5)

        tmp_rect_2.setStatic(true)

        const tmp_rect_3 = this.matter.add
            .image(this.container.x + this.container.width / 2, this.container.y + 20, 'basket3')
            .setScale(0.25, 0.25)
            .setAlpha(0)

        tmp_rect_3.setCircle(5)

        tmp_rect_3.setStatic(true)

        // const tmp_rect_4 = this.matter.add
        //     .image(this.container.x + this.container.width / 2, this.container.y, 'basket3')
        //     .setScale(0.25, 0.25)

        // tmp_rect_4.setRectangle(5, 10)

        // tmp_rect_4.setStatic(true).setRotation(30 * Phaser.Math.DEG_TO_RAD)

        // const tmp_rect_5 = this.matter.add
        //     .image(this.container.x + this.container.width / 2, this.container.y, 'basket3')
        //     .setScale(0.25, 0.25)

        // tmp_rect_5.setRectangle(5, 10)

        // tmp_rect_5.setStatic(true)

        this.container.setSize(100, 300)

        this.container.setInteractive()

        this.input.setDraggable(this.container)

        this.ball = this.matter.add
            .image(230, 0, 'ball')
            .setScale(0.1, 0.1)
            .setDepth(0)
            .setInteractive()

        this.input.setDraggable(this.ball)

        this.ball.on('drag', (pointer: MouseEvent, dragX: number, dragY: number) => {
            this.speed = dragY - pointer.y
            console.log(this.speed)
        })

        this.ball.on('dragend', () => {
            this.flag = 0
            this.ball.setVelocity(0, this.speed)
            this.matter.resume()
            console.log(this.speed)
        })

        this.container.on('drag', (pointer: MouseEvent, dragX: number, dragY: number) => {
            const a = pointer.x - this.container.x
            const b = pointer.y - this.container.y
            this.container.setRotation((Math.PI * 2 + Math.atan(b / a)) % (2 * Math.PI))
        })

        this.ball.setOnCollideWith(tmp_rect, () => {
            // this.ball.setX(this.container.x)
            // this.container.addAt(this.ball, 0)
            // this.container.add(this.ball)
            this.ball.setPosition(this.container.x, this.container.y + 20)
            this.matter.pause()
            // console.log('hello there')
        })

        this.ball.setBounce(1)
        this.ball.setMass(1)

        // this.ball.setOnCollide(() => {
        //     this.ball.setX(this.container.x)
        // })

        // this.container.on('drag', (pointer: MouseEvent, dragX: number, dragY: number) => {
        //     this.container.setRotation(con)
        // })

        // this.matter.world.setthis.containeravity(0, 0)

        // this.input.on('dra')
    }

    update() {
        // if (this.) {
        //     this.ball.setVelocityX(0)
        //     this.ball.setBounce(0)
        //     this.ball.setX(this.container.x)
        // }
        // if (
        //     this.ball.y + this.ball.displayHeight / 2 >=
        //     this.container.height / 2 + this.container.y
        // ) {
        //     this.ball.setX(200)
        // }
    }
}
