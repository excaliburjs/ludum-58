import { Actor, CoordPlane, Engine, PointerComponent, Sprite, vec } from "excalibur";
import { Resources } from "./resources";


export class Health extends Actor {

  heartSprite: Sprite;
  public health = 3;
  uiBox: Sprite;
  constructor() {
    super({
      pos: vec(0, 0),
      coordPlane: CoordPlane.Screen,
      scale: vec(1, 1),
      z: 12,
    });

    this.uiBox = Resources.UIBox.toSprite();
    this.heartSprite = Resources.Heart.toSprite();
    this.removeComponent(PointerComponent);
  }

  onInitialize(engine: Engine): void {
    this.graphics.onPostDraw = ctx => {
      const topLeft = engine.screen.getScreenBounds().topLeft;
      this.uiBox.draw(ctx, -32, 0);
      ctx.save();
      ctx.scale(2, 2);
      for (let i = 0; i < this.health; i++) {
        this.heartSprite.draw(ctx, i * 20 + topLeft.x + 10, topLeft.y + 10);
      }
      ctx.restore();
    };
  }
}
