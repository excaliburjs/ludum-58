import { Actor, Animation, AnimationStrategy, EasingFunctions, Engine, PointerComponent, Random, RotationType, vec, Vector } from "excalibur";
import { GroundGenerator } from "./ground";
import { Resources } from "./resources";
import { Player } from "./player";
import { soundManager } from "./sound-manager-2";
import { DigLevel } from "./level";

export type EnemyType = 'beetle' | 'worm';

const dirs = [Vector.Left, Vector.Right, Vector.Up, Vector.Down];
export class Enemy extends Actor {

  dir: Vector = Vector.Right;
  moving: boolean = false;
  beetleAnim: Animation;
  attacking: boolean = false;
  constructor(
    public level: DigLevel,
    public tileX: number,
    public tileY: number,
    public type: EnemyType,
    public player: Player,
    public ground: GroundGenerator,
    private random: Random) {

    const worldPosFromTile = ground.getTile(tileX, tileY)?.pos ?? vec(0, 0);

    super({
      name: `Enemey[${type}]`,
      pos: worldPosFromTile.add(vec(32, 32)),
      width: 64,
      height: 64,
      z: 10,
    });

    this.beetleAnim = new Animation({
      frames: [
        { graphic: Resources.BeetleImage1.toSprite() },
        { graphic: Resources.BeetleImage2.toSprite() }
      ],
      frameDuration: 150,
      strategy: AnimationStrategy.Loop
    });

    this.graphics.use(this.beetleAnim);
    this.removeComponent(PointerComponent);
  }

  onInitialize(engine: Engine): void {
    this.addTag('ex.offscreen'); // Hack to keep all the bugs from suddenly playing move sounds
  }

  onPostUpdate(engine: Engine, elapsed: number): void {
    if (this.level.gameover) return;
    if (this.isOffScreen) return;
    if (!this.moving) {
      const dist = this.player.pos.sub(this.pos);
      if (dist.magnitude < 400 && this.random.bool()) {
        const playerDir = this.player.pos.sub(this.pos).normalize();
        let minDot = -999;
        let minDir = dirs[0];
        for (let dir of dirs) {
          const dot = playerDir.dot(dir);
          if (dot > minDot) {
            minDot = dot
            minDir = dir;
          }
        }
        this.moveInDirection(minDir);
      }
      const newDir = this.random.pickOne(dirs);
      this.moveInDirection(newDir);
    }

    if (this.tileX === this.player.tileX && this.tileY === this.player.tileY) {

      if (!this.attacking) {
        this.attacking = true;

        this.player.dropPendingLoot();
        this.player.takeDamage();

        soundManager.play('beetleBite').then(() => this.attacking = false);
      }
    }
  }

  moveInDirection(direction: Vector) {
    const newTileCoord = direction.add(vec(this.tileX, this.tileY));
    const futureTile = this.ground.getTile(newTileCoord.x, newTileCoord.y);

    // If the tile is off grid don't move
    if (futureTile) {
      if (!this.moving) {
        this.moving = true;
      } else {
        return;
      }
      const currentTile = this.ground.getTile(this.tileX, this.tileY);
      if (currentTile) {
        currentTile.data.delete('enemy');
      }
      // Resources.DigSound.play();
      // this.grid.digTile(futureTile.x, futureTile.y);
      // Tile x,y are the tile coordinates
      this.tileX = newTileCoord.x;
      this.tileY = newTileCoord.y;

      if (!this.isOffScreen) {
        soundManager.play('beetleMove');
      }
      this.actions
        .rotateTo(
          Math.atan2(direction.y, direction.x) + Math.PI,
          Math.PI * 4,
          RotationType.ShortestPath)
        .easeTo(
          // Tile pos is the world pixel position of the tile
          futureTile.pos.add(vec(32, 32)),
          250,
          EasingFunctions.EaseInOutCubic
        ).delay(500).callMethod(() => {
          this.moving = false;
          const tile = this.ground.getTile(this.tileX, this.tileY);
          tile?.data.set('enemy', this);
        });
    }
  }
}
