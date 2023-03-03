import { Scene } from 'phaser';
import { Score, ScoreOperations } from '../../classes/score';

export class UIScene extends Scene {
    private score!: Score;

    constructor() {
        super('ui-scene');
    }
    
    create(): void {
        this.score = new Score(this, 20, 20, 0);
    }
}