import { Scene, Sprite, TileMap, vec } from "excalibur";
import { Resources } from "./resources";


export class GroundGenerator {

  startChunk = new TileMap({
    pos: vec(0, 64 * 5),
    tileWidth: 64,
    tileHeight: 64,
    rows: 200,
    columns: 200
  });
  chunks: TileMap[] = [];
  dirtFront: Sprite;

  constructor(private scene: Scene) {
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
      }
    }
  }

  getTile(x: number, y: number) {
    // TODO handle generated chunks
    return this.startChunk.getTile(x, y);
  }
}
