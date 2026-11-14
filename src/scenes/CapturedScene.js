import Phaser from "phaser";
import Starfield from "../objects/Starfield.js";

export default class CapturedScene extends Phaser.Scene {
    constructor() {
        super("CapturedScene");
    }

    preload() {
        this.load.audio("capturedMusic", "/assets/captured.mp3");
    }

    create() {
        const { width, height } = this.cameras.main;

        // Background
        this.cameras.main.setBackgroundColor("#101827");

        const starfield = new Starfield(this);
        starfield.create();

        // Stop enemy music
        const enemyMusic = this.sound.get("enemyMode");

        if (enemyMusic && enemyMusic.isPlaying) {
            enemyMusic.stop();
        }

        // Play captured music only once
        this.capturedMusic = this.sound.add("capturedMusic", {
            loop: false,
            volume: 0.3,
        });

        this.capturedMusic.play();

        // Failure title
        this.add
            .text(width / 2, height / 2 - 60, "MISSION FAILED!", {
                fontSize: "36px",
                color: "#ff3333",
                fontStyle: "bold",
                align: "center",
            })
            .setOrigin(0.5);

        // Failure message
        this.add
            .text(
                width / 2,
                height / 2 + 10,
                "You didn't make it home...\nThe aliens caught you!\nThe emails are lost forever.",
                {
                    fontSize: "24px",
                    color: "#ffffff",
                    align: "center",
                    lineSpacing: 12,
                },
            )
            .setOrigin(0.5);

        // End message
        this.add
            .text(width / 2, height / 2 + 130, "GAME OVER - Thanks for playing!", {
                fontSize: "18px",
                color: "#aaaaaa",
                align: "center",
            })
            .setOrigin(0.5);
    }
}
