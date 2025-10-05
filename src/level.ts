import { CoordPlane, DefaultLoader, Engine, ExcaliburGraphicsContext, Font, Label, MotionSystem, PointerSystem, Random, Scene, SceneActivationContext, TextAlign, vec } from "excalibur";
import { Player } from "./player";
import { GroundGenerator } from "./ground";
import { soundManager } from "./sound-manager-2";
import { Enemy } from "./enemy";
import { Health } from "./health";

export class DigLevel extends Scene {
  public random = new Random(1337);
  public label!: Label;
  public player!: Player;
  public gembagLabel!: Label;
  groundGenerator!: GroundGenerator;
  health!: Health;

  override onInitialize(engine: Engine): void {
    // perf hacks
    const pointerSystem = this.world.systemManager.get(PointerSystem);
    this.world.systemManager.removeSystem(pointerSystem!);
    MotionSystem.prototype.captureOldTransformWithChildren = () => { }; // perf hack

    const groundGenerator = new GroundGenerator(this, this.random);
    this.groundGenerator = groundGenerator;

    const player = new Player(5, 0, groundGenerator, this.random);
    this.player = player;
    this.add(player);


    const health = new Health();
    this.health = health;
    this.add(health);


    groundGenerator.generate(player);
    // groundGenerator.generateChunk(-1, 0);

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
      pos: vec(20, 45),
      text: `Gem Bag 0/${player.capacity}`,
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
    this.health.health = this.player.health;

    this.groundGenerator.shouldGenerate();
  }

  override onPreDraw(ctx: ExcaliburGraphicsContext, elapsedMs: number): void {
    // Called before Excalibur draws to the screen
  }

  override onPostDraw(ctx: ExcaliburGraphicsContext, elapsedMs: number): void {
    // Called after Excalibur draws to the screen
  }
}
