
import { SoundManager } from "excalibur";
import { Resources } from "./resources";

export const soundManager = new SoundManager({
  channels: ['fx', 'music', 'background'],
  sounds: {
    music1: { sound: Resources.Music1, volume: 0.5, channels: ['music'] },
    music2: { sound: Resources.Music2, volume: 0.5, channels: ['music'] },
  }
});
