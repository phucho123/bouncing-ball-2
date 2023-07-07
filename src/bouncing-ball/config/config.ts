import Phaser from 'phaser'
import { GameOverScene } from '../scene/GameOverScene'
import { PlayScene } from '../scene/PlayScene'
import { StartScene } from '../scene/StartScene'
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constant/constant'
import { ShopScene } from '../scene/ShopScene'
import { LoadingScene } from '../scene/LoadingScene'
import { PauseScene } from '../scene/PauseScene'
import { SettingScene } from '../scene/SettingScene'

export const config = {
    type: Phaser.AUTO,
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    backgroundColor: '#ebf9fa',
    parent: 'game',
    physics: {
        default: 'matter',
        matter: {
            enableSleeping: true,
        },
    },
    scene: [
        LoadingScene,
        StartScene,
        PlayScene,
        GameOverScene,
        ShopScene,
        PauseScene,
        SettingScene,
    ],
}
