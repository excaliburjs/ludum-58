# GAME_JAM_NAME GAME_JAM_NUMBER

Replace the relevant strings in the [String Variables](/string-vars.md) file with the relevant information.

Visit https://excaliburjs.com/REPO_NAME/ to play!

### Perquisites

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
* [ ] Bag full toast
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

Updating your local copy with `git pull -r` to rebase your local commits on top of upstream, makes the `main` easy to follow and merges less difficult.

1. Clone the repo

        git clone https://github.com/excaliburjs/REPO_NAME.git

2. Navigate into the root directory `REPO_NAME` in your favorite command line tool

3. Run the install to download the tools:

        npm install

4. Build the project:

        npm run build

5. Run the game locally with parcel:

        npm start

6. Make your changes, commit directly to the 'main' branch, update your local copy with `git pull -r`, and then push to the remote repository.

#### Debugging tools

