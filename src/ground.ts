import { Random, Scene, Sprite, TileMap, vec } from "excalibur";
import { Resources } from "./resources";
import { Collectable } from "./collectable";

import Config from './config';
import { Enemy } from "./enemy";
import { Player } from "./player";


export class GroundGenerator {
  worldHeight = 200;
  startChunk = new TileMap({
    pos: vec(0, 64 * 5),
    tileWidth: 64,
    tileHeight: 64,
    rows: 200,
    columns: 200
  });
  chunks: TileMap[] = [];
  dirtFront: Sprite;
  dirtBack: Sprite;

  constructor(private scene: Scene, private random: Random) {
    this.dirtFront = Resources.Dirt.toSprite();
    this.dirtBack = Resources.BackgroundDirt.toSprite();
    this.startChunk.pointer.useColliderShape = false;
    this.startChunk.pointer.useGraphicsBounds = false;
  }

  digTile(x: number, y: number): boolean {
    const tile = this.getTile(x, y);
    if (tile) {
      if (tile.data.get('dug')) {
        return false;
      }
      tile.data.set('dug', true);
      tile.clearGraphics();
      tile.addGraphic(this.dirtBack);
      return true;
    }
    return true;
  }

  generate(player: Player) {
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
    // TODO handle generated chunks
    return this.startChunk.getTile(x, y);
  }
}
