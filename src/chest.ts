import { Actor, PointerComponent, vec } from "excalibur";
import { GroundGenerator } from "./ground";
import { Resources } from "./resources";


export class Chest extends Actor {
  chest: import("/home/erik/projects/ludum-58/vendor/excalibur/build/dist/index").Sprite;
  constructor(x: number, y: number, ground: GroundGenerator){

    const worldPosFromTile = ground.getTile(x, y)?.pos ?? vec(0, 0);
    super({
      name: 'Chest',
      pos: worldPosFromTile,
      width: 64,
      height: 64,
      z: 10,
      anchor: vec(0, 0),
    });
    this.removeComponent(PointerComponent);


    this.chest = Resources.ChestImage.toSprite();
    this.graphics.use(this.chest);
    const tile = ground.getTile(x, y);
    tile?.data.set('chest', this);
  }

}
