# Gem Jam - Ludum 58

## Concept

* You are a miner digging down an infinitely generated ground for gems, jewels, gold, treasure, etc
  * Perhaps loot is generated more frequently the deeper you dig enhancing the risk/reward trade-off
  * Perhapse monsters are more dangerous the deeper you go
* You are trying to avoid various monsters, critters, etc that if they touch you you drop your collection
  * You can take x many hits before you die
  * Think sonic with flashing invincibility frames
* Your loot is only safe when you reach the surface (or maybe other checkpoints)
* Risk is noise you make (treasure, quickness, etc)
  * Curse of avarice (more treasure the slower you go)

## Todos

* [x] Implement sound playing
* [x] Implement collectables
* [x] Implement return collectables to surface
* [x] Add Number GO UP UI
* [x] Gem Capacity forcing you to return quickly
* [x] Dug dirt is faster to traverse than undug dirt
* [ ] Gems scatter around you when hit
* [ ] Add Enemies that increase in frequences
* [ ] Add 5 layers of dirt (with corresponding)
* [ ] Add Proc Gen chunks
* [ ] Add fighting certain enemies
* [ ] Surface music
* [x] Add touch controls

* Art: Gems, Treasures, etc
* Art: Miner (Dwarf, Gnome, Multiple)
* Art: Dirt Variety
* Art: Shack or Treasure Chest
* Art: Enemies (Bug, Mole, Snake, Beetle, Worm, Balrog/Demon/Satan)

### Stretch Goals
* Rewards for collecting: 
  - Upgrade you speed, 
  - pick, 
  - mining, 
  - capacity, 
  - defense,
  - warp to the top beacon

```sh
npm create excalibur
```

## Getting Started

1. [Generate a repository](https://github.com/excaliburjs/template-ts-vite/generate) from this template
2. Modify the `package.json` with your own details
3. Run `npm install` to install dependencies
4. Run `npm run dev` to start the Vite server!
5. Have fun!
