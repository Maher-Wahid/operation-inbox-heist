import Phaser from "phaser";
import Starfield from "../objects/Starfield.js";

export default class TravelScene extends Phaser.Scene {
    constructor() {
        super("TravelScene");
    }

    preload() {
        this.load.spritesheet("shipThrust", "/assets/spaceship-animation.png", {
            frameWidth: 329,
            frameHeight: 160,
        });
    }

    create() {
        this.cameras.main.setBackgroundColor("#000000");

        const starfield = new Starfield(this);
        starfield.create();

        // Create thrust animation
        this.anims.create({
            key: "thrust",
            frames: this.anims.generateFrameNumbers("shipThrust", {
                start: 0,
                end: 2,
            }),
            frameRate: 12,
            repeat: -1,
        });

        // Create spaceship
        this.ship = this.add.sprite(350, 300, "shipThrust");

        this.ship.play("thrust");

        this.time.delayedCall(1500, () => {
            // Takeoff!
            this.tweens.add({
                targets: this.ship,
                x: 1200,
                y: 100,
                duration: 2500,
                ease: "Cubic.easeIn",
                onComplete: () => {
                    this.scene.start("DialogueScene");
                },
            });
        });
    }
}
