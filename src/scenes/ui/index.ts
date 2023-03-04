import { Scene } from 'phaser';
import { EVENTS_NAME } from '../../consts';
import { Score, ScoreOperations } from '../../classes/score';

export class UIScene extends Scene {
    private score!: Score;
    private chestLootHandler: () => void;

    constructor() {
        super('ui-scene');

        // Add 10 points for every chest interaction
        this.chestLootHandler = () => {
            this.score.changeValue(ScoreOperations.INCREASE, 10);
        };
    }

    // Initialize event listeners
    private initListeners(): void {
        this.game.events.on(EVENTS_NAME.CHEST_LOOT, this.chestLootHandler, this);
    }
    
    create(): void {
        this.score = new Score(this, 20, 20, 0);
        this.initListeners();
    }
}