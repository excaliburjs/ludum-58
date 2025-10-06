import { Actor, Color, PointerComponent, Rectangle, vec } from "excalibur";
import { GroundGenerator } from "./ground";
import Config from './config';
import { soundManager } from "./sound-manager-2";
import { Resources } from "./resources";

const Green = Resources.CommonImage.toSprite();
const Blue = Resources.UncommonImage.toSprite();
const Red = Resources.RareImage.toSprite();
const Silver = Resources.VeryRareImage.toSprite();
const Gold = Resources.LegendaryImage.toSprite();

export type CollectableType = 'green' | 'blue' | 'red' | 'silver' | 'gold'

export const getGraphicsForType = (type: CollectableType) => {
  switch (type.toLowerCase()) {
    case 'green': return Green;
    case 'blue': return Blue;
    case 'red': return Red;
    case 'silver': return Silver;
    case 'gold': return Gold;
    default:
      throw new Error("Invalide Collectable");
  }
}


export class Collectable extends Actor {
  public value: number = 1;

  constructor(tileX: number, tileY: number, public type: CollectableType, ground: GroundGenerator) {
    const worldPosFromTile = ground.getTile(tileX, tileY)?.pos ?? vec(0, 0);
    super({
      name: `Collectable[${type}]`,
      pos: worldPosFromTile.add(vec(32, 32)),
      width: 32,
      height: 32,
      z: 11,
      anchor: vec(.5, .5), // Actors default center colliders and graphics with anchor (0.5, 0.5)
    });

    this.graphics.add(getGraphicsForType(type));
    this.value = Config.LootValue[type];

    const tile = ground.getTile(tileX, tileY);
    tile?.data.set('loot', this);
    this.removeComponent(PointerComponent);
  }

  playPickup() {
    switch(this.type) {
      case 'green': soundManager.play('getCommon');break;
      case 'blue': soundManager.play('getUncommon');break;
      case 'red': soundManager.play('getRare');break;
      case 'silver': soundManager.play('getVeryRare');break;
      case 'gold': soundManager.play('getLegendary');break;
    }
  }
}
