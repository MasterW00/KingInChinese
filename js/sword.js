class Sword {
    constructor(scene, godsword = false) {
        this.scene = scene;   
        this.godsword = godsword;

        this.swordBody = null;
        this.sword = null;
        this.constraint = null;

        this.godSwordScale = 0.3;
        this.godSwordAngle = 90;
        this.godSwordLength = 240;
        this.godSwordType = 'God Sword';

        this.swordScale = 0.1;
        this.swordLength = 200;
        this.swordAngle = 180;
        this.swordType = 'sword';

        this.createSword();
    }

    createSword() {
        if (this.godsword) {
            this.swordBody = this.scene.matter.add.rectangle(this.player.x + 300, this.player.y + 100, 20, 270);
            this.swordType = this.godSwordType;
            this.swordScale = this.godSwordScale;
            this.swordAngle = this.godSwordAngle;
            this.swordLength = this.godSwordLength;
        } else {
            this.swordBody = this.scene.matter.add.rectangle(this.player.x + 300, this.player.y + 100, 180, 15);
        }

        this.sword = this.scene.matter.add.sprite(this.player.x, this.player.y, this.swordType)
            .setScale(this.swordScale)
            .setExistingBody(this.swordBody);
        this.sword.setAngle(this.swordAngle);

        this.constraint = this.scene.matter.add.constraint(this.player.body, this.sword, 0, 0.1, {
            pointA: { x: 0, y: 0 },
            pointB: { x: this.swordLength, y: 0 },
        });

        return this.sword;
    }

    takeSword(player) {
        this.scene.matter.world.remove(this.player.Sword.Hold);
        player.Sword.destroy();
        player.Sword = null;
    }
}