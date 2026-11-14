import Phaser from "phaser";

export default class StartScene extends Phaser.Scene {
    constructor() {
        super("StartScene");
    }

    preload() {
        // Background
        this.load.image("startBackground", "/assets/start-background.jpg");

        // Idle image (single frame)
        this.load.image("owlIdle", "/assets/character/character-idle.png");

        // Walking sprite sheet (6 frames)
        this.load.spritesheet("owlWalk", "/assets/character/character-walk.png", {
            frameWidth: 32,
            frameHeight: 32,
        });

        // Parked spaceship
        this.load.image("spaceship", "/assets/spaceship.png");
    }

    create() {
        // Background
        const background = this.add.image(480, 270, "startBackground");

        // Fit background to canvas while preserving aspect ratio
        const scale = Math.max(960 / background.width, 540 / background.height);

        background.setScale(scale);

        this.anims.create({
            key: "owlWalking",
            frames: this.anims.generateFrameNumbers("owlWalk", {
                start: 0,
                end: 5,
            }),
            frameRate: 8,
            repeat: -1,
        });

        // Spaceship
        this.ship = this.add.image(650, 465, "spaceship");

        this.ship.setOrigin(0.5, 1);

        // Owl character
        this.player = this.add.sprite(150, 465, "owlWalk", 0);

        this.player.setOrigin(0.5, 1.2);
        this.player.setScale(2.5);

        // Keyboard controls
        this.cursors = this.input.keyboard.createCursorKeys();

        this.keys = this.input.keyboard.addKeys({
            A: Phaser.Input.Keyboard.KeyCodes.A,
            D: Phaser.Input.Keyboard.KeyCodes.D,
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

        this.speed = 200;
        this.entering = false;
    }

    update(time, delta) {
        if (this.entering) return;

        let movement = 0;

        if (this.cursors.left.isDown || this.keys.A.isDown) {
            movement = -1;
        }

        if (this.cursors.right.isDown || this.keys.D.isDown) {
            movement = 1;
        }

        // Move owl
        this.player.x += (movement * this.speed * delta) / 1000;

        // Screen boundaries
        this.player.x = Phaser.Math.Clamp(this.player.x, 30, 930);

        // Animate owl
        if (movement !== 0) {
            // Face the direction of movement
            this.player.setFlipX(movement < 0);

            // Play walking animation
            this.player.anims.play("owlWalking", true);
        } else {
            // Stop walking animation
            this.player.anims.stop();

            // Show idle image instead
            this.player.setTexture("owlIdle");

            this.player.setFrame(0);
        }

        // Check if owl is close to spaceship
        const nearShip = Math.abs(this.player.x - this.ship.x) < 150;

        this.prompt.setVisible(nearShip);

        // Enter spaceship
        if (nearShip && Phaser.Input.Keyboard.JustDown(this.keys.E)) {
            this.entering = true;

            this.prompt.setVisible(false);

            // Owl disappears
            this.player.setVisible(false);

            // Go to spaceship travel scene
            this.scene.start("TravelScene");
        }
    }
}
