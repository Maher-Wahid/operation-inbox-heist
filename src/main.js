import Phaser from "phaser";
import "./style.css";

import StartScene from "./scenes/StartScene.js";
import TravelScene from "./scenes/TravelScene.js";
import DialogueScene from "./scenes/DialogueScene.js";
import ExplorationScene from "./scenes/ExplorationScene.js";

const config = {
    type: Phaser.AUTO,

    width: 960,
    height: 540,

    parent: "game-container",

    backgroundColor: "#050816",

    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },

    scene: [StartScene, TravelScene, DialogueScene, ExplorationScene],
};

new Phaser.Game(config);
