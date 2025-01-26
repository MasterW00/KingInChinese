
class DeTest extends Phaser.Scene{
    constructor(){super({key: 'DeTest'})}
    preload(){
        this.load.spritesheet('graf', './assets/wang.png', {frameWidth:200,frameHeight:170})
        this.load.image('map', './assets/map.png')
        this.i = 0
        this.body  = this.matter.bodies.circle(
            325,
            250,
            35,
            {
                frictionAir: .1,
            }
            );
        this.matter.body.scale(this.body, 2.8, 2);
    }
   
    create(){
        this.add.image(325, 250, 'map')
        this.gif = this.matter.add.sprite(325, 250, 'graf').setExistingBody(this.body)
        
        this.input.keyboard.on('keydown-SPACE', function(){this.scene.start('MainScene')}, this);
        this.A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.input.on('pointermove', this.pointTo, this);
        //title text
        this.title = this.add.text(-300 ,-300 ,'W A N G', { font: '300px Arial Black', fill: '#fff' }).setStroke('#abc', 16).setShadow(10, 10, "#333333", 2, true, true);
        this.add.text(-20 ,350 ,'press space to continue', { font: '60px Arial Black', fill: '#ac4' }).setStroke('#abc', 16).setShadow(5, 5, "#333333", 2, true, true);
        this.add.text(30 ,450 ,'"W" and mouse to move around', { font: '40px Arial Black', fill: '#22a' }).setShadow(5, 4, "#999999", 2, true, true);
        //animations
        this.hsv = Phaser.Display.Color.HSVColorWheel();
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('graf', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'sprint',
            frames: this.anims.generateFrameNumbers('graf', { start: 0, end: 3 }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'rest',
            frames: [{ key: 'graf', frame:4 }],
            frameRate: 10,
        });
        this.anims.create({
            key: 'shoot',
            frames: this.anims.generateFrameNumbers('graf', { start: 6, end: 6 }),
            frameRate: 10,
        });
    }
    pointTo(pointer){
        var angle = Phaser.Math.RAD_TO_DEG * Phaser.Math.Angle.Between(this.gif.x, this.gif.y, pointer.worldX, pointer.worldY);
        this.gif.setAngle(angle)
    }
    update(){
        const playerSpeed = 12
        if((Math.abs(this.gif.x - 340) < 400) && (Math.abs(this.gif.y - 250) < 300)){
            this.cameras.main.centerOn((340 + this.gif.x)/2, (250+this.gif.y)/2)
            this.cameras.main.zoom = 1
        }
        else{
        this.cameras.main.centerOn(this.gif.x, this.gif.y)
        this.cameras.main.zoom = 1.6
        }
        if(this.W.isDown){
            this.gif.setVelocity(playerSpeed * Math.cos(this.gif.rotation), playerSpeed * Math.sin(this.gif.rotation))
            this.gif.anims.play('walk', true)
        }
        else{
            this.gif.anims.play('rest', true)
        }
        const top = this.hsv[this.i].color;
        const bottom = this.hsv[359 - this.i].color;

        this.title.setTint(top, top, bottom, bottom);

        this.i ++;

        if (this.i === 360)
        {
            this.i = 0;
        }
    }
    
}