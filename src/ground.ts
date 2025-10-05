import { Random, Scene, Sprite, TileMap, vec } from "excalibur";
import { Resources } from "./resources";
import { Collectable } from "./collectable";

import Config from './config';
import { Enemy } from "./enemy";
import { Player } from "./player";
import { soundManager } from "./sound-manager-2";


export class GroundGenerator {
  worldHeight = 200;
  worldOrigin = vec(0, 64 * 5);
  startChunk = new TileMap({
    pos: this.worldOrigin,
    tileWidth: 64,
    tileHeight: 64,
    rows: 200,
    columns: 200
  });
  visibleChunks: TileMap[] = []
  chunkMap: Map<string, TileMap> = new Map();
  chunks: TileMap[] = [];
  dirtFront: Sprite;
  dirtBack: Sprite;
  player!: Player;

  constructor(private scene: Scene, private random: Random) {
    this.dirtFront = Resources.Dirt.toSprite();
    this.dirtBack = Resources.BackgroundDirt.toSprite();
    this.startChunk.pointer.useColliderShape = false;
    this.startChunk.pointer.useGraphicsBounds = false;
    this.chunkMap.set('0+0', this.startChunk);
  }

  digTile(x: number, y: number): boolean {
    const tile = this.getTile(x, y);
    if (tile) {
      if (tile.data.get('dug')) {
        return false;
      }
      soundManager.play('playerDig');
      tile.data.set('dug', true);
      tile.clearGraphics();
      tile.addGraphic(this.dirtBack);
      return true;
    }
    return true;
  }

  shouldGenerate() {
    const screen = this.scene.engine.screen;
    const unsafeArea = this.scene.engine.screen.unsafeArea;
    const bottomLeft = screen.screenToWorldCoordinates(unsafeArea.bottomLeft);

    const tileBottomLeftX = Math.floor(bottomLeft.x / 64);
    const tileBottomLeftY = Math.floor(bottomLeft.y / 64);
    const maybeTile = this.getTile(tileBottomLeftX, tileBottomLeftY);
    if (!maybeTile) {
      this.generateChunk(Math.floor(tileBottomLeftX / this.startChunk.columns), Math.floor(tileBottomLeftY / this.startChunk.rows));
    }

  }


  generateChunk(chunkX: number, chunkY: number) {
    const coord = `${chunkX}+${chunkY}`;
    const maybeChunk = this.chunkMap.get(coord);
    if (maybeChunk || chunkY < 0) {
      return;
    }

    console.log("Generating chunk!", coord);

    const newChunkOrigin = this.worldOrigin.add(
      vec(
        chunkX * this.startChunk.width,
        chunkY * this.startChunk.height
      )
    );

    const newChunk = new TileMap({
      pos: newChunkOrigin,
      tileWidth: 64,
      tileHeight: 64,
      rows: 200,
      columns: 200
    });

    newChunk.pointer.useColliderShape = false;
    newChunk.pointer.useGraphicsBounds = false;
    this.chunkMap.set(coord, newChunk);

    this.scene.add(newChunk);
    for (let i = 0; i < newChunk.tiles.length; i++) {
      const tile = newChunk.tiles[i];
      if (tile.y === 0 && chunkY === 0) {
        tile.data.set('dug', true);
      } else {
        tile.addGraphic(this.dirtFront);
        tile.solid = true;

        this.generateCollectables(tile.x + chunkX * this.startChunk.columns, tile.y + chunkY * this.startChunk.rows);
        this.generateEnemy(tile.x + chunkX * this.startChunk.columns, tile.y + chunkY * this.startChunk.rows, this.player);
      }
    }
  }

  generate(player: Player) {
    this.player = player;
    this.scene.add(this.startChunk);
    for (let i = 0; i < this.startChunk.tiles.length; i++) {
      const tile = this.startChunk.tiles[i];
      if (tile.y === 0) {
        tile.data.set('dug', true);
      } else {
        tile.addGraphic(this.dirtFront);
        tile.solid = true;

        this.generateCollectables(tile.x, tile.y);
        this.generateEnemy(tile.x, tile.y, player);
      }
    }

    this.scene.add(new Collectable(10, 3, 'gold', this));
    this.scene.add(new Collectable(2, 3, 'silver', this));
  }

  generateEnemy(x: number, y: number, player: Player) {

    const tile = this.getTile(x, y);
    if (tile?.data.get('enemy')) return;

    const ran = this.random.next();
    const depthBonus = (y > 10) ? (y / this.worldHeight) / 100 : 0;

    for (let enemyType in Config.EnemyPercent) {
      if (enemyType in Config.EnemyPercent) {
        if ((1.0 - (Config.EnemyPercent as any)[enemyType as string] - depthBonus) < ran) {
          const enemy = new Enemy(x, y, enemyType as any, player, this, this.random);
          this.scene.add(enemy);
          break;
        }
      }
    }
  }

  generateCollectables(x: number, y: number) {

    const tile = this.getTile(x, y);
    if (tile?.data.get('loot')) return;

    const ran = this.random.next();
    const depthBonus = (y > 10) ? (y / this.worldHeight) / 100 : 0;

    for (let loot in Config.LootPercent) {
      if (loot in Config.LootPercent) {
        if ((1.0 - (Config.LootPercent as any)[loot as string] - depthBonus) < ran) {
          const lootable = new Collectable(x, y, loot as any, this);
          this.scene.add(lootable);
          break;
        }
      }
    }
  }

  getTile(x: number, y: number) {
    const xcoord = Math.floor(x / this.startChunk.columns);
    const ycoord = Math.floor(y / this.startChunk.rows);
    const chunkCoord = `${xcoord}+${ycoord}`;
    const currentChunk = this.chunkMap.get(chunkCoord);
    if (currentChunk) {
      let newX = x;
      while (newX < 0) {
        newX += this.startChunk.columns;
      }
      let newY = y;
      while (newY < 0) {
        newY += this.startChunk.rows;
      }
      return currentChunk.getTile(newX, newY);
    }
    return;
  }
}
