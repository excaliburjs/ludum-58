import { Actor, Animation, AnimationStrategy, EasingFunctions, Engine, PointerComponent, Random, RotationType, vec, Vector } from "excalibur";
import { GroundGenerator } from "./ground";
import { Resources } from "./resources";
import { Player } from "./player";
import { soundManager } from "./sound-manager-2";
import { DigLevel } from "./level";

export type EnemyType = 'beetle' | 'mole' | 'worm';

const dirs = [Vector.Left, Vector.Right, Vector.Up, Vector.Down];
export class Enemy extends Actor {
  facingRight = true;
  dir: Vector = Vector.Right;
  moving: boolean = false;
  beetleAnim: Animation;
  attacking: boolean = false;
  wormAnim: Animation;
  moleAnim: Animation;
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

    this.wormAnim = new Animation({
      frames: [
        { graphic: Resources.WormImage1.toSprite() },
        { graphic: Resources.WormImage2.toSprite() }
      ],
      frameDuration: 150,
      strategy: AnimationStrategy.Loop
    });

    this.moleAnim = new Animation({
      frames: [
        { graphic: Resources.MoleImage1.toSprite() },
        { graphic: Resources.MoleImage2.toSprite() }
      ],
      frameDuration: 150,
      strategy: AnimationStrategy.Loop
    });

    this.graphics.use(this.beetleAnim);

    switch (type) {
      case 'beetle': this.graphics.use(this.beetleAnim); break;
      case 'worm': this.graphics.use(this.wormAnim); break;
      case 'mole': this.graphics.use(this.moleAnim); break;
      default:
        throw new Error("Invalid Enemy Type", type as any);
    }

    this.removeComponent(PointerComponent);
  }

  onInitialize(engine: Engine): void {
    this.addTag('ex.offscreen'); // Hack to keep all the bugs from suddenly playing move sounds
  }

  closestDirTowardsPlayer() {
    const playerDir = this.player.pos.add(vec(32, 32)).sub(this.pos).normalize();
    let minDot = -999;
    let minDir = this.random.pickOne(dirs);
    for (let dir of dirs) {
      const dot = playerDir.dot(dir);
      if (dot > minDot) {
        minDot = dot
        minDir = dir;
      }
    }
    return minDir;
  }

  pickDirectionBasedOnType(type: EnemyType) {
    const dist = this.player.pos.sub(this.pos);
    switch (type) {
      case 'beetle': {
        if (dist.magnitude < 4 * 64 && this.random.bool()) {
          return this.closestDirTowardsPlayer();
        }
        return this.random.pickOne(dirs);
      }
      case 'mole': {
        if (dist.magnitude < 3 * 64 && this.random.bool()) {
          return this.closestDirTowardsPlayer();
        }
        for (let x = 1; x < 10; x++) {
          const searchTileLeft = this.ground.getTile(this.tileX - x, this.tileY);
          const searchTileRight = this.ground.getTile(this.tileX + x, this.tileY);
          if (searchTileLeft?.data.get('dug')) {
            return Vector.Left;
          }
          if (searchTileRight?.data.get('dug')) {
            return Vector.Right;
          }
        }

        if (this.random.bool(.85)) {
          return this.random.pickOne([Vector.Up, Vector.Down])
        } else {
          return this.random.pickOne([Vector.Left, Vector.Right])
        }

      }
      case 'worm': {
        const dist = this.player.pos.sub(this.pos);
        if (dist.magnitude < 7 * 64) {
          if (this.tileX === this.player.tileX) {
            if (dist.y > 0) {
              return Vector.Down;
            } else {
              return Vector.Up;
            }
          }

          if (dist.x > 0) {
            return Vector.Right;
          } else {
            return Vector.Left;
          }
        }

        if (this.random.bool(.85)) {
          return this.random.pickOne([Vector.Left, Vector.Right])
        } else {
          return this.random.pickOne([Vector.Up, Vector.Down])
        }
      }
      default: return this.random.pickOne(dirs);
    }
  }

  onPostUpdate(engine: Engine, elapsed: number): void {
    if (this.level.gameover) return;
    if (this.isOffScreen) return;
    if (!this.moving) {
      const newDir = this.pickDirectionBasedOnType(this.type);
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

  getSpeedByType(type: EnemyType) {
    switch(type) {
      case 'beetle': return 500;
      case 'worm': return 1000;
      case 'mole': return 1500;
    }
  }

  moveInDirection(direction: Vector) {
    const newTileCoord = direction.add(vec(this.tileX, this.tileY));
    const futureTile = this.ground.getTile(newTileCoord.x, newTileCoord.y);
    if (futureTile?.y === 0) return;

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
      this.facingRight = direction.x > 0;

      this.beetleAnim.flipHorizontal = this.facingRight;
      this.wormAnim.flipHorizontal = this.facingRight;
      this.moleAnim.flipHorizontal = this.facingRight;
      if (this.type === 'mole') {
        this.ground.buryTile(this.tileX, this.tileY);
      }

      if (!this.isOffScreen) {
        soundManager.play('beetleMove');
      }
      this.actions
        .rotateTo(
          Math.atan2(-direction.y, 0),
          Math.PI * 4,
          RotationType.ShortestPath)
        .easeTo(
          // Tile pos is the world pixel position of the tile
          futureTile.pos.add(vec(32, 32)),
          250,
          EasingFunctions.EaseInOutCubic
        ).delay(this.getSpeedByType(this.type)).callMethod(() => {
          this.moving = false;
          const tile = this.ground.getTile(this.tileX, this.tileY);
          tile?.data.set('enemy', this);
        });
    }
  }
}
