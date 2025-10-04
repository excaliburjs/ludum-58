import { ImageSource, Loader, Sound } from "excalibur";

// It is convenient to put your resources in one place
export const Resources = {
  // Images
  Sword: new ImageSource("./images/sword.png"), 
  Dirt: new ImageSource("./images/dirt_front.png"),

  // Sound Effects
  Projectile: new Sound('./sounds/template-sample-sound-projectile.mp3'),

  // Music
  Music1: new Sound({
    paths: ['./sounds/gem jam (cavernous demo).mp3'],
    loop: true
  }),
  Music2: new Sound({
    paths: ['./sounds/industrious demo.mp3'],
    loop: true
  })
} as const; // the 'as const' is a neat typescript trick to get strong typing on your resources. 
// So when you type Resources.Sword -> ImageSource

// We build a loader and add all of our resources to the boot loader
// You can build your own loader by extending DefaultLoader
export const loader = new Loader();
for (const res of Object.values(Resources)) {
  loader.addResource(res);
}
