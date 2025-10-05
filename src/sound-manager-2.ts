
import { SoundManager } from "excalibur";
import { Resources } from "./resources";

export const soundManager = new SoundManager({
  channels: ['fx', 'music', 'background'],
  sounds: {
    music1: { sound: Resources.Music1, volume: 0.5, channels: ['music'] },
    music2: { sound: Resources.Music2, volume: 0.5, channels: ['music'] },
    indDrums: { sound: Resources.MusicIndDrums, volume: 0.5, channels: ['music'] },
    indTopper: { sound: Resources.MusicIndTopper, volume: 0.5, channels: ['music'] },
    groovyDrums: { sound: Resources.MusicGroovyDrums, volume: 0.5, channels: ['music'] },
    groovyTopper: { sound: Resources.MusicGroovyTopper, volume: 0.5, channels: ['music'] },

    getCommon: { sound: Resources.GetCommon, volume: 1.0, channels: ['fx']},
    getUncommon: { sound: Resources.GetUncommon, volume: 1.0, channels: ['fx']},
    getRare: { sound: Resources.GetRare, volume: 1.0, channels: ['fx']},
    getVeryRare: { sound: Resources.GetVeryRare, volume: 1.0, channels: ['fx']},
    getLegendary: { sound: Resources.GetLegendary, volume: 1.0, channels: ['fx']},

    bagFull: {sound: Resources.BagFull, volume: 1.0, channels: ['fx']},
    playerDig: {sound: Resources.PlayerDig, volume: 1.0, channels: ['fx']},
    playerHurt: {sound: Resources.PlayerHurt, volume: 1.0, channels: ['fx']},
    playerStep: {sound: Resources.PlayerStep, volume: 1.0, channels: ['fx']},

    beetleBite: {sound: Resources.BeetleBite, volume: 1.0, channels: ['fx']},
    beetleHurt: {sound: Resources.BeetleHurt, volume: 1.0, channels: ['fx']},
    beetleMove: {sound: Resources.BeetleMove, volume: .05, channels: ['fx']},
  }
});
