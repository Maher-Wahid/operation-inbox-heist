import Phaser from "phaser";

export default class Character extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, "characterWalk", 0);

        scene.add.existing(this);

        this.scene = scene;

        this.setOrigin(0.5, 1.2);
        this.setScale(2.5);

        this.speed = 200;

        // Keyboard controls
        this.cursors = scene.input.keyboard.createCursorKeys();

        this.keys = scene.input.keyboard.addKeys({
            A: Phaser.Input.Keyboard.KeyCodes.A,
            D: Phaser.Input.Keyboard.KeyCodes.D,
        });

        // Sounds
        this.walkSound = scene.sound.add("walk", {
            volume: 0.3,
            loop: true,
        });

        this.throwSound = scene.sound.add("throw", {
            volume: 0.5,
        });

        // Walking animation
        if (!scene.anims.exists("characterWalking")) {
            scene.anims.create({
                key: "characterWalking",
                frames: scene.anims.generateFrameNumbers("characterWalk", {
                    start: 0,
                    end: 5,
                }),
                frameRate: 8,
                repeat: -1,
            });
        }
    }

    update(time, delta) {
        let movement = 0;

        // Movement controls
        if (this.cursors.left.isDown || this.keys.A.isDown) {
            movement = -1;
        }

        if (this.cursors.right.isDown || this.keys.D.isDown) {
            movement = 1;
        }

        // Move character
        this.x += (movement * this.speed * delta) / 1000;

        // Screen boundaries
        this.x = Phaser.Math.Clamp(this.x, 30, 930);

        // Don't override throwing animation
        if (this.anims.currentAnim?.key === "characterThrowing" && this.anims.isPlaying) {
            this.walkSound.stop();
            return;
        }

        // Walking animation and sound
        if (movement !== 0) {
            this.setFlipX(movement < 0);
            this.anims.play("characterWalking", true);

            if (!this.walkSound.isPlaying) {
                this.walkSound.play();
            }
        } else {
            this.anims.stop();
            this.setTexture("characterIdle");
            this.setFrame(0);

            this.walkSound.stop();
        }
    }

    // Play throwing sound
    playThrowSound() {
        this.walkSound.stop();
        this.throwSound.play();
    }

    destroy(fromScene) {
        this.walkSound.stop();
        this.throwSound.stop();

        this.walkSound.destroy();
        this.throwSound.destroy();

        super.destroy(fromScene);
    }
}
