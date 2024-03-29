import { Game, Types } from 'phaser';
import { Level1, LoadingScene, UIScene } from './scenes';

// Types
declare global{
    interface Window {
        sizeChanged: () => void;
        game: Phaser.Game;
    }
}

type GameConfigExtended = Types.Core.GameConfig & {
    winScore: number;
};

window.sizeChanged = () => {
    if (window.game.isBooted) {
      setTimeout(() => {
        window.game.scale.resize(window.innerWidth, window.innerHeight);
        window.game.canvas.setAttribute(
          'style',
          `display: block; width: ${window.innerWidth}px; height: ${window.innerHeight}px;`,
        );
      }, 100);
    }
  };
window.onresize = () => window.sizeChanged();


/**
 * To declare a game, we need to indicate what parameters we’ll launch it with.
 */
export const gameConfig: GameConfigExtended = {
	title: 'Phaser game tutorial',
    type: Phaser.WEBGL,
    parent: 'game',
    backgroundColor: '#351f1b',
    scale: {
        mode: Phaser.Scale.ScaleModes.NONE,
        width: window.innerWidth,
        height: window.innerHeight,
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
        },
    },
    render: {
        antialiasGL: false,
        pixelArt: true,
    },
    callbacks: {
        postBoot: () => {
            window.sizeChanged();
        },
    },
    canvasStyle: `display: block; width: 100%; height: 100%;`,
    autoFocus: true,
    audio: {
        disableWebAudio: false,
    },
    winScore: 40,
    scene: [LoadingScene, Level1, UIScene],
};

window.game = new Game(gameConfig);