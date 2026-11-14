import Phaser from "phaser";
import Starfield from "../objects/Starfield.js";

export default class AlertScene extends Phaser.Scene {
    constructor() {
        super("AlertScene");
    }

    preload() {
        // Load typing sound
        this.load.audio("typing", "assets/typing.mp3");
        this.load.audio("enemyMode", "/assets/enemy.mp3");
    }

    create() {
        // Black background
        this.cameras.main.setBackgroundColor("#000000");

        const starfield = new Starfield(this);
        starfield.create();

        // Stop inside spaceship music
        const insideShipMusic = this.sound.get("insideShipMusic");

        if (insideShipMusic && insideShipMusic.isPlaying) {
            insideShipMusic.stop();
        }

        // Start enemy mode music
        this.enemyMusic = this.sound.add("enemyMode", {
            loop: true,
            volume: 0.1,
        });

        this.enemyMusic.play();

        // Dialogue lines
        const messages = [
            "Cosmic Explorer, you've got the Cosmic Key!",
            "Oh no! The Mailorians know you're here!",
            "They're coming! Grab your mighty rock!",
            "It's time to fight and save Earth!",
        ];

        // Dialogue text
        const dialogue = this.add.text(480, 270, "", {
            fontSize: "22px",
            color: "#ffffff",
            align: "center",
            wordWrap: {
                width: 700,
            },
        });

        dialogue.setOrigin(0.5);

        // Create looping typing sound
        const typingSound = this.sound.add("typing", {
            volume: 0.3,
            loop: true,
        });

        let currentLine = 0;
        let charIndex = 0;
        let typingEvent;

        this.waitingForFight = false;

        // F key input
        this.fightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);

        // Typewriter effect
        const typeLine = () => {
            const message = messages[currentLine];

            charIndex = 0;
            dialogue.setText("");

            typingEvent = this.time.addEvent({
                delay: 60,
                repeat: message.length - 1,
                callback: () => {
                    charIndex++;
                    dialogue.setText(message.substring(0, charIndex));

                    // Start typing sound
                    if (charIndex === 1) {
                        typingSound.play();
                    }

                    // Stop typing sound when line is complete
                    if (charIndex === message.length) {
                        typingSound.stop();

                        this.time.delayedCall(1200, showNextLine);
                    }
                },
            });
        };

        // Show next dialogue line
        const showNextLine = () => {
            currentLine++;

            if (currentLine < messages.length) {
                typeLine();
            } else {
                // Show battle instructions
                dialogue.setText("READY FOR BATTLE?\n\n" + "PRESS F TO THROW YOUR ROCK!");

                dialogue.setStyle({
                    fontSize: "26px",
                    color: "#ffe66d",
                    fontStyle: "bold",
                    align: "center",
                });

                this.waitingForFight = true;
            }
        };

        // Start dialogue
        this.time.delayedCall(1000, typeLine);
    }

    update() {
        // Wait for player to press F
        if (this.waitingForFight && Phaser.Input.Keyboard.JustDown(this.fightKey)) {
            this.waitingForFight = false;

            this.scene.start("EscapeScene");
        }
    }
}
