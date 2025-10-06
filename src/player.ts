import {
  Actor,
  Animation,
  AnimationStrategy,
  Collider,
  CollisionContact,
  Color,
  CoordPlane,
  coroutine,
  EasingFunctions,
  Engine,
  Keys,
  PointerComponent,
  Random,
  Side,
  Sprite,
  Tile,
  vec,
  Vector
} from "excalibur";
import { GroundGenerator } from "./ground";
import { Collectable } from "./collectable";
import { soundManager } from "./sound-manager-2";
import Config from './config';
import { DigLevel } from "./level";
import { Resources } from "./resources";

export class Player extends Actor {
  dir: Vector = Vector.Right;
  facingRight = true;
  moving: boolean = false;
  pendingLoot: Collectable[] = [];
  health: number = Config.Starting.health;
  score: number = Config.Starting.score;
  capacity: number = Config.Starting.capacity;
  invincible: boolean = false;

  // touch sensors
  left!: Actor;
  right!: Actor;
  up!: Actor;
  down!: Actor;
  idle: Sprite;
  walk: Animation;
  mine: Animation;
  constructor(public level: DigLevel, public tileX: number, public tileY: number, public ground: GroundGenerator, private random: Random) {
    const worldPosFromTile = ground.getTile(tileX, tileY)?.pos ?? vec(0, 0);
    super({
      name: 'Player',
      pos: worldPosFromTile,
      width: 64,
      height: 64,
      color: Color.Blue,
      z: 10,
      anchor: vec(0, 0),
    });
    this.removeComponent(PointerComponent);

    this.idle = Resources.PlayerIdle.toSprite();
    this.walk = new Animation({
      frames: [
        { graphic: Resources.PlayerWalk1.toSprite() },
        { graphic: Resources.PlayerWalk2.toSprite() },
      ],
      frameDuration: 200
    });
    this.walk.strategy = AnimationStrategy.Loop;

    this.mine = new Animation({
      frames: [
        { graphic: Resources.PlayerMine1.toSprite() },
        { graphic: Resources.PlayerMine2.toSprite() },
      ],
      frameDuration: 100
    });
    this.mine.strategy = AnimationStrategy.Loop;

  }

  override onInitialize(engine: Engine) {
    this.left = new Actor({ color: Color.Transparent, pos: vec(-100, 0).add(vec(32, 32)), anchor: vec(1, .5), width: engine.screen.width / 2, height: engine.screen.height / 2 });
    this.right = new Actor({ color: Color.Transparent, pos: vec(100, 0).add(vec(32, 32)), anchor: vec(0, .5), width: engine.screen.width / 2, height: engine.screen.height / 2 });
    this.up = new Actor({ color: Color.Transparent, pos: vec(0, -100).add(vec(32, 32)), anchor: vec(.5, 1), width: engine.screen.width / 2, height: engine.screen.height / 2 });
    this.down = new Actor({ color: Color.Transparent, pos: vec(0, 100).add(vec(32, 32)), anchor: vec(.5, 0), width: engine.screen.width / 2, height: engine.screen.height / 2 });

    this.addChild(this.left);
    this.addChild(this.right);
    this.addChild(this.up);
    this.addChild(this.down);

    this.graphics.use(this.idle);

    this.left.on('pointerdown', () => this.moveInDirection(Vector.Left));
    this.left.on('pointermove', () => this.moveInDirection(Vector.Left));
    this.right.on('pointerdown', () => this.moveInDirection(Vector.Right));
    this.right.on('pointermove', () => this.moveInDirection(Vector.Right));
    this.up.on('pointerdown', () => this.moveInDirection(Vector.Up));
    this.up.on('pointermove', () => this.moveInDirection(Vector.Up));
    this.down.on('pointerdown', () => this.moveInDirection(Vector.Down));
    this.down.on('pointermove', () => this.moveInDirection(Vector.Down));

    engine.input.keyboard.on("hold", (evt) => {
      let dir = Vector.Down;
      switch (evt.key) {
        case Keys.A:
        case Keys.Left:
        case Keys.H:
          dir = Vector.Left;
          this.facingRight = false;
          break;
        case Keys.D:
        case Keys.Right:
        case Keys.L:
          dir = Vector.Right;
          this.facingRight = true;
          break;
        case Keys.S:
        case Keys.Down:
        case Keys.J:
          dir = Vector.Down;
          break;
        case Keys.W:
        case Keys.Up:
        case Keys.K:
          dir = Vector.Up;
          break;
        default:
          return;
      }
      this.dir = dir;
      this.moveInDirection(dir);
    });

    engine.input.keyboard.on("release", (evt) => {
      switch (evt.key) {
        case Keys.A:
        case Keys.Left:
        case Keys.H:
          this.facingRight = false;
          break;
        case Keys.D:
        case Keys.Right:
        case Keys.L:
          this.facingRight = true;
          break;
        case Keys.S:
        case Keys.Down:
        case Keys.J:
          break;
        case Keys.W:
        case Keys.Up:
        case Keys.K:
          break;
        default:
          return;
      }
      this.idle.flipHorizontal = this.facingRight;
      this.graphics.use(this.idle);
    });
  }

  scorePendingLoot() {
    let delay = 0;
    for (let loot of this.pendingLoot) {
      loot.actions
        .delay(delay += 70)
        .moveTo({
          pos: vec(this.level.engine.screen.contentArea.width - 64, 20 + 64),
          easing: EasingFunctions.EaseInOutCubic,
          duration: 200
        }).callMethod(() => {
          this.score += loot.value;
          soundManager.play('getCommon');
          loot.kill();
        });
    }
    this.pendingLoot.length = 0;
  }


