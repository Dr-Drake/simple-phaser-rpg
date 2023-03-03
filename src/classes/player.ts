import { Actor } from './actor';

export class Player extends Actor {

    // Keys to track
    private keyUp: Phaser.Input.Keyboard.Key;
    private keyLeft: Phaser.Input.Keyboard.Key;
    private keyDown: Phaser.Input.Keyboard.Key;
    private keyRight: Phaser.Input.Keyboard.Key;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'king');

        this.initAnimations();

        // KEYS
        this.keyUp = this.scene.input.keyboard.addKey("UP");
        this.keyLeft = this.scene.input.keyboard.addKey("LEFT");
        this.keyDown = this.scene.input.keyboard.addKey("DOWN");
        this.keyRight = this.scene.input.keyboard.addKey("RIGHT");

        // PHYSICS
        /**
         * Sometimes character sprites are quite large or have white space. 
         * In this case, we can specify the size of the physical model (box) 
         * setSize(width, height) 
         * and set the point by XY coordinates to calculate the physical model.
         */
        this.getBody().setSize(30, 30);
        this.getBody().setOffset(8, 0);
    }

    private initAnimations(): void {
        this.scene.anims.create({
            key: 'run',
            frames: this.scene.anims.generateFrameNames('a-king', {
                prefix: 'run-',
                end: 7,
            }),
            frameRate: 8,
        });
        this.scene.anims.create({
            key: 'attack',
            frames: this.scene.anims.generateFrameNames('a-king', {
                prefix: 'attack-',
                end: 2,
            }),
            frameRate: 8,
        });
    }

    update(): void {

        /**
         * In each frame, we check if any control key is pressed 
         * and change the XY movement speed depending on the direction. 
         * 
         * If a key is not pressed, set the speed = 0. 
         * 
         * Also, when moving left-right, we check whether we need to rotate the character.
         * 
         * Note that when rotating the character,
         * we move the rendering point of the physical model. 
         * 
         * We have to do it because of the body miscalculation error of Phaser.
         */
        this.getBody().setVelocity(0);
        if (this.keyUp?.isDown) {
            this.body.velocity.y = -110;
            !this.anims.isPlaying && this.anims.play('run', true);
        }
        if (this.keyLeft?.isDown) {
            this.body.velocity.x = -110;
            this.checkFlip();
            this.getBody().setOffset(48, 15);
            !this.anims.isPlaying && this.anims.play('run', true);
        }
        if (this.keyDown?.isDown) {
            this.body.velocity.y = 110;
            !this.anims.isPlaying && this.anims.play('run', true);
        }
        if (this.keyRight?.isDown) {
            this.body.velocity.x = 110;
            this.checkFlip();
            this.getBody().setOffset(15, 15);
            !this.anims.isPlaying && this.anims.play('run', true);
        }
    }
}