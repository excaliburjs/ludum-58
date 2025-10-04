import { Random, Scene, Sprite, TileMap, vec } from "excalibur";
import { Resources } from "./resources";
import { Collectable } from "./collectable";

import Config from './config';


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

  constructor(private scene: Scene, private random: Random) {
    this.dirtFront = Resources.Dirt.toSprite();
    this.startChunk.pointer.useColliderShape = false;
    this.startChunk.pointer.useGraphicsBounds = false;
  }

  generate() {
    this.scene.add(this.startChunk);
    for (let i = 0; i < this.startChunk.tiles.length; i++) {
      const tile = this.startChunk.tiles[i];
      if (tile.y === 0) {

      } else {
        tile.addGraphic(this.dirtFront);
        tile.solid = true;

        this.generateCollectables(tile.x, tile.y);
      }
    }

    this.scene.add(new Collectable(10, 3, 'gold', this));
  }

  generateCollectables(x: number, y: number) {
    const ran = this.random.next();
    const depthBonus = (y > 10) ? (y  / this.worldHeight) : 0;

    for (let loot in Config.LootPercent) {
      if (loot in Config.LootPercent) {
        if ((1.0 - (Config.LootPercent as any)[loot as string]) < Math.max(ran, depthBonus)) {
            this.scene.add(new Collectable(x, y, loot as any, this));
        }
      }
    }
  }

  getTile(x: number, y: number) {
    // TODO handle generated chunks
    return this.startChunk.getTile(x, y);
  }
}
