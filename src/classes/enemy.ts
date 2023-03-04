import { Math, Scene } from 'phaser';
import { EVENTS_NAME } from '../consts';
import { Actor } from './actor';
import { Player } from './player';

export class Enemy extends Actor {

    private target: Player;

    // The distance the target must be for the enemy to start pursuing it.
    private AGRESSOR_RADIUS = 100;

    private attackHandler: () => void;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        texture: string,
        target: Player,
        frame?: string | number,
    ) {
        super(scene, x, y, texture, frame);
        this.target = target;

        // ADD TO SCENE
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // PHYSICS MODEL
        this.getBody().setSize(16, 16);
        this.getBody().setOffset(0, 0);

        /**
         *  Each time we make our player character swing the hammer, 
         * we check to see if the enemy is really close enough to get damaged.
         * 
         * When receiving damage, we turn off the physical model of the enemy 
         * so that they don’t continue to attack the player character 
         * while in the process of disappearing, 
         * and after blinking, we remove them from the scene.
         */
        this.attackHandler = () => {
            if (
              Phaser.Math.Distance.BetweenPoints(
                { x: this.x, y: this.y },
                { x: this.target.x, y: this.target.y },
              ) < this.target.width
            ) {
                this.getDamage();

                // Disbale physical body
                this.disableBody(true, false);

                this.scene.time.delayedCall(300, () => {
                    this.destroy();
                });
            }
        };

        // Events
        /**
         * When enemy disappearing, we must stopit taking damage
         */
        this.scene.game.events.on(EVENTS_NAME.ATTACK, this.attackHandler, this);
        this.on('destroy', () => {
            this.scene.game.events.removeListener(EVENTS_NAME.ATTACK, this.attackHandler);
        });
    }

    /**
     *  This is a built-in function for classes like GameObjects, 
     * and it gets triggered every time before the game frames are re-rendered. 
     * 
     * Here we describe the “brains” of our enemy. 
     * 
     * They will appear to be waiting until the target comes close enough to start moving towards it:
     */
    preUpdate(): void {
        if (
            Phaser.Math.Distance.BetweenPoints(
            { x: this.x, y: this.y },
            { x: this.target.x, y: this.target.y },
            ) < this.AGRESSOR_RADIUS
        ) {

            // Chasing
            this.getBody().setVelocityX(this.target.x - this.x);
            this.getBody().setVelocityY(this.target.y - this.y);
        } else {

            // Waiting
            this.getBody().setVelocity(0);
        }
    }


    public setTarget(target: Player): void {
        this.target = target;
    }
}