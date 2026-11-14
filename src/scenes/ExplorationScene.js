import Phaser from "phaser";
import Character from "../objects/Character.js";

export default class ExplorationScene extends Phaser.Scene {
    constructor() {
        super("ExplorationScene");
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

        // Flower image
        this.load.image("flower", "/assets/cosmos-flower.png");

        // Audio
        this.load.audio("pickUp", "assets/pick-up.mp3");
        this.load.audio("accepted", "/assets/accepted.mp3");
        this.load.audio("denied", "/assets/denied.mp3");
    }

    create() {
        // Background
        const { width, height } = this.cameras.main;
        const background = this.add.image(width / 2, height / 2, "spaceshipBackground");
        background.setDisplaySize(width, height);

        // Character
        this.player = new Character(this, 330, 480);

        // Flower
        this.flower = this.add.image(640, 445, "flower");
        this.flowerCollected = false;
        this.nearFlower = false;

        // Audio
        this.pickUpSound = this.sound.add("pickUp", { volume: 0.4 });
        this.acceptedSound = this.sound.add("accepted", { volume: 0.3 });
        this.deniedSound = this.sound.add("denied", { volume: 0.4 });

        // Interaction prompt
        this.prompt = this.add.text(0, 0, "Press E to enter", {
            fontSize: "18px",
            color: "#ffffff",
            backgroundColor: "#000000",
            padding: { x: 10, y: 5 },
        });

        this.prompt.setOrigin(0.5);
        this.prompt.setVisible(false);

        // Define door hitboxes
        this.doors = [
            {
                name: "Door 1",
                x: 200,
                y: 400,
                width: 80,
                height: 100,
                interaction: "code",
                code: "C0S1",
                nextScene: "AlertScene",
            },
            {
                name: "Door 2",
                x: 500,
                y: 400,
                width: 80,
                height: 100,
                interaction: "message",
                message:
                    "You hear strange noises behind the door... Best not to find out what's inside.",
            },
            {
                name: "Door 3",
                x: 800,
                y: 400,
                width: 80,
                height: 100,
                interaction: "message",
                message:
                    "A bunch of Mailorians are having a party inside! You decide not to interrupt.",
            },
        ];

        // Keyboard input
        this.interactKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

        this.currentDoor = null;
    }

    update(time, delta) {
        if (this.popupActive) return;

        this.player.update(time, delta);

        this.currentDoor = null;
        this.nearFlower = false;

        const playerBounds = this.player.getBounds();

        // Check if player is near the flower
        if (!this.flowerCollected && this.flower) {
            const flowerBounds = this.flower.getBounds();

            if (Phaser.Geom.Intersects.RectangleToRectangle(playerBounds, flowerBounds)) {
                this.nearFlower = true;
            }
        }

        // Check door collisions
        for (const door of this.doors) {
            const doorBounds = new Phaser.Geom.Rectangle(door.x, door.y, door.width, door.height);

            if (Phaser.Geom.Intersects.RectangleToRectangle(playerBounds, doorBounds)) {
                this.currentDoor = door;
                break;
            }
        }

        // Show the correct interaction prompt
        this.prompt.setVisible(!!this.currentDoor || this.nearFlower);

        if (this.nearFlower && !this.currentDoor) {
            this.prompt.setText("Press E to inspect flower");
            this.prompt.setPosition(this.flower.x, this.flower.y - 50);
        } else if (this.currentDoor) {
            this.prompt.setText("Press E to interact");
            this.prompt.setPosition(
                this.currentDoor.x + this.currentDoor.width / 2,
                this.currentDoor.y - 20,
            );
        }

        // Handle E key interaction
        if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
            if (this.nearFlower && !this.currentDoor) {
                this.inspectFlower();
            } else if (this.currentDoor) {
                this.interactWithDoor(this.currentDoor);
            }
        }
    }

    // Inspect flower
    inspectFlower() {
        this.flowerCollected = true;
        this.pickUpSound.play();

        // Save the flower's original position
        const flowerX = this.flower.x;
        const flowerY = this.flower.y;

        this.flower.destroy();
        this.flower = null;

        this.prompt.setVisible(false);

        // Message in the middle of the screen
        this.showMessage("A Cosmos Flower! How pretty... Wait, what's that hidden beneath it?");

        // Code where the flower was
        this.flowerText = this.add.text(flowerX, flowerY, "C0S1", {
            fontSize: "12px",
            color: "#ffffff",
            padding: { x: 6, y: 4 },
            align: "center",
            wordWrap: { width: 150 },
        });

        this.flowerText.setOrigin(0.5);
        this.flowerText.setDepth(5);
    }

    interactWithDoor(door) {
        if (door.interaction === "code") {
            this.showCodeInput(door);
        }

        if (door.interaction === "message") {
            this.showMessage(door.message);
        }
    }

    showCodeInput(door) {
        this.popupActive = true;

        const { width, height } = this.cameras.main;

        // Dark overlay
        this.overlay = this.add
            .rectangle(width / 2, height / 2, width, height, 0x000000, 0.7)
            .setDepth(10);

        // Popup title
        this.popupTitle = this.add
            .text(width / 2, height / 2 - 100, "ENTER ACCESS CODE", {
                fontSize: "24px",
                color: "#ffffff",
            })
            .setOrigin(0.5)
            .setDepth(11);

        // HTML input
        this.codeInput = this.add.dom(width / 2, height / 2 - 30).createElement("input");

        this.codeInput.node.type = "text";
        this.codeInput.node.placeholder = "Enter code";
        this.codeInput.node.maxLength = 4;
        this.codeInput.node.style.cssText = `
            width: 200px;
            padding: 12px;
            font-size: 20px;
            text-align: center;
        `;

        this.codeInput.setDepth(12);
        this.codeInput.node.focus();

        // Error message
        this.errorText = this.add
            .text(width / 2, height / 2 + 25, "", {
                fontSize: "16px",
                color: "#ff4444",
            })
            .setOrigin(0.5)
            .setDepth(11);

        // Submit button
        this.submitText = this.add
            .text(width / 2, height / 2 + 75, "SUBMIT", {
                fontSize: "20px",
                color: "#00ff99",
                backgroundColor: "#333333",
                padding: { x: 15, y: 10 },
            })
            .setOrigin(0.5)
            .setInteractive()
            .setDepth(11);

        this.submitText.on("pointerdown", () => {
            if (this.codeInput.node.value === door.code) {
                this.acceptedSound.play();
                this.scene.start(door.nextScene);
            } else {
                this.deniedSound.play();
                this.errorText.setText("Incorrect code! Try again.");
                this.codeInput.node.value = "";
                this.codeInput.node.focus();
            }
        });

        // Close button
        this.closeText = this.add
            .text(width / 2, height / 2 + 125, "CLOSE", {
                fontSize: "16px",
                color: "#ffffff",
            })
            .setOrigin(0.5)
            .setInteractive()
            .setDepth(11);

        this.closeText.on("pointerdown", () => {
            this.closePopup();
        });
    }

    closePopup() {
        this.overlay.destroy();
        this.popupTitle.destroy();
        this.codeInput.destroy();
        this.errorText.destroy();
        this.submitText.destroy();
        this.closeText.destroy();

        this.popupActive = false;
    }

    showMessage(message) {
        const { width, height } = this.cameras.main;

        const text = this.add
            .text(width / 2, height / 2, message, {
                fontSize: "22px",
                color: "#ffffff",
                backgroundColor: "#222222",
                padding: { x: 20, y: 15 },
                align: "center",
                wordWrap: { width: 400 },
            })
            .setOrigin(0.5)
            .setDepth(20);

        this.time.delayedCall(3000, () => {
            text.destroy();
        });
    }
}
