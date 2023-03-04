import { Scene, Tilemaps } from 'phaser';
import { gameObjectsToObjectPoints } from '../../helpers/gameobject-to-object-point';
import { Player } from '../../classes/player';
import { EVENTS_NAME } from '../../consts';
import { Enemy } from '../../classes/enemy';

export class Level1 extends Scene {
    private player!: Player;
    private enemies!: Enemy[];

    private map!: Tilemaps.Tilemap;
    private tileset?: Tilemaps.Tileset;
    private wallsLayer!: Tilemaps.TilemapLayer;
    private groundLayer?: Tilemaps.TilemapLayer;

    private chests!: Phaser.GameObjects.Sprite[];
    
    constructor() {
      super('level-1-scene');
    }

    // Initialize map
    private initMap(): void {
        this.map = this.make.tilemap({ key: 'dungeon', tileWidth: 16, tileHeight: 16 });
        this.tileset = this.map.addTilesetImage('dungeon', 'tiles');
        this.groundLayer = this.map.createLayer('Ground', this.tileset, 0, 0);
        this.wallsLayer = this.map.createLayer('Walls', this.tileset, 0, 0);
        this.wallsLayer.setCollisionByProperty({ collides: true });
        // this.physics.add.existing(this.wallsLayer);
        this.physics.world.setBounds(0, 0, this.wallsLayer.width, this.wallsLayer.height);

        // this.showDebugWalls();
        
    }

    // Intialize camera
    private initCamera(): void {

        /**
         * Camer will zoom in and follow the player
         */
        this.cameras.main.setSize(this.game.scale.width, this.game.scale.height);
        this.cameras.main.startFollow(this.player, true, 0.09, 0.09);
        this.cameras.main.setZoom(2);
    }

    // Initialize chests
    private initChests(): void {

      /**
       * Using the this.map.filterObjects() function, 
       * select the required objects from the required layer. 
       */
      const chestPoints = gameObjectsToObjectPoints(
        this.map.filterObjects('Chests', obj => obj.name === 'ChestPoint'),
      );

      // Create a sprite with a physical model
      // 595 is the sprite's ID
      this.chests = chestPoints.map(chestPoint =>
        this.physics.add.sprite(chestPoint.x, chestPoint.y, 'tiles_spr', 595).setScale(1.5),
      );

      /** 
       * When there is an overlap with the player and the chest
       * destroy the chest and flash the camera
       */
      this.chests.forEach(chest => {
        this.physics.add.overlap(this.player, chest, (obj1, obj2) => {

          // Emit event for chest interaction
          this.game.events.emit(EVENTS_NAME.CHEST_LOOT);
          obj2.destroy();
          this.cameras.main.flash();
        });
      });
    }

    // Initialize enemies
    private initEnemies(): void {

      /**
       * Using the this.map.filterObjects() function, 
       * select the required objects from the required layer. 
      */
      const enemiesPoints = gameObjectsToObjectPoints(
        this.map.filterObjects('Enemies', (obj) => obj.name === 'EnemyPoint'),
      );

      // Create the enimy sprites 
      this.enemies = enemiesPoints.map((enemyPoint) =>
        new Enemy(this, enemyPoint.x, enemyPoint.y, 'tiles_spr', this.player, 503)
          .setName(enemyPoint.id.toString())
          .setScale(1.5),
      );

      /**
       * Enemies should collide with wallsm other enemies, and the player
       * If they do collide with the player, the player gets a damage of 1,
       * taken from his hp.
       */
      this.physics.add.collider(this.enemies, this.wallsLayer);
      this.physics.add.collider(this.enemies, this.enemies);
      this.physics.add.collider(this.player, this.enemies, (obj1, obj2) => {
        (obj1 as Player).getDamage(1);
      });
    }

    private showDebugWalls(): void {
        const debugGraphics = this.add.graphics().setAlpha(0.7);
        this.wallsLayer?.renderDebug(debugGraphics, {
          tileColor: null,
          collidingTileColor: new Phaser.Display.Color(243, 234, 48, 255),
        });
        
        console.log(this.wallsLayer?.width)
        console.log(this.wallsLayer?.height)
      }

    create(): void {

        // Load map
        this.initMap();

        // Add a player character
        this.player = new Player(this, 100, 100);

        // Load Chests
        this.initChests();

        // Load Enemies
        this.initEnemies();

        this.initCamera();

        this.physics.add.collider(this.player, this?.wallsLayer as any);
    }

    update(): void {
        this.player?.update();
    }
}