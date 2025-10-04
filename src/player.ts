import {
  Actor,
  Collider,
  CollisionContact,
  Color,
  EasingFunctions,
  Engine,
  Keys,
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
  constructor(public tileX: number, public tileY: number, public ground: GroundGenerator) {
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
          const maybeLoot = futureTile.data.get('loot');
          if (maybeLoot instanceof Collectable) {
            this.pendingLoot.push(maybeLoot);

            maybeLoot.actions.moveBy({
              offset: vec(-100, -100),
              easing: EasingFunctions.EaseInOutCubic,
              duration: 1000
            }).callMethod(() => {
              maybeLoot.graphics.isVisible = false;
            });
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
