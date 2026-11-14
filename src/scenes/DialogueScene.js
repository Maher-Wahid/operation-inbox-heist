import Phaser from "phaser";

export default class DialogueScene extends Phaser.Scene {
    constructor() {
        super("DialogueScene");
    }

    create() {
        // Black background
        this.cameras.main.setBackgroundColor("#000000");

        // Dialogue lines
        const messages = [
            "Welcome aboard, astronaut.",
            "We've detected an unusual system failure.",
            "The ship's systems have been compromised.",
            "Your mission is to locate the secret key.",
            "Good luck. You'll need it.",
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

        let currentLine = 0;
        let charIndex = 0;
        let typingEvent;

        // Typewriter effect
        const typeLine = () => {
            const message = messages[currentLine];

            charIndex = 0;
            dialogue.setText("");

            typingEvent = this.time.addEvent({
                delay: 50, // Time between each character (ms)
                repeat: message.length - 1,
                callback: () => {
                    charIndex++;
                    dialogue.setText(message.substring(0, charIndex));

                    // Check if the entire line has been typed
                    if (charIndex === message.length) {
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
