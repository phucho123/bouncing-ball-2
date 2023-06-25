export class PlayScene extends Phaser.Scene {
    ball: Phaser.Physics.Matter.Image
    container: Phaser.GameObjects.Container
    speed = 0
    flag = false
    constructor() {
        super({ key: 'Play Scene' })
    }

    preload() {
        this.load.image('basket1', '../assets/images/basket1.png')
        this.load.image('basket2', '../assets/images/basket2.png')
        this.load.image('basket3', '../assets/images/basket3.png')
        this.load.image('ball', '../assets/images/ball.png')

        this.load.image('rect', 'assets/images/up-pipe.png')
    }

    create() {
        this.matter.world.setBounds(0, 0, 400, 600, 32, true, true, true, true)
        const image1 = this.add.image(0, 0, 'basket1').setScale(0.2, 0.2)
        const image2 = this.add.image(0, 10, 'basket2').setScale(0.2, 0.2).setDepth(2)
        const image3 = this.add.image(0, 25, 'basket3').setDepth(1)
        image3.setScale(image2.displayWidth / image3.displayWidth, 0.2).setDepth(2)

        this.container = this.add.container(0, 0, [image1, image3, image2])

        this.container.setSize(image1.displayWidth, (image3.displayHeight / 2 + image3.y) * 2)

        this.container.setPosition(this.container.width / 2, 300)

        // const tmp_rect = this.matter.add
        //     .image(200, this.container.y + this.container.height / 2, 'basket3')
        //     .setScale(0.25, 0.25)
        //     .setAlpha(0)

        // tmp_rect.setRectangle(10, 1)

        // tmp_rect.setStatic(true)

        const tmp_rect_2 = this.matter.add
            .image(this.container.x - this.container.width / 2, this.container.y + 3, 'rect')
            .setScale(0.25, 0.25)

        tmp_rect_2.setCircle(3)

        tmp_rect_2.setStatic(true)

        const tmp_rect_3 = this.matter.add
            .image(this.container.x + this.container.width / 2, this.container.y + 3, 'rect')
            .setScale(0.25, 0.25)

        tmp_rect_3.setCircle(3)

        tmp_rect_3.setStatic(true)

        this.container.add([tmp_rect_2, tmp_rect_3])
        tmp_rect_2.setPosition(-this.container.width / 2, 3)
        tmp_rect_3.setPosition(this.container.width / 2, 3)

        // this.container.add([tmp_rect_2, tmp_rect_3])

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

        // this.container.setSize(100, 300)

        this.container.setInteractive()

        this.input.setDraggable(this.container)

        this.ball = this.matter.add
            .image(50, 100, 'ball')
            .setScale(0.1, 0.1)
            .setDepth(0)
            .setInteractive()

        this.input.setDraggable(this.ball)

        this.ball.on('drag', (pointer: MouseEvent, dragX: number, dragY: number) => {
            this.speed = Math.min(20, Math.abs((pointer.y - this.container.y) / 10))
            console.log(this.speed)
        })

        this.container.setRotation(Math.PI / 3)

        this.ball.on('dragend', () => {
            // this.matter.world.setGravity(0)
            // this.ball.setY(-10)
            this.container.remove(this.ball)
            this.ball.setPosition(this.container.x, this.container.y + this.container.height / 4)
            // this.ball.setVelocity(Math.cos(this.container.angle))
            // console.log(this.ball.getVelocity())
            this.ball.setAngle(this.container.angle)
            this.ball.setVelocity(-this.speed)
            // this.container.remove(this.ball)
            this.flag = false
            this.matter.resume()
            // this.flag = false
            // this.container.remove(this.ball)
            // console.log(this.speed)
        })

        // this.ball.setOnCollide(() => {
        //     this.matter.pause()
        //     console.log(this.ball.y)
        // })

        // this.container.on('drag', (pointer: MouseEvent, dragX: number, dragY: number) => {
        //     const a = pointer.x - this.container.x
        //     const b = pointer.y - this.container.y
        //     // this.container.setPosition(dragX, dragY)
        //     this.container.setRotation(Math.atan(b / a))
        // })

        // this.ball.setOnCollide(() => this.matter.pause())

        // this.ball.setOnCollideWith(tmp_rect, () => {
        //     this.container.addAt(this.ball, 1)
        //     // this.matter.world.remove(this.ball)
        //     // this.container.add(this.ball)
        //     this.ball.setPosition(0, this.container.height / 4)
        //     this.matter.pause()
        //     // this.ball.setIgnoreGravity(true)
        //     // this.ball.applyForce(new Phaser.Math.Vector2(0, 0))

        //     // console.log('hello there')
        // })

        this.ball.setBounce(1)
        this.ball.setMass(3)

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
        if (
            this.ball.x - this.ball.displayWidth / 2 >=
                this.container.x - this.container.width / 2 &&
            this.ball.x + this.ball.displayWidth / 2 <=
                this.container.x + this.container.width / 2 &&
            this.ball.y >= this.container.height / 4 + this.container.y &&
            this.ball.y - this.ball.displayHeight / 2 <=
                this.container.height / 4 + this.container.y &&
            !this.flag
        ) {
            this.container.addAt(this.ball, 0)
            this.ball.setPosition(0, this.container.height / 4)
            this.flag = true
            this.matter.pause()
        }
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

// export class PlayScene extends Phaser.Scene {
//     ball: Phaser.Physics.Matter.Image
//     baskets: Phaser.GameObjects.Container[] = []
//     // container: Phaser.GameObjects.Container
//     speed = 0
//     flag = false
//     constructor() {
//         super({ key: 'Play Scene' })
//     }

//     preload() {
//         this.load.image('basket1', '../assets/images/basket1.png')
//         this.load.image('basket2', '../assets/images/basket2.png')
//         this.load.image('basket3', '../assets/images/basket3.png')
//         this.load.image('ball', '../assets/images/ball.png')

//         this.load.image('rect', 'assets/images/up-pipe.png')
//     }

//     create() {
//         this.matter.world.setBounds(0, 0, 400, 600, 32, true, true, true, true)
//         // const image1 = this.add.image(0, 0, 'basket1').setScale(0.2, 0.2)
//         // const image2 = this.add.image(0, 10, 'basket2').setScale(0.2, 0.2).setDepth(2)
//         // const image3 = this.add.image(0, 25, 'basket3').setDepth(1)
//         // image3.setScale(image2.displayWidth / image3.displayWidth, 0.2).setDepth(2)

//         // this.container = this.add.container(0, 0, [image1, image3, image2])

//         // this.container.setSize(image1.displayWidth, (image3.displayHeight / 2 + image3.y) * 2)

//         // this.container.setPosition(this.container.width / 2, 300)

//         // const tmp_rect = this.matter.add
//         //     .image(200, this.container.y + this.container.height / 2, 'basket3')
//         //     .setScale(0.25, 0.25)
//         //     .setAlpha(0)

//         // tmp_rect.setRectangle(10, 1)

//         // tmp_rect.setStatic(true)

//         // const tmp_rect_2 = this.matter.add
//         //     .image(this.container.x - this.container.width / 2, this.container.y + 3, 'rect')
//         //     .setScale(0.25, 0.25)
//         //     .setAlpha(0)

//         // tmp_rect_2.setCircle(3)

//         // tmp_rect_2.setStatic(true)

//         // const tmp_rect_3 = this.matter.add
//         //     .image(this.container.x + this.container.width / 2, this.container.y + 3, 'rect')
//         //     .setScale(0.25, 0.25)
//         //     .setAlpha(0)

//         // tmp_rect_3.setCircle(3)

//         // tmp_rect_3.setStatic(true)

//         // this.container.add([tmp_rect_2, tmp_rect_3])
//         // tmp_rect_2.setPosition(-this.container.width / 2, 3)
//         // tmp_rect_3.setPosition(this.container.width / 2, 3)

//         // this.container.add([tmp_rect_2, tmp_rect_3])

//         // const tmp_rect_4 = this.matter.add
//         //     .image(this.container.x + this.container.width / 2, this.container.y, 'basket3')
//         //     .setScale(0.25, 0.25)

//         // tmp_rect_4.setRectangle(5, 10)

//         // tmp_rect_4.setStatic(true).setRotation(30 * Phaser.Math.DEG_TO_RAD)

//         // const tmp_rect_5 = this.matter.add
//         //     .image(this.container.x + this.container.width / 2, this.container.y, 'basket3')
//         //     .setScale(0.25, 0.25)

//         // tmp_rect_5.setRectangle(5, 10)

//         // tmp_rect_5.setStatic(true)

//         // this.container.setSize(100, 300)

//         // this.container.setInteractive()

//         // this.input.setDraggable(this.container)

//         this.createBasket(0, 300, 0)
//         // this.createBasket(300, 400, -30)

//         this.ball = this.matter.add
//             .image(60, 100, 'ball')
//             .setScale(0.1, 0.1)
//             .setDepth(0)
//             .setInteractive()

//         this.input.setDraggable(this.ball)

//         this.ball.on('drag', (pointer: MouseEvent, dragX: number, dragY: number) => {
//             const container = this.baskets.filter((container) => container.active == false)[0]
//             this.speed = Math.min(20, Math.abs((pointer.y - container.y) / 10))
//             // console.log(this.speed)
//         })

//         // this.container.setRotation(Math.PI / 3)

//         this.ball.on('dragend', () => {
//             // this.matter.world.setGravity(0)
//             // this.ball.setY(-10)
//             const container = this.baskets.filter((container) => container.active == false)[0]
//             container.remove(this.ball)
//             this.ball.setPosition(container.x, container.y + container.height / 4)
//             // this.ball.setVelocity(Math.cos(this.container.angle))
//             // console.log(this.ball.getVelocity())
//             this.ball.setAngle(container.angle)
//             this.ball.setVelocity(
//                 this.speed * Math.cos(this.ball.angle * Phaser.Math.DEG_TO_RAD),
//                 -this.speed * Math.sin(this.ball.angle * Phaser.Math.DEG_TO_RAD)
//             )
//             console.log(this.ball.getVelocity())
//             // this.container.remove(this.ball)
//             this.flag = false
//             container.setActive(true)
//             this.matter.resume()
//             // this.flag = false
//             // this.container.remove(this.ball)
//             // console.log(this.speed)
//         })

//         // this.ball.setOnCollide(() => {
//         //     this.matter.pause()
//         //     console.log(this.ball.y)
//         // })

//         // this.container.on('drag', (pointer: MouseEvent, dragX: number, dragY: number) => {
//         //     const a = pointer.x - this.container.x
//         //     const b = pointer.y - this.container.y
//         //     // this.container.setPosition(dragX, dragY)
//         //     this.container.setRotation(Math.atan(b / a))
//         // })

//         // this.ball.setOnCollide(() => this.matter.pause())

//         // this.ball.setOnCollideWith(tmp_rect, () => {
//         //     this.container.addAt(this.ball, 1)
//         //     // this.matter.world.remove(this.ball)
//         //     // this.container.add(this.ball)
//         //     this.ball.setPosition(0, this.container.height / 4)
//         //     this.matter.pause()
//         //     // this.ball.setIgnoreGravity(true)
//         //     // this.ball.applyForce(new Phaser.Math.Vector2(0, 0))

//         //     // console.log('hello there')
//         // })

//         this.ball.setBounce(1)
//         this.ball.setMass(5)

//         // this.ball.setOnCollide(() => {
//         //     this.ball.setX(this.container.x)
//         // })

//         // this.container.on('drag', (pointer: MouseEvent, dragX: number, dragY: number) => {
//         //     this.container.setRotation(con)
//         // })

//         // this.matter.world.setthis.containeravity(0, 0)

//         // this.input.on('dra')
//     }

//     update() {
//         for (const container of this.baskets) {
//             if (
//                 this.ball.x - this.ball.displayWidth / 2 >= container.x - container.width / 2 &&
//                 this.ball.x + this.ball.displayWidth / 2 <= container.x + container.width / 2 &&
//                 this.ball.y >= container.height / 4 + container.y &&
//                 this.ball.y - this.ball.displayHeight / 2 <= container.height / 4 + container.y &&
//                 !this.flag
//             ) {
//                 container.addAt(this.ball, 0)
//                 this.ball.setPosition(0, container.height / 4)
//                 this.matter.pause()
//                 this.flag = true
//                 container.setActive(false)
//                 break
//             }
//         }
//         // if (this.) {
//         //     this.ball.setVelocityX(0)
//         //     this.ball.setBounce(0)
//         //     this.ball.setX(this.container.x)
//         // }
//         // if (
//         //     this.ball.y + this.ball.displayHeight / 2 >=
//         //     this.container.height / 2 + this.container.y
//         // ) {
//         //     this.ball.setX(200)
//         // }
//     }

//     createBasket(x: number, y: number, angle: number) {
//         const image1 = this.add.image(0, 0, 'basket1').setScale(0.2, 0.2)
//         const image2 = this.add.image(0, 10, 'basket2').setScale(0.2, 0.2).setDepth(2)
//         const image3 = this.add.image(0, 25, 'basket3').setDepth(1)
//         image3.setScale(image2.displayWidth / image3.displayWidth, 0.2).setDepth(2)

//         const container = this.add.container(0, 0, [image1, image3, image2])

//         container.setSize(image1.displayWidth, (image3.displayHeight / 2 + image3.y) * 2)

//         container.setPosition(x + container.width / 2, y + container.height / 2)

//         const tmp_rect_2 = this.matter.add
//             .image(container.x - container.width / 2, container.y + 3, 'rect')
//             .setScale(0.25, 0.25)

//         tmp_rect_2.setRectangle(10, 10)

//         tmp_rect_2.setStatic(true)

//         const tmp_rect_3 = this.matter.add
//             .image(container.x + container.width / 2, container.y + 3, 'rect')
//             .setScale(0.25, 0.25)

//         tmp_rect_3.setRectangle(10, 10)

//         tmp_rect_3.setStatic(true)

//         container.add([tmp_rect_2, tmp_rect_3])
//         tmp_rect_2.setPosition(-container.width / 2, 3)
//         tmp_rect_3.setPosition(container.width / 2, 3)

//         container.setInteractive()

//         this.input.setDraggable(container)
//         container.setRotation(angle * Phaser.Math.DEG_TO_RAD)

//         this.baskets.push(container)
//     }
// }
