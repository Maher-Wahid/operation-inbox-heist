import Phaser from "phaser";

export default class Starfield {
    constructor(scene) {
        this.scene = scene;
    }

    create() {
        const width = this.scene.cameras.main.width;
        const height = this.scene.cameras.main.height;

        // Small background stars
        for (let i = 0; i < 180; i++) {
            const x = Phaser.Math.Between(0, width);
            const y = Phaser.Math.Between(0, height);
            const size = Phaser.Math.FloatBetween(0.5, 2);

            const star = this.scene.add.circle(
                x,
                y,
                size,
                0xffffff,
                Phaser.Math.FloatBetween(0.3, 1),
            );

            star.setDepth(-1);

            this.scene.tweens.add({
                targets: star,
                alpha: Phaser.Math.FloatBetween(0.2, 0.5),
                duration: Phaser.Math.Between(1000, 3000),
                yoyo: true,
                repeat: -1,
                delay: Phaser.Math.Between(0, 2000),
            });
        }

        // Larger glowing stars
        for (let i = 0; i < 15; i++) {
            const x = Phaser.Math.Between(20, width - 20);
            const y = Phaser.Math.Between(20, height - 20);

            const star = this.scene.add.circle(x, y, 2.5, 0x9ecbff, 1);

            star.setDepth(-1);

            this.scene.tweens.add({
                targets: star,
                alpha: 0.2,
                scale: 1.8,
                duration: Phaser.Math.Between(1500, 3000),
                yoyo: true,
                repeat: -1,
            });
        }

        // Colorful cosmic stars
        const colors = [0x8b5cf6, 0x38bdf8, 0xf0abfc];

        for (let i = 0; i < 12; i++) {
            const x = Phaser.Math.Between(0, width);
            const y = Phaser.Math.Between(0, height);

            const star = this.scene.add.circle(
                x,
                y,
                1.8,
                Phaser.Utils.Array.GetRandom(colors),
                0.8,
            );

            star.setDepth(-1);
        }
    }
}
