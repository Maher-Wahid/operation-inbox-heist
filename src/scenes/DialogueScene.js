import Phaser from "phaser";
import Starfield from "../objects/Starfield.js";

export default class DialogueScene extends Phaser.Scene {
    constructor() {
        super("DialogueScene");
    }

    preload() {
        // Load audio
        this.load.audio("typing", "assets/typing.mp3");
        this.load.audio("insideShipMusic", "/assets/spaceship.mp3");
    }

    create() {
        // Black background
        this.cameras.main.setBackgroundColor("#000000");

        const starfield = new Starfield(this);
        starfield.create();

        const spaceshipMusic = this.sound.get("spaceshipMusic");

        if (spaceshipMusic && spaceshipMusic.isPlaying) {
            spaceshipMusic.stop();
        }

        this.insideShipMusic = this.sound.add("insideShipMusic", {
            loop: true,
            volume: 0.1,
        });

        this.insideShipMusic.play();

        // Dialogue lines
        const messages = [
            "Cosmic Explorer, can you hear us?",
            "You've successfully infiltrated the Mailorians' base!",
            "They're keeping Earth's Cosmic Key somewhere inside.",
            "Find the access code to unlock the escape route.",
            "But be careful... don't alert the Mailorians!",
            "Earth is counting on you. Good luck, Cosmic Explorer!",
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

                    // Start typing sound on first character
                    if (charIndex === 1) {
                        typingSound.play();
                    }

                    // Stop typing sound when line is complete
                    if (charIndex === message.length) {
                        typingSound.stop();

                        this.time.delayedCall(1500, showNextLine);
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
                dialogue.setText("");

                this.time.delayedCall(1000, () => {
                    this.scene.start("ExplorationScene");
                });
            }
        };

        // Start dialogue after a short pause
        this.time.delayedCall(1000, typeLine);
    }
}
