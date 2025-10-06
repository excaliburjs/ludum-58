import { Actor, Color, CoordPlane, Engine, Label, Scene, SceneActivationContext, TextAlign, vec } from "excalibur";
import { Resources } from "./resources";


export class TitleScreen extends Scene {


  constructor() {
    super();
    this.backgroundColor = Color.Brown.darken(.5);
  }

  onInitialize(engine: Engine): void {
    const playerSprite = Resources.PlayerIdle.toSprite();
    const Green = Resources.CommonImage.toSprite();
    const Blue = Resources.UncommonImage.toSprite();
    const Red = Resources.RareImage.toSprite();
    // const Silver = Resources.VeryRareImage.toSprite();
    const Gold = Resources.LegendaryImage.toSprite();

    const label = new Label({
      text: "Gem Jam!",
      pos: vec(0, -100),
      z: 99, 
      font: Resources.Font.toFont({
        color: Color.White,
        size: 64, 
        textAlign: TextAlign.Center
      })
    });

    this.add(label);


    const label2 = new Label({
      text: "Press or Tap to Start",
      pos: vec(0, 50),
      z: 99, 
      font: Resources.Font.toFont({
        color: Color.White,
        size: 32, 
        textAlign: TextAlign.Center
      })
    });

    this.add(label2);


    const player = new Actor({
      pos: vec(0, 0),
      coordPlane: CoordPlane.World,
      scale: vec(4, 4)

    });
    player.graphics.use(playerSprite);
    player.angularVelocity = Math.PI / 4;
    this.add(player);
    
    const green = new Actor({
      pos: vec(200, 200),
      coordPlane: CoordPlane.World,
      scale: vec(4, 4)

    });
    green.graphics.use(Green);
    green.angularVelocity = -Math.PI / 4;
    this.add(green);


    const red = new Actor({
      pos: vec(200, -200),
      coordPlane: CoordPlane.World,
      scale: vec(4, 4)

    });
    red.graphics.use(Red);
    red.rotation += Math.PI / 8;
    red.angularVelocity = -Math.PI / 4;
    this.add(red);

    const blue = new Actor({
      pos: vec(-200, -200),
      coordPlane: CoordPlane.World,
      scale: vec(4, 4)

    });
    blue.graphics.use(Blue);
    blue.rotation += 2 * Math.PI / 8;
    blue.angularVelocity = -Math.PI / 4;
    this.add(blue);


    const gold = new Actor({
      pos: vec(-200, 200),
      coordPlane: CoordPlane.World,
      scale: vec(4, 4)

    });
    gold.graphics.use(Gold);
    gold.rotation += 3 * Math.PI / 8;
    gold.angularVelocity = -Math.PI / 4;
    this.add(gold);

  }

  onActivate(context: SceneActivationContext<unknown, undefined>): void {

    this.camera.pos = vec(0, 0);
    Resources.MusicTitle.play(.5);
    this.input.pointers.once('down',() => this.engine.goToScene('start'));
    this.input.keyboard.once('press', () => this.engine.goToScene('start'));
  }

  onDeactivate(context: SceneActivationContext) {
    Resources.MusicTitle.stop();
  }

}
