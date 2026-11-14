import Phaser from "phaser";
import "./style.css";

import StartScene from "./scenes/StartScene.js";
import TravelScene from "./scenes/TravelScene.js";
import DialogueScene from "./scenes/DialogueScene.js";
import ExplorationScene from "./scenes/ExplorationScene.js";
import WinScene from "./scenes/WinScene.js";
import EscapeScene from "./scenes/EscapeScene.js";
import CapturedScene from "./scenes/CapturedScene.js";
import WelcomeScene from "./scenes/WelcomeScreen.js";
import AlertScene from "./scenes/AlertScene.js";

const config = {
    type: Phaser.AUTO,

    width: 960,
    height: 540,

    dom: {
        createContainer: true, // Enables HTML elements
    },

    parent: "game-container",

    backgroundColor: "#050816",

    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },

    scene: [
        WelcomeScene,
        EscapeScene,
        ExplorationScene,
        StartScene,
        TravelScene,
        DialogueScene,
        WinScene,
        CapturedScene,
        AlertScene,
    ],
};

new Phaser.Game(config);