  takeDamage() {
    if (this.level.gameover) return;
    if (this.invincible) return;

    this.health--;

    if (this.health <= 0) {
      this.level.triggerGameOver();
    }

    const me = this;
    coroutine(function*() {
      me.invincible = true;
      me.graphics.isVisible = false;
      let duration = 1000;
      let flashDuration = 200;


      while (duration > 0) {
        const elapsed = yield;
        duration -= elapsed;
        flashDuration -= elapsed;

        if (flashDuration < 0) {
          flashDuration = 200;
          me.graphics.isVisible = !me.graphics.isVisible;
        }
      }
      me.invincible = false;
      me.graphics.isVisible = true;
    });

  }

  dropPendingLoot() {
    if (this.invincible) return;
    soundManager.play('playerHurt');

    const slice = (2 * Math.PI) / this.pendingLoot.length;
    let dir = 0;
    for (let loot of this.pendingLoot) {
      loot.transform.coordPlane = CoordPlane.World;
      loot.pos = this.pos;
      const spreadDist = Config.LootSpreadDistance;
      const spreadPos = this.pos.add(vec(Math.cos(dir) * spreadDist, Math.sin(dir) * spreadDist));
      const nearestTileX = Math.floor((spreadPos.x - this.ground.worldOrigin.x) / 64);
      const nearestTileY = Math.floor((spreadPos.y - this.ground.worldOrigin.y) / 64);
      const maybeTile = this.ground.getTile(nearestTileX, nearestTileY);

      loot.actions
        .moveTo({
          pos: maybeTile ? maybeTile.pos.add(vec(32, 32)) : spreadPos,
          easing: EasingFunctions.EaseInOutCubic,
          duration: 200
        }).callMethod(() => {
          if (!maybeTile) {
            loot.kill();
          }
          if (maybeTile?.data.get('loot')) {
            loot.kill();
          } else {
            maybeTile?.data.set('loot', loot);
          }
        });

      dir += slice;
    }
    this.pendingLoot.length = 0;
  }

  maybePickupLoot(futureTile: Tile) {

    const maybeLoot = futureTile.data.get('loot');
    if (maybeLoot instanceof Collectable) {
      if (this.pendingLoot.length >= this.capacity) {
        soundManager.play('bagFull');
        this.level.bagFullToast.pop();
        return;
      }

      this.pendingLoot.push(maybeLoot);
      futureTile.data.delete('loot');
      const screenPos = this.scene!.engine.screen.worldToScreenCoordinates(futureTile.pos.add(vec(32, 32)));
      screenPos.x -= this.scene!.engine.screen.contentArea.left;
      screenPos.y -= this.scene!.engine.screen.contentArea.top;
      maybeLoot.transform.coordPlane = CoordPlane.Screen;
      maybeLoot.transform.pos = screenPos;//this.scene!.engine.screen.contentArea.center.sub(vec(2 * 64, 32));// screenPos;
      maybeLoot.angularVelocity = this.random.floating(-Math.PI, Math.PI);
      maybeLoot.playPickup();

      maybeLoot.actions.moveTo({
        pos: vec(100 + this.random.integer(-32, 32), 100 + this.random.integer(0, 64)),
        easing: EasingFunctions.EaseInOutCubic,
        duration: 1000
      }).callMethod(() => {

        // maybeLoot.graphics.isVisible = false;
      });
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
      // Resources.DigSound.play();
      // this.grid.digTile(futureTile.x, futureTile.y);
      // Tile x,y are the tile coordinates
      this.tileX = newTileCoord.x;
      this.tileY = newTileCoord.y;


      this.maybePickupLoot(futureTile);
      const isSlow = this.ground.digTile(this.tileX, this.tileY);

      if (!isSlow) {
        soundManager.play('playerStep');
        this.walk.flipHorizontal = this.facingRight;
        this.graphics.use(this.walk);
      } else {
        // TODO play mining sound
        this.mine.flipHorizontal = this.facingRight;
        this.graphics.use(this.mine);
      }
      this.actions
        // .rotateTo(
        // Math.atan2(direction.y, direction.x),
        // Math.PI * 4,
        // RotationType.ShortestPath)
        .easeTo(
          // Tile pos is the world pixel position of the tile
          futureTile.pos,
          isSlow ? 500 : 150,
          EasingFunctions.EaseInOutCubic
        ).callMethod(() => {
          this.moving = false;

          if (this.tileY === 0 && this.pendingLoot.length > 0) {
            this.scorePendingLoot();
          }
        });
    }
    // else {
    //   if (!Resources.ClankSound.isPlaying() && !this.moving) {
    //     Resources.ClankSound.play();
    //   }
    // }
  }

  override onPreUpdate(engine: Engine, elapsedMs: number): void {
    // Put any update logic here runs every frame before Actor builtins
  }

  override onPostUpdate(engine: Engine, elapsedMs: number): void {
    // Put any update logic here runs every frame after Actor builtins
  }

  override onPreCollisionResolve(self: Collider, other: Collider, side: Side, contact: CollisionContact): void {
    // Called before a collision is resolved, if you want to opt out of this specific collision call contact.cancel()
  }

  override onPostCollisionResolve(self: Collider, other: Collider, side: Side, contact: CollisionContact): void {
    // Called every time a collision is resolved and overlap is solved
  }

  override onCollisionStart(self: Collider, other: Collider, side: Side, contact: CollisionContact): void {
    // Called when a pair of objects are in contact
  }

  override onCollisionEnd(self: Collider, other: Collider, side: Side, lastContact: CollisionContact): void {
    // Called when a pair of objects separates
  }
}
