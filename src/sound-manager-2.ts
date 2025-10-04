
import { SoundManager } from "excalibur";
import { Resources } from "./resources";

export const soundManager = new SoundManager({
  channels: ['fx', 'music', 'background'],
  sounds: {
    music1: { sound: Resources.Music1, volume: 0.5, channels: ['music'] },
    music2: { sound: Resources.Music2, volume: 0.5, channels: ['music'] },

    getCommon: { sound: Resources.GetCommon, volume: 1.0, channels: ['fx']},
    getUncommon: { sound: Resources.GetUncommon, volume: 1.0, channels: ['fx']},
    getRare: { sound: Resources.GetRare, volume: 1.0, channels: ['fx']},
    getVeryRare: { sound: Resources.GetVeryRare, volume: 1.0, channels: ['fx']},
    getLegendary: { sound: Resources.GetLegendary, volume: 1.0, channels: ['fx']},
  }
});
