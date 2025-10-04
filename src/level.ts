import { DefaultLoader, Engine, ExcaliburGraphicsContext, Random, Scene, SceneActivationContext } from "excalibur";
import { Player } from "./player";
import { GroundGenerator } from "./ground";
import { soundManager } from "./sound-manager-2";

export class DigLevel extends Scene {
  public random = new Random(1337);
  override onInitialize(engine: Engine): void {

    this.camera.pos = engine.screen.center;

    const groundGenerator = new GroundGenerator(this, this.random);
    groundGenerator.generate();
    const player = new Player(5, 0, groundGenerator, this.random);
    this.add(player); // Actors need to be added to a scene to be drawn
    this.camera.strategy.elasticToActor(player, .5, .5);

    soundManager.play("music1");

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
  }

  override onPreDraw(ctx: ExcaliburGraphicsContext, elapsedMs: number): void {
    // Called before Excalibur draws to the screen
  }

  override onPostDraw(ctx: ExcaliburGraphicsContext, elapsedMs: number): void {
    // Called after Excalibur draws to the screen
  }
}
