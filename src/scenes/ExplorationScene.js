import Phaser from "phaser";

export default class ExplorationScene extends Phaser.Scene {
    constructor() {
        super("ExplorationScene");
    }

    create() {
        this.cameras.main.setBackgroundColor("#101827");

        this.add
            .text(480, 240, "WELCOME TO THE SPACESHIP", {
                fontSize: "30px",
                color: "#ffffff",
                fontStyle: "bold",
            })
            .setOrigin(0.5);

        this.add
            .text(480, 290, "Exploration stage coming soon...", {
                fontSize: "18px",
                color: "#94a3b8",
            })
            .setOrigin(0.5);
    }
}
