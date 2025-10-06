import { ImageSource, Loader, Sound, SpriteSheet } from "excalibur";

// It is convenient to put your resources in one place
export const Resources = {
  // Images
  Sword: new ImageSource("./images/sword.png"),
  Dirt: new ImageSource("./images/dirt_front.png"),
  BackgroundDirt: new ImageSource("./images/dirt_back.png"),

  BeetleImage: new ImageSource("./images/beetle.png"),
  BeetleImage1: new ImageSource('./images/beetle1.png'),
  BeetleImage2: new ImageSource('./images/beetle2.png'),
  WormImage1: new ImageSource('./images/sandworm1.png'),
  WormImage2: new ImageSource('./images/sandworm2.png'),
  MoleImage1: new ImageSource('./images/mole1.png'),
  MoleImage2: new ImageSource('./images/mole2.png'),


  CommonImage: new ImageSource('./images/emerald.png'),
  UncommonImage: new ImageSource('./images/diamond.png'),
  RareImage: new ImageSource('./images/ruby.png'),
  VeryRareImage: new ImageSource('./images/silver.png'),
  LegendaryImage: new ImageSource('./images/gold.png'),
  Heart: new ImageSource("./images/heart.png"),

  PlayerIdle: new ImageSource("./images/dwarf_idle.png"),
  PlayerWalk1: new ImageSource("./images/dwarf_walk1.png"),
  PlayerWalk2: new ImageSource("./images/dwarf_walk2.png"),
  PlayerMine1: new ImageSource("./images/dwarf_mine1.png"),
  PlayerMine2: new ImageSource("./images/dwarf_mine2.png"),

  // Sound Effects
  Projectile: new Sound('./sounds/template-sample-sound-projectile.mp3'),
  GetCommon: new Sound('./sounds/get_common.mp3'),
  GetUncommon: new Sound('./sounds/get_uncommon.mp3'),
  GetRare: new Sound('./sounds/get_rare.mp3'),
  GetVeryRare: new Sound('./sounds/get_veryrare.mp3'),
  GetLegendary: new Sound('./sounds/get_legendary.mp3'),

  BagFull: new Sound('./sounds/bag_full.mp3'),
  PlayerDig: new Sound('./sounds/player_dig.mp3'),
  PlayerHurt: new Sound('./sounds/player_hurt.mp3'),
  PlayerStep: new Sound('./sounds/player_step.mp3'),

  BeetleBite: new Sound('./sounds/beetle_bite.mp3'),
  BeetleHurt: new Sound('./sounds/beetle_hurt.mp3'),
  BeetleMove: new Sound('./sounds/beetle_move.mp3'),

  GameOver: new Sound('./sounds/gameover.mp3'),

  // Music
  Music1: new Sound({
    paths: ['./sounds/gem jam (cavernous demo).mp3'],
    loop: true,
    volume: .5
  }),
  Music2: new Sound({
    paths: ['./sounds/industrious demo.mp3'],
    loop: true,
    volume: .5
  }),

  MusicSurface: new Sound({
    paths: ['./sounds/surface_2.1.mp3'],
    loop: true,
    volume: 1.
  }),
  MusicIndDrums: new Sound({
    paths: ['./sounds/ind_drums_2.1.mp3'],
    loop: true,
    volume: 1.
  }),
  MusicIndTopper: new Sound({
    paths: ['./sounds/ind_top_2.1.mp3'],
    loop: true,
    volume: 1.
  }),
  MusicGroovyDrums: new Sound({
    paths: ['./sounds/groovy_drums_2.1.mp3'],
    loop: true,
    volume: 1.
  }),
  MusicGroovyTopper: new Sound({
    paths: ['./sounds/groovy_top_2.1.mp3'],
    loop: true,
    volume: 1.
  }),
} as const; // the 'as const' is a neat typescript trick to get strong typing on your resources. 

export const BeetleSheet = SpriteSheet.fromImageSource({
  image: Resources.BeetleImage,
  grid: {
    spriteWidth: 64,
    spriteHeight: 64,
    rows: 1,
    columns: 3,
  },
});



// We build a loader and add all of our resources to the boot loader
// You can build your own loader by extending DefaultLoader
export const loader = new Loader();
for (const res of Object.values(Resources)) {
  loader.addResource(res);
}
