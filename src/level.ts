import {
  AudioContextFactory,
  Color,
  CoordPlane,
  DefaultLoader,
  Engine,
  ExcaliburGraphicsContext,
  Font,
  Label,
  MotionSystem,
  Random,
  Scene,
  SceneActivationContext,
  TextAlign,
  vec
} from "excalibur";

import { Player } from "./player";
import { GroundGenerator } from "./ground";
import { Enemy } from "./enemy";
import { Health } from "./health";
import { Resources } from "./resources";
import Config from './config';
import { GameOver } from "./game-over";

export class DigLevel extends Scene {
  public gameover = false;
  public random = new Random(Config.Starting.seed);
  public label!: Label;
  public player!: Player;
  public gembagLabel!: Label;
  groundGenerator!: GroundGenerator;
  health!: Health;
  gameOverEl!: GameOver;

  triggerGameOver() {
    if (!this.gameover) {

      this.gameover = true;
      this.engine.timescale = 0;

      this.engine.clock.schedule(() => {
        this.gameOverEl.show();
        Resources.GameOver.play();
      }, 1000);

      Resources.MusicSurface.stop();
      Resources.MusicIndDrums.stop();
      Resources.MusicIndTopper.stop();
      Resources.MusicGroovyDrums.stop();
      Resources.MusicGroovyTopper.stop();

    }
  }

  restart() {
    this.clear(false);
    this.camera.clearAllStrategies();

    this.gameover = false;
    this.gameOverEl.hide();


    this.onInitialize(this.engine);

    this.engine.timescale = 1;
    // Re-gen tiles
  }

  override onInitialize(engine: Engine): void {

    const gameOverEl = document.getElementsByTagName('game-over')[0]! as GameOver;
    gameOverEl.level = this;
    this.gameOverEl = gameOverEl;
    // perf hacks
    // const pointerSystem = this.world.systemManager.get(PointerSystem);
    // this.world.systemManager.removeSystem(pointerSystem!);
    MotionSystem.prototype.captureOldTransformWithChildren = () => { }; // perf hack

    const groundGenerator = new GroundGenerator(this, this.random);
    this.groundGenerator = groundGenerator;

    const player = new Player(this, Config.Starting.tileX, Config.Starting.tileY, groundGenerator, this.random);
    this.player = player;
    this.add(player);

    const health = new Health();
    this.health = health;
    this.add(health);

    groundGenerator.generate(player);
    // groundGenerator.generateChunk(-1, 0);

    const beetle = new Enemy(this, 5, 3, 'beetle', player, groundGenerator, this.random);
    this.add(beetle);

    const beetle2 = new Enemy(this, 6, 22, 'beetle', player, groundGenerator, this.random);
    this.add(beetle2);

    this.camera.pos = engine.screen.center;
    this.camera.strategy.elasticToActor(player, .5, .5);

    const time = AudioContextFactory.currentTime() + .5;

    Resources.MusicSurface.play(.5, time);
    Resources.MusicIndDrums.play(0, time);
    Resources.MusicIndTopper.play(0, time);
    Resources.MusicGroovyDrums.play(0, time);
    Resources.MusicGroovyTopper.play(0, time);


    this.label = new Label({
      pos: vec(engine.screen.contentArea.width - 20, 20),
      text: 'Score: 0',
      coordPlane: CoordPlane.Screen,
      font: Resources.Font.toFont({
        textAlign: TextAlign.Right,
        color: Color.White,
        size: 20
      }),
      z: 12
    });
    this.add(this.label);


    this.gembagLabel = new Label({
      pos: vec(20, 50),
      text: `Gem Bag 0/${player.capacity}`,
      coordPlane: CoordPlane.Screen,
      font: Resources.Font.toFont({
        textAlign: TextAlign.Left,
        color: Color.White,
        size: 20
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

    const worldLayer = (Config.WorldHeight / 5) / 4;

    switch (true) {
      case (this.player.tileY < 1): {
        const volume = Math.max((this.player.tileY % 1) / 1, 0);
        Resources.MusicSurface.volume = .5 * (1.0 - volume);
        Resources.MusicIndDrums.volume = .5 * volume;
        Resources.MusicIndTopper.volume = 0;
        break;
      }
      case (this.player.tileY < worldLayer): {
        const volume = Math.max((this.player.tileY % worldLayer) / worldLayer, 0);
        Resources.MusicIndDrums.volume = .5;
        Resources.MusicSurface.volume = 0;
        Resources.MusicIndTopper.volume = .5 * volume; // Fade in
        break;
      }
      case (this.player.tileY < worldLayer * 2): {
        const volume = Math.max(((this.player.tileY - worldLayer) % worldLayer) / worldLayer, 0);
        Resources.MusicIndTopper.volume = .5 * (1.0 - volume); // Fade out
        Resources.MusicGroovyTopper.volume = 0;
        break;
      }

      case (this.player.tileY < worldLayer * 3): {
        const volume = Math.max(((this.player.tileY - worldLayer * 2) % worldLayer) / worldLayer, 0);
        Resources.MusicIndTopper.volume = 0;
        Resources.MusicGroovyTopper.volume = .5 * volume; // Fade in
        break;
      }

      case (this.player.tileY < worldLayer * 4): {
        const volume = Math.max(((this.player.tileY - worldLayer * 3) % worldLayer) / worldLayer, 0);
        Resources.MusicIndDrums.volume = .5 * (1.0 - volume); // Fade out
        Resources.MusicGroovyDrums.volume = 0;
        break;
      }

      case (this.player.tileY < worldLayer * 5): {
        const volume = Math.max(((this.player.tileY - worldLayer * 4) % worldLayer) / worldLayer, 0);
        Resources.MusicIndDrums.volume = 0;
        Resources.MusicGroovyDrums.volume = .5 * volume; // Fade in
        break;
      }
    }

    this.groundGenerator.shouldGenerate();
  }

  override onPreDraw(ctx: ExcaliburGraphicsContext, elapsedMs: number): void {
    // Called before Excalibur draws to the screen
  }

  override onPostDraw(ctx: ExcaliburGraphicsContext, elapsedMs: number): void {
    // Called after Excalibur draws to the screen
  }
}
