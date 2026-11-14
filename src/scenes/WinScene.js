import Phaser from "phaser";
import Starfield from "../objects/Starfield.js";

export default class WinScene extends Phaser.Scene {
    constructor() {
        super("WinScene");
    }

    preload() {
        this.load.audio("winningMusic", "/assets/win.mp3");
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

        // Start winning music
        this.winningMusic = this.sound.add("winningMusic", {
            loop: true,
            volume: 0.3,
        });

        this.winningMusic.play();

        // Success title
        this.add
            .text(width / 2, height / 2 - 60, "MISSION SUCCESSFUL!", {
                fontSize: "36px",
                color: "#00ff99",
                fontStyle: "bold",
                align: "center",
            })
            .setOrigin(0.5);

        // Success message
        this.add
            .text(
                width / 2,
                height / 2 + 10,
                "You have successfully returned home\nand saved the emails!",
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
            .text(width / 2, height / 2 + 110, "Thank you for playing!", {
                fontSize: "18px",
                color: "#aaaaaa",
                align: "center",
            })
            .setOrigin(0.5);
    }
}
