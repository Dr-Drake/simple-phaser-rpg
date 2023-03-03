import { Physics } from 'phaser';

export class Actor extends Physics.Arcade.Sprite {
	protected hp = 100;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
        super(scene, x, y, texture, frame);

        // Add Physical sprite (Actor) to the sceen
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Tells the world to react to the physical model of the sprite
        this.getBody().setCollideWorldBounds(true);
    }

    // For attacking the actor
	public getDamage(value?: number): void {

        /**
         * Attack animation
         * 
         * Here we describe that the alpha transparency will change 3 times 
         * within 100 ms duration: 100, 
         * each time returning to the original alpha value (yoyo: true). 
         * 
         * At the start of the blinking animation onStart, 
         * we change the actor’s HP value in accordance with how much damage it received. 
         * 
         * At the end of the onComplete animation, 
         * we forcefully set the current character’s opacity to this.setAlpha(1).
         * 
         * The value of the alpha property varies from 0 to 1. 
         * The lower the value, the more transparent the object.
         */
        this.scene.tweens.add({
            targets: this,
            duration: 100,
            repeat: 3,
            yoyo: true,
            alpha: 0.5,
            onStart: () => {
                if (value) {
                    this.hp = this.hp - value;
                }
            },
            onComplete: () => {
                this.setAlpha(1);
            },
        });
  }
	
    public getHPValue(): number {
        return this.hp;
    }

    // Rotate an actor as it moves left or right
	protected checkFlip(): void {
        if (this.body.velocity.x < 0) {
            this.scaleX = -1;
        } else {
            this.scaleX = 1;
        }
    }

    /**
     * Created due to errors in Phaser types
     * Helps us get that very physical body model of a physical object
     * @returns 
     */
    protected getBody(): Physics.Arcade.Body {
        return this.body as Physics.Arcade.Body;
    }
}