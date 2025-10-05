import { Actor, CoordPlane, Engine, PointerComponent, Sprite, vec } from "excalibur";
import { Resources } from "./resources";


export class Health extends Actor {

  heartSprite: Sprite;
  public health = 3;
  constructor() {
    super({
      pos: vec(0, 0),
      coordPlane: CoordPlane.Screen,
      scale: vec(2, 2),
      z: 11,
    });

    this.heartSprite = Resources.Heart.toSprite();
    this.removeComponent(PointerComponent);
  }

  onInitialize(engine: Engine): void {
    this.graphics.onPostDraw = ctx => {

      const topLeft = engine.screen.getScreenBounds().topLeft;
      for (let i = 0; i < this.health; i++) {
        this.heartSprite.draw(ctx, i * 20 + topLeft.x + 10 , topLeft.y + 10);
      }
    };
  }
}
