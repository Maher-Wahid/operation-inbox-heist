import Phaser from "phaser";
import Character from "../objects/Character.js";

export default class StartScene extends Phaser.Scene {
    constructor() {
        super("StartScene");
    }

    preload() {
        // Background
        this.load.image("startBackground", "/assets/start-background.jpg");

        // Idle image
        this.load.image("characterIdle", "/assets/character/character-idle.png");

        // Walking sprite sheet
        this.load.spritesheet("characterWalk", "/assets/character/character-walk.png", {
            frameWidth: 32,
            frameHeight: 32,
        });

        // Parked spaceship
        this.load.image("spaceship", "/assets/spaceship.png");
    }

    create() {
        // Background
        const background = this.add.image(480, 270, "startBackground");

        const scale = Math.max(960 / background.width, 540 / background.height);

        background.setScale(scale);

        // Spaceship
        this.ship = this.add.image(650, 465, "spaceship");
        this.ship.setOrigin(0.5, 1);

        // Character
        this.player = new Character(this, 150, 465);

        // Keyboard controls
        this.keys = this.input.keyboard.addKeys({
            E: Phaser.Input.Keyboard.KeyCodes.E,
        });

        // Interaction prompt
        this.prompt = this.add.text(750, 330, "Press E to enter spaceship", {
            fontSize: "18px",
            color: "#ffffff",
            backgroundColor: "#172554",
            padding: {
                x: 12,
                y: 10,
            },
        });

        this.prompt.setOrigin(0.5);
        this.prompt.setVisible(false);

        this.entering = false;
    }

    update(time, delta) {
        if (this.entering) return;

        // Update character movement
        this.player.update(time, delta);

        // Check if character is close to spaceship
        const nearShip = Math.abs(this.player.x - this.ship.x) < 150;

        this.prompt.setVisible(nearShip);

        // Enter spaceship
        if (nearShip && Phaser.Input.Keyboard.JustDown(this.keys.E)) {
            this.entering = true;

            this.prompt.setVisible(false);

            // Character disappears
            this.player.setVisible(false);

            // Go to spaceship travel scene
            this.scene.start("TravelScene");
        }
    }
}
