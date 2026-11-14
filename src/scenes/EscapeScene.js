import Phaser from "phaser";
import Character from "../objects/Character.js";

export default class EscapeScene extends Phaser.Scene {
    constructor() {
        super("EscapeScene");
    }

    preload() {
        this.load.image("spaceshipBackground", "/assets/spaceship-background.jpg");

        // Idle image
        this.load.image("characterIdle", "/assets/character/character-idle.png");

        // Walking sprite sheet
        this.load.spritesheet("characterWalk", "/assets/character/character-walk.png", {
            frameWidth: 32,
            frameHeight: 32,
        });

        // Throwing sprite sheet
        this.load.spritesheet("characterThrow", "/assets/character/character-throw.png", {
            frameWidth: 32,
            frameHeight: 32,
        });

        // Alien running images
        this.load.image("alien1", "/assets/alien/run-1.png");
        this.load.image("alien2", "/assets/alien/run-2.png");
        this.load.image("alien3", "/assets/alien/run-3.png");
        this.load.image("alien4", "/assets/alien/run-4.png");
        this.load.image("alien5", "/assets/alien/run-5.png");
        this.load.image("alien6", "/assets/alien/run-6.png");

        // Rock
        this.load.image("rock", "/assets/character/rock.png");

        // Audio
        this.load.audio("walk", "assets/walk.mp3");
        this.load.audio("throw", "assets/throw.mp3");
        this.load.audio("rockEnemy", "assets/rock-enemy.mp3");
        this.load.audio("playerEnemy", "assets/player-enemy.mp3");
    }

    create() {
        const { width, height } = this.cameras.main;

        // Audio sounds
        this.throwSound = this.sound.add("throw", { volume: 0.2 });
        this.rockEnemySound = this.sound.add("rockEnemy", { volume: 0.1 });
        this.playerEnemySound = this.sound.add("playerEnemy", { volume: 0.5 });

        // Background
        const background = this.add.image(width / 2, height / 2, "spaceshipBackground");
        background.setDisplaySize(width, height);

        // Character
        this.player = new Character(this, 330, 480);

        // F key
        this.throwKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);

        // Throwing animation
        this.anims.create({
            key: "characterThrowing",
            frames: this.anims.generateFrameNumbers("characterThrow", {
                start: 0,
                end: 3,
            }),
            frameRate: 10,
            repeat: 0,
        });

        // Store rocks
        this.rocks = [];

        // Throw cooldown
        this.throwCooldown = 1500;
        this.lastThrowTime = 0;

        // Alien animation
        this.anims.create({
            key: "alienRunning",
            frames: [
                { key: "alien1" },
                { key: "alien2" },
                { key: "alien3" },
                { key: "alien4" },
                { key: "alien5" },
                { key: "alien6" },
            ],
            frameRate: 8,
            repeat: -1,
        });

        // Store all aliens
        this.aliens = [];

        // Alien movement speed
        this.alienSpeed = 250;

        // Spawn countdown
        this.spawnTimer = 2000;

        // Defeat counter
        this.aliensDefeated = 0;

        // Win target
        this.targetAliens = 7;

        // Game over flag
        this.gameEnded = false;

        // Spawn the first alien
        this.spawnAlien();
    }

    // Create one alien
    spawnAlien() {
        const alien = this.add.sprite(this.cameras.main.width + 100, this.player.y - 80, "alien1");

        alien.setFlipX(true);
        alien.setDisplaySize(75, 147);
        alien.play("alienRunning");

        this.aliens.push(alien);
    }

    throwRock() {
        const rock = this.add.image(this.player.x, this.player.y - 40, "rock");

        this.rocks.push({
            sprite: rock,
            speed: 400,
        });
    }

    update(time, delta) {
        if (this.gameEnded) return;

        // Character movement
        this.player.update(time, delta);

        // Press F to throw
        if (
            Phaser.Input.Keyboard.JustDown(this.throwKey) &&
            time - this.lastThrowTime >= this.throwCooldown
        ) {
            this.lastThrowTime = time;

            this.player.anims.play("characterThrowing");

            // Play throwing sound
            this.throwSound.play();

            this.throwRock();
        }

        // Move rocks
        this.rocks.forEach((rock) => {
            rock.sprite.x += rock.speed * (delta / 1000);
        });

        // Remove rocks outside screen
        this.rocks = this.rocks.filter((rock) => {
            if (rock.sprite.x > this.cameras.main.width + rock.sprite.width) {
                rock.sprite.destroy();
                return false;
            }

            return true;
        });

        // Spawn a new alien every 2 seconds
        this.spawnTimer -= delta;

        if (this.spawnTimer <= 0) {
            this.spawnAlien();
            this.spawnTimer = 2000;
        }

        // Move aliens and check collisions
        for (let i = this.aliens.length - 1; i >= 0; i--) {
            const alien = this.aliens[i];

            // Move alien left
            alien.x -= this.alienSpeed * (delta / 1000);

            // Check if alien touches player
            if (
                Phaser.Geom.Intersects.RectangleToRectangle(
                    alien.getBounds(),
                    this.player.getBounds(),
                )
            ) {
                // Play player hit sound
                this.playerEnemySound.play();

                this.gameEnded = true;
                this.scene.start("CapturedScene");
                return;
            }

            // Check if rock hits alien
            const rockIndex = this.rocks.findIndex((rock) =>
                Phaser.Geom.Intersects.RectangleToRectangle(
                    rock.sprite.getBounds(),
                    alien.getBounds(),
                ),
            );

            if (rockIndex !== -1) {
                // Play rock hitting enemy sound
                this.rockEnemySound.play();

                // Destroy alien
                alien.destroy();
                this.aliens.splice(i, 1);

                // Destroy rock
                this.rocks[rockIndex].sprite.destroy();
                this.rocks.splice(rockIndex, 1);

                // Increase defeated count
                this.aliensDefeated++;

                // Check win condition
                if (this.aliensDefeated >= this.targetAliens) {
                    this.gameEnded = true;
                    this.scene.start("WinScene");
                    return;
                }

                continue;
            }

            // Remove alien if it leaves screen
            if (alien.x < -alien.width) {
                alien.destroy();
                this.aliens.splice(i, 1);
            }
        }
    }
}
