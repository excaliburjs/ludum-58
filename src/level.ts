import { CoordPlane, DefaultLoader, Engine, ExcaliburGraphicsContext, Font, Label, Random, Scene, SceneActivationContext, TextAlign, vec } from "excalibur";
import { Player } from "./player";
import { GroundGenerator } from "./ground";
import { soundManager } from "./sound-manager-2";
import { Enemy } from "./enemy";

export class DigLevel extends Scene {
  public random = new Random(1337);
  public label!: Label;
  public player!: Player;
  public gembagLabel!: Label;
  override onInitialize(engine: Engine): void {

    const groundGenerator = new GroundGenerator(this, this.random);

    const player = new Player(5, 0, groundGenerator, this.random);
    this.player = player;
    this.add(player); 


    groundGenerator.generate(player);

    const beetle = new Enemy(5, 3, 'beetle', player, groundGenerator, this.random);
    this.add(beetle);

    const beetle2 = new Enemy(6, 22, 'beetle', player, groundGenerator, this.random);
    this.add(beetle2);

    this.camera.pos = engine.screen.center;
    this.camera.strategy.elasticToActor(player, .5, .5);

    soundManager.play("music1");

    this.label = new Label({
      pos: vec(engine.screen.getScreenBounds().width - 20, 20),
      text: 'Score: 0',
      coordPlane: CoordPlane.Screen,
      font: new Font({
        textAlign: TextAlign.Right,
        size: 30
      }),
      z: 12
    });
    this.add(this.label);



    this.gembagLabel = new Label({
      pos: vec(20, 20),
      text: `Gem Bag: 0/${player.capacity}`,
      coordPlane: CoordPlane.Screen,
      font: new Font({
        textAlign: TextAlign.Left,
        size: 30
      }),
      z: 12
    });
    this.add(this.gembagLabel);
  }

  override onPreLoad(loader: DefaultLoader): void {
    // Add any scene specific resources to load
  }

  override onActivate(context: SceneActivationContext<unknown>): void {
    // Called when Excalibur transitions to this scene
    // Only 1 scene is active at a time
  }

  override onDeactivate(context: SceneActivationContext): void {
    // Called when Excalibur transitions away from this scene
    // Only 1 scene is active at a time
  }

  override onPreUpdate(engine: Engine, elapsedMs: number): void {
    // Called before anything updates in the scene
  }

  override onPostUpdate(engine: Engine, elapsedMs: number): void {
    // Called after everything updates in the scene
    this.label.text = `Score ${this.player.score}`;
    this.gembagLabel.text = `Gem Bag: ${this.player.pendingLoot.length}/${this.player.capacity}`;
  }

  override onPreDraw(ctx: ExcaliburGraphicsContext, elapsedMs: number): void {
    // Called before Excalibur draws to the screen
  }

  override onPostDraw(ctx: ExcaliburGraphicsContext, elapsedMs: number): void {
    // Called after Excalibur draws to the screen
  }
}
