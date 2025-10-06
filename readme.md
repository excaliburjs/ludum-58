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
* [x] Add hearts for you run
* [x] Gems scatter around you when hit
* [x] Add Proc Gen chunks
* [x] Add touch controls (Currently disabled for perf)
* [x] Add music layers implementation
* [x] Add Surface music
* [x] Vendor excalibur
* [x] Add game over screen
* [x] Add Enemies that increase in frequences
* [x] Different enemy behavior
* [x] Add silver/gold sprites
* [x] Better Font
* [x] Bag full toast
* [x] bug enemies can make it to row 0
* [ ] HUD background
* [ ] Add shop
* [ ] Fix audio buttons
* [ ] Spruce game over screen
* [ ] Add 5 layers of dirt (with corresponding)
* [ ] Add fighting certain enemies
* [ ] Add graph of treasure collected over time/events
   - Shareable on Socials
* [ ] Add high score

## Low Priority
* [ ] Add title screen
* [ ] Add value floating number
* [ ] Add toggle for input type
* [x] Add social cards
* [x] Wire up credits
* [ ] Wire up gamepad
* [ ] Bag full toast
* [ ] Add title screen
* [ ] Wire up credits/buttons

* [x] Art: Gems, Treasures, etc
* [x] Art: Miner (Dwarf, Gnome, Multiple)
* [ ] Art: Dirt Variety
* [x] Art: Shack or Treasure Chest
* [x] Art: Enemies (Bug, Mole, Snake, Beetle, Worm, Balrog/Demon/Satan)

- Moles: Fill in mine shafts, priorities empty shafts, favor vertical
- Snake/Worm: favor horizontal and veer toward you
- Beetles: 50% random, 50% towards the player
- Demon/Balrog: Easter egg? Game over screen? "You dug to greedily and too deep"

### Stretch Goals
* Rewards for collecting: 
  - Upgrade you speed, 
  - pick, 
  - mining, 
  - capacity, 
  - defense,
  - hearts
  - warp to the top beacon

```sh
npm create excalibur
```

## Getting Started

        npm install

4. Build the project:

        npm run build

5. Run the game locally with parcel:

        npm start

6. Make your changes, commit directly to the 'main' branch, update your local copy with `git pull -r`, and then push to the remote repository.

#### Debugging tools

1. [Generate a repository](https://github.com/excaliburjs/template-ts-vite/generate) from this template
2. Modify the `package.json` with your own details
3. Run `npm install` to install dependencies
4. Run `npm run dev` to start the Vite server!
5. Have fun!
