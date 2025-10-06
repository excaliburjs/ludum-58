import { PointerComponent, Random, Sprite, TileMap, vec } from "excalibur";
import { Resources } from "./resources";
import { Collectable } from "./collectable";

import Config from './config';
import { Enemy } from "./enemy";
import { Player } from "./player";
import { soundManager } from "./sound-manager-2";
import { DigLevel } from "./level";
import { Chest } from "./chest";


export class GroundGenerator {
  worldHeight = Config.WorldHeight;
  worldOrigin = vec(0, 64 * 5);
  startChunk = new TileMap({
    pos: this.worldOrigin,
    tileWidth: 64,
    tileHeight: 64,
    rows: Config.ChunkSize.height,
    columns: Config.ChunkSize.width
  });
  visibleChunks: TileMap[] = []
  chunkMap: Map<string, TileMap> = new Map();
  chunks: TileMap[] = [];
  dirtFront: Sprite;
  dirtBack: Sprite;
  player!: Player;
  grass: Sprite;

  constructor(private scene: DigLevel, private random: Random) {
    this.dirtFront = Resources.Dirt.toSprite();
    this.dirtBack = Resources.BackgroundDirt.toSprite();
    this.grass = Resources.Grass.toSprite();
    this.startChunk.removeComponent(PointerComponent);
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


  buryTile(x: number, y: number): boolean {
    const tile = this.getTile(x, y);
    if (tile) {
      if (tile.data.get('dug')) {
        tile.data.set('dug', false);
        tile.clearGraphics();
        tile.addGraphic(this.dirtFront);
        // TODO play fill in sound
      }
      return true;
    }
    return true;
  }

  shouldGenerate() {
    const screen = this.scene.engine.screen;
    const unsafeArea = this.scene.engine.screen.unsafeArea;
    const bottomLeft = screen.screenToWorldCoordinates(unsafeArea.bottomLeft);
    const bottomRight = screen.screenToWorldCoordinates(unsafeArea.bottomRight);
    const topLeft = screen.screenToWorldCoordinates(unsafeArea.topLeft);
    const topRight = screen.screenToWorldCoordinates(unsafeArea.topRight);

    const tileBottomLeftX = Math.floor(bottomLeft.x / 64);
    const tileBottomLeftY = Math.floor(bottomLeft.y / 64);
    const maybeTile1 = this.getTile(tileBottomLeftX, tileBottomLeftY);
    if (!maybeTile1) {
      this.generateChunk(Math.floor(tileBottomLeftX / this.startChunk.columns), Math.floor(tileBottomLeftY / this.startChunk.rows));
    }


    const tileTopLeftX = Math.floor(topLeft.x / 64);
    const tileTopLeftY = Math.floor(topLeft.y / 64);
    const maybeTile2 = this.getTile(tileTopLeftX, tileTopLeftY);
    if (!maybeTile2) {
      this.generateChunk(Math.floor(tileTopLeftX / this.startChunk.columns), Math.floor(tileTopLeftY / this.startChunk.rows));
    }


    const tileBottomRightX = Math.floor(bottomRight.x / 64);
    const tileBottomRightY = Math.floor(bottomRight.y / 64);
    const maybeTile3 = this.getTile(tileBottomRightX, tileBottomRightY);
    if (!maybeTile3) {
      this.generateChunk(Math.floor(tileBottomRightX / this.startChunk.columns), Math.floor(tileBottomRightY / this.startChunk.rows));
    }


    const tileTopRightX = Math.floor(topRight.x / 64);
    const tileTopRightY = Math.floor(topRight.y / 64);
    const maybeTile4 = this.getTile(tileTopRightX, tileTopRightY);
    if (!maybeTile4) {
      this.generateChunk(Math.floor(tileTopRightX / this.startChunk.columns), Math.floor(tileTopRightY / this.startChunk.rows));
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
      rows: Config.ChunkSize.height,
      columns: Config.ChunkSize.width
    });
    newChunk.removeComponent(PointerComponent);
    this.chunkMap.set(coord, newChunk);

    this.scene.add(newChunk);
    for (let i = 0; i < newChunk.tiles.length; i++) {
      const tile = newChunk.tiles[i];
      if (tile.y === 0 && chunkY === 0) {
        tile.data.set('dug', true);
        tile.addGraphic(this.grass);
      } else {
        tile.addGraphic(this.dirtFront);
        tile.solid = true;

        this.generateCollectables(tile.x + chunkX * this.startChunk.columns, tile.y + chunkY * this.startChunk.rows);
        this.generateEnemy(tile.x + chunkX * this.startChunk.columns, tile.y + chunkY * this.startChunk.rows, this.player);
      }
    }

    this.scene.add(new Chest(10 + chunkX * this.startChunk.columns, 0, this));
    this.scene.add(new Chest(10+25 + chunkX * this.startChunk.columns, 0, this));
    this.scene.add(new Chest(10+50 + chunkX * this.startChunk.columns, 0, this));
    this.scene.add(new Chest(10+75 + chunkX * this.startChunk.columns, 0, this));
  }

  generate(player: Player) {
    this.player = player;
    this.scene.add(this.startChunk);
    for (let i = 0; i < this.startChunk.tiles.length; i++) {
      const tile = this.startChunk.tiles[i];
      if (tile.y === 0) {
        tile.data.set('dug', true);
        tile.addGraphic(this.grass);
      } else {
        tile.addGraphic(this.dirtFront);
        tile.solid = true;

        this.generateCollectables(tile.x, tile.y);
        this.generateEnemy(tile.x, tile.y, player);
      }
    }

    this.scene.add(new Collectable(10, 3, 'gold', this));
    this.scene.add(new Collectable(2, 3, 'silver', this));

    this.scene.add(new Chest(10, 0, this));

    this.scene.add(new Chest(10+25, 0, this));
    this.scene.add(new Chest(10+50, 0, this));
    this.scene.add(new Chest(10+75, 0, this));
  }

  generateEnemy(x: number, y: number, player: Player) {

    const tile = this.getTile(x, y);
    if (tile?.data.get('enemy')) return;

    const ran = this.random.next();
    const depthBonus = (y > 10) ? (y / this.worldHeight) / 100 : 0;

    for (let enemyType in Config.EnemyPercent) {
      if (enemyType in Config.EnemyPercent) {
        if ((1.0 - (Config.EnemyPercent as any)[enemyType as string] - depthBonus) < ran) {
          const enemy = new Enemy(this.scene, x, y, enemyType as any, player, this, this.random);
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
      return currentChunk.getTile(newX % Config.ChunkSize.width, newY % Config.ChunkSize.height);
    }
    return;
  }
}
