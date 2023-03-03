import { Scene } from 'phaser';

export class LoadingScene extends Scene {

  // Instance variables
  private king?: Phaser.GameObjects.Sprite;

  constructor() {
    super('loading-scene');
  }
  create(): void {
		this.scene.start('level-1-scene');
	}

  preload(): void {

    // path from baseURL to file: 'sprites/king.png'
    this.load.baseURL = 'assets/';
    
    // Our king texture
    this.load.image('king', 'sprites/king.png');

    // Our king atlas
    this.load.atlas('a-king', 'spritesheets/a-king.png', 'spritesheets/a-king_atlas.json');

    // Loading Map
    this.load.image({
      key: 'tiles',
      url: 'tilemaps/tiles/dungeon-16-16.png',
    });
    this.load.tilemapTiledJSON('dungeon', 'tilemaps/json/dungeon.json');

    // CHEST LOADING
    this.load.spritesheet('tiles_spr', 'tilemaps/tiles/dungeon-16-16.png', {
      frameWidth: 16,
      frameHeight: 16,
    });
  }
}