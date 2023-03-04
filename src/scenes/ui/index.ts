import { Scene } from 'phaser';
import { EVENTS_NAME, GameStatus } from '../../consts';
import { Score, ScoreOperations } from '../../classes/score';
import { Text } from "../../classes/text";

export class UIScene extends Scene {
    private score!: Score;
    private chestLootHandler: () => void;
    private gameEndPhrase!: Text;
    private gameEndHandler: (status: GameStatus) => void;

    constructor() {
        super('ui-scene');

        // Add 10 points for every chest interaction
        this.chestLootHandler = () => {
            this.score.changeValue(ScoreOperations.INCREASE, 10);
        };

        this.gameEndHandler = (status) => {
            this.cameras.main.setBackgroundColor('rgba(0,0,0,0.6)');
            this.game.scene.pause('level-1-scene');
            this.gameEndPhrase = new Text(
              this,
              this.game.scale.width / 2,
              this.game.scale.height * 0.4,
              status === GameStatus.LOSE
                ? `WASTED!\nCLICK TO RESTART`
                : `YOU ARE ROCK!\nCLICK TO RESTART`,
            )
              .setAlign('center')
              .setColor(status === GameStatus.LOSE ? '#ff0000' : '#ffffff');

            this.gameEndPhrase.setPosition(
              this.game.scale.width / 2 - this.gameEndPhrase.width / 2,
              this.game.scale.height * 0.4,
            );
          };
    }

    // Initialize event listeners
    private initListeners(): void {
        this.game.events.on(EVENTS_NAME.CHEST_LOOT, this.chestLootHandler, this);
        this.game.events.once(EVENTS_NAME.GAME_END, this.gameEndHandler, this);
    }
    
    create(): void {
        this.score = new Score(this, 20, 20, 0);
        this.initListeners();
    }
}