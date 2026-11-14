import Phaser from "phaser";

export default class WelcomeScene extends Phaser.Scene {
    constructor() {
        super("WelcomeScene");

        this.noHoverCount = 0;
        this.yesButton = null;
        this.noButton = null;
    }

    preload() {
        this.load.image("skyBackground", "/assets/sky-background.png");
        this.load.audio("backgroundMusic", "/assets/welcome.mp3");
    }

    create() {
        const { width, height } = this.scale;

        // Background
        const background = this.add.image(width / 2, height / 2, "skyBackground");

        const bgScale = Math.max(width / background.width, height / background.height);

        background.setScale(bgScale);

        // Audio
        // Background music
        this.backgroundMusic = this.sound.add("backgroundMusic", {
            loop: true,
            volume: 0.6,
        });

        this.backgroundMusic.play();

        // Dark overlay
        this.add.rectangle(width / 2, height / 2, width, height, 0x050b20, 0.68);

        // Decorative stars
        for (let i = 0; i < 50; i++) {
            const star = this.add.circle(
                Phaser.Math.Between(0, width),
                Phaser.Math.Between(0, height),
                Phaser.Math.Between(1, 2),
                0xffffff,
                Phaser.Math.FloatBetween(0.2, 0.8),
            );

            this.tweens.add({
                targets: star,
                alpha: 0.2,
                duration: Phaser.Math.Between(800, 1800),
                yoyo: true,
                repeat: -1,
            });
        }

        // Main content
        this.add
            .text(width / 2, 55, "🚨 EMERGENCY ALERT 🚨", {
                fontSize: "20px",
                color: "#ff5757",
                fontStyle: "bold",
                fontFamily: "Arial",
            })
            .setOrigin(0.5);

        this.add
            .text(width / 2, 120, "OUTLOOK IS DOWN!", {
                fontSize: "52px",
                color: "#ffffff",
                fontStyle: "bold",
                fontFamily: "Arial",
                stroke: "#172b63",
                strokeThickness: 6,
            })
            .setOrigin(0.5);

        this.add
            .text(width / 2, 195, "WE NEED YOUR HELP, EARTHLING!", {
                fontSize: "22px",
                color: "#59e5ff",
                fontStyle: "bold",
                fontFamily: "Arial",
            })
            .setOrigin(0.5);

        // Story panel
        const panel = this.add.rectangle(width / 2, 315, 650, 165, 0x101c3d, 0.95);

        panel.setStrokeStyle(2, 0x43cfff);

        this.add
            .text(
                width / 2,
                315,
                "An unexpected alien invasion has thrown Earth's communication systems into chaos!\n" +
                    "The mischievous Mailorians have stolen the Cosmic Key, the only thing capable of bringing Outlook back online.\n" +
                    "Without it, humanity may never send another email again...",
                {
                    fontSize: "17px",
                    color: "#ffffff",
                    fontFamily: "Arial",
                    align: "center",
                    lineSpacing: 7,
                    wordWrap: { width: 600 },
                },
            )
            .setOrigin(0.5);

        // Challenge question
        this.add
            .text(width / 2, 425, "WILL YOU ACCEPT YOUR INTERGALACTIC MISSION?", {
                fontSize: "21px",
                color: "#ffe66d",
                fontStyle: "bold",
                fontFamily: "Arial",
            })
            .setOrigin(0.5);

        // Create real HTML buttons
        this.yesButton = this.createHTMLButton(width / 2 - 95, 490, "I'M IN!!", "#20c997");

        this.noButton = this.createHTMLButton(width / 2 + 95, 490, "I am scared...", "#e74c3c");

        // YES button click
        this.yesButton.node.addEventListener("click", () => {
            this.scene.start("StartScene");
        });

        // YES hover effect
        this.yesButton.node.addEventListener("pointerenter", () => {
            this.yesButton.setAngle(-3);
        });

        this.yesButton.node.addEventListener("pointerleave", () => {
            this.yesButton.setAngle(0);
        });

        // NO button: instant movement on native HTML hover
        this.noButton.node.addEventListener("pointerenter", () => {
            this.noHoverCount++;

            const padding = 90;

            const newX = Phaser.Math.Between(padding, width - padding);

            const newY = Phaser.Math.Between(padding, height - padding);

            // Instantly move NO
            this.noButton.setPosition(newX, newY);

            // Instantly grow YES
            const newScale = Math.min(1 + this.noHoverCount * 0.5, 3);

            this.yesButton.setScale(newScale);
        });
    }

    createHTMLButton(x, y, label, color) {
        const button = this.add.dom(x, y).createElement(
            "button",
            `
                width: 160px;
                height: 55px;
                background-color: ${color};
                color: white;
                border: 2px solid white;
                border-radius: 0px;
                font-size: 23px;
                font-weight: bold;
                font-family: Arial, sans-serif;
                cursor: pointer;
                padding: 0;
                margin: 0;
                box-sizing: border-box;
                display: flex;
                align-items: center;
                justify-content: center;
                outline: none;
                user-select: none;
                -webkit-user-select: none;
            `,
            label,
        );

        button.setOrigin(0.5);

        button.setDepth(100);

        return button;
    }
}
