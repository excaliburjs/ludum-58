import { Actor, Color, CoordPlane, EasingFunctions, Engine, Label, PointerComponent, TextAlign, vec } from "excalibur";
import { Resources } from "./resources";



export class Toast extends Actor {
  text!: Label;
  engine!: Engine;
  complete: boolean = true;

  constructor(public message: string) {
    super({
      name: 'Toast',
      width: 600,
      height: 64,
      z: 99,
      coordPlane: CoordPlane.Screen,
      anchor: vec(.5, 0),
      color: new Color(255, 0, 0, .5)
    });
    this.removeComponent(PointerComponent);
  }

  onInitialize(engine: Engine): void {
    this.engine = engine;
    this.pos.x = this.engine.screen.contentArea.left - this.engine.screen.width;
    this.pos.y = this.engine.screen.contentArea.center.y;
    this.text = new Label({
      pos: vec(20, 20),
      text: this.message,
      coordPlane: CoordPlane.Screen,
      font: Resources.Font.toFont({
        size: 20,
        color: Color.White,
        textAlign: TextAlign.Center
      })
    });
    this.addChild(this.text);
  }


  pop() {
    if (!this.complete) return;
    this.complete = false;
    this.actions
      .moveTo({
        pos: this.engine.screen.center,
        easing: EasingFunctions.EaseInOutCubic,
        duration: 500,
      })
      .delay(1000)
      .moveTo({
        pos: vec(this.engine.screen.contentArea.right + this.engine.screen.width, this.engine.screen.contentArea.center.y),
        easing: EasingFunctions.EaseInOutCubic,
        duration: 500,
      }).callMethod(() => {
        this.pos.x = this.engine.screen.contentArea.left - this.engine.screen.width;
        this.pos.y = this.engine.screen.contentArea.center.y;
        this.complete = true;
      });
  }
}
