import { Scene, Sprite, TileMap } from "excalibur";
import { Resources } from "./resources";


export class GroundGenerator {

  startChunk = new TileMap({
    tileWidth: 64,
    tileHeight: 64,
    rows: 200,
    columns: 200
  });
  chunks: TileMap[] = [];
  dirtFront: Sprite;

  constructor(private scene: Scene) {
    this.dirtFront = Resources.Dirt.toSprite();
  }

  generate() {
    this.scene.add(this.startChunk);
    for (let i = 0; i < this.startChunk.tiles.length; i++) {
      const tile = this.startChunk.tiles[i];
      tile.addGraphic(this.dirtFront);

    }
  }
}
