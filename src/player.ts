import {
  Actor,
  Collider,
  CollisionContact,
  Color,
  CoordPlane,
  coroutine,
  EasingFunctions,
  Engine,
  Keys,
  Random,
  Side,
  vec,
  Vector
} from "excalibur";
import { GroundGenerator } from "./ground";
import { Collectable } from "./collectable";

export class Player extends Actor {
  dir: ex.Vector = Vector.Right;
  moving: boolean = false;
  pendingLoot: Collectable[] = [];
  score: number = 0;
  invincible: boolean = false;
  left!: Actor;
  right!: Actor;
  up!: Actor;
  down!: Actor;
  constructor(public tileX: number, public tileY: number, public ground: GroundGenerator, private random: Random) {
    const worldPosFromTile = ground.getTile(tileX, tileY)?.pos ?? vec(0, 0);
    super({
      name: 'Player',
      pos: worldPosFromTile,
      width: 64,
      height: 64,
      color: Color.Blue,
      z: 10,
      anchor: vec(0, 0), // Actors default center colliders and graphics with anchor (0.5, 0.5)
      // collisionType: CollisionType.Active, // Collision Type Active means this participates in collisions read more https://excaliburjs.com/docs/collisiontypes
      // acc: vec(0, 400)
    });


  }

  override onInitialize(engine: Engine) {
    this.left =  new Actor({color: Color.Transparent, pos: vec(-100, 0).add(vec(32, 32)), anchor: vec(1, .5), width: engine.screen.width/2, height: engine.screen.height/2});
    this.right = new Actor({color: Color.Transparent, pos: vec(100, 0).add(vec(32, 32)), anchor: vec(0, .5), width: engine.screen.width/2, height: engine.screen.height/2});
    this.up =    new Actor({color: Color.Transparent, pos: vec(0, -100).add(vec(32, 32)), anchor: vec(.5, 1), width: engine.screen.width/2, height: engine.screen.height/2});
    this.down =  new Actor({color: Color.Transparent, pos: vec(0, 100).add(vec(32, 32)), anchor: vec(.5, 0), width: engine.screen.width/2, height: engine.screen.height/2});

    this.addChild(this.left);
    this.addChild(this.right);
    this.addChild(this.up);
    this.addChild(this.down);

    this.left.on('pointerdown',  () => this.moveInDirection(Vector.Left));
    this.right.on('pointerdown', () => this.moveInDirection(Vector.Right));
    this.up.on('pointerdown',    () => this.moveInDirection(Vector.Up));
    this.down.on('pointerdown',  () => this.moveInDirection(Vector.Down));

    engine.input.keyboard.on("hold", (evt) => {
      let dir = Vector.Down;
      switch (evt.key) {
        case Keys.A:
        case Keys.Left:
        case Keys.H:
          dir = Vector.Left;
          break;
        case Keys.D:
        case Keys.Right:
        case Keys.L:
          dir = Vector.Right;
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
  }

  scorePendingLoot() {
    let delay = 0;
    for (let loot of this.pendingLoot) {
      loot.actions
        .delay(delay += 40)
        .moveTo({
          pos: vec(this.scene!.engine.screen.getScreenBounds().width - 20, 20),
          easing: EasingFunctions.EaseInOutCubic,
          duration: 200
        }).callMethod(() => {
          this.score += loot.value;
          loot.kill();
        });
    }
  }


  takeDamage() {
    if (this.invincible) return;

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

    const slice = (2 * Math.PI) / this.pendingLoot.length;
    let dir = 0;
    for (let loot of this.pendingLoot) {
      loot.actions
        .moveTo({
          pos: vec(Math.cos(dir) * 100, Math.sin(dir) * 100),
          easing: EasingFunctions.EaseInOutCubic,
          duration: 200
        }).callMethod(() => {
          loot.kill();
        });

      dir += slice;
    }
    this.pendingLoot.length = 0;
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
      this.tileX = futureTile.x;
      this.tileY = futureTile.y;

      const maybeLoot = futureTile.data.get('loot');
      if (maybeLoot instanceof Collectable) {
        this.pendingLoot.push(maybeLoot);
        futureTile.data.delete('loot');
        const screenPos = this.scene!.engine.screen.worldToScreenCoordinates(maybeLoot.pos);
        maybeLoot.transform.coordPlane = CoordPlane.Screen;
        maybeLoot.transform.pos = screenPos;
        maybeLoot.angularVelocity = this.random.floating(-Math.PI, Math.PI);

        maybeLoot.actions.moveTo({
          pos: vec(100 + this.random.integer(-5, 5), 100 + this.random.integer(-5, 5)),
          easing: EasingFunctions.EaseInOutCubic,
          duration: 1000
        }).callMethod(() => {

          // maybeLoot.graphics.isVisible = false;
        });
      }
      this.actions
        // .rotateTo(
        // Math.atan2(direction.y, direction.x),
        // Math.PI * 4,
        // RotationType.ShortestPath)
        .easeTo(
          // Tile pos is the world pixel position of the tile
          futureTile.pos,
          500,
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
