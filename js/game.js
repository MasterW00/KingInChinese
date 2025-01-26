class MainScene extends Phaser.Scene {
    constructor() {
      super({ key: 'MainScene' }),
      this.update = this.update.bind(this)
    }

    preload() {
        this.load.image('grass','./assets/map.png',);
        this.load.spritesheet('graf', './assets/wang.png', { frameWidth: 200, frameHeight: 170})
        this.load.image('fountain', './assets/fountain.png');
        this.load.image('sword', './assets/sword.png');
        this.load.image('God Sword', './assets/god_sword.png');
        //body
        // this.body  = this.matter.bodies.circle(
        //     0,
        //     0,
        //     35,
        //     {
        //         frictionAir: .2,
        //         isSensor: true,
        //     }
        //     );
        // this.matter.body.scale(this.body, 2.7, 2)
    //constants
    this.playerd = {
        x: 100,
        y: 100,
        angle: 0
    }
    this.damage_scale = 100;
    //keybinds
    this.keys = this.input.keyboard.addKeys({
        up: 'up',
        down: 'down',
        left: 'left',
        right: 'right',
        w: 'w',
        a: 'a',
        s: 's',
        d: 'd',
        i: "i",
        o: "o",
        p: "p",
        k: "k",
        l: "l",
        colon: "colon",
        quote: "quote",
        lectC:"comma",
        rightC:"period",
        que:"back_slash",
        space: 'space',
        shift: 'shift',

    })
    };

    handleCollisionStart(event) {
        const pairs = event.pairs;
        for (let i = 0; i < pairs.length; i++) {
            const pair = pairs[i];
            const bodyA = pair.bodyA;
            const bodyB = pair.bodyB;

            // Example: Check for specific collision pairs
            if (bodyA.collisionFilter.category === this.playerCategory && bodyB.collisionFilter.category === this.swordCategory) {
                // Add your collision handling logic here
                if(bodyA == this.player.body){
                    this.player.health -= this.damage_scale * Math.abs(bodyB.angularVelocity);
                    console.log(this.player.health);
                    if (this.player.health <= 0){this.player.setPosition(0, 0); this.player.health = 100;};
                }
            } else if (bodyA.collisionFilter.category === this.swordCategory && bodyB.collisionFilter.category === this.playerCategory) {
                console.log('Sword collided with player');
                // Add your collision handling logic here
                if(bodyB == this.player.body){
                    this.player.health -= this.damage_scale * Math.abs(bodyA.angularVelocity);
                    console.log(this.player.health);
                    if (this.player.health <= 0){this.player.setPosition(0, 0); this.player.health = 100;};
                }
            } else {
                console.log('Collision started between:', bodyA.label, 'and', bodyB.label);
            }
        }
    }

    giveSword(player, godsword = false){
        let swordBody;

        let godSwordScale = 0.3;  
        let godSwordAngle = 90;
        let godSwordLenth = 240;
        let godSwordType = 'God Sword';

        let swordScale = 0.1;
        let swordLength = 200;
        let swordAngle = 180;
        let swordType = 'sword';
        if(player.Sword){
            this.takeSword(player);
        }
        if(godsword){
            let godSwordBody = this.matter.add.rectangle(player.x + 300,player.y+100, 20,270);
            swordBody = godSwordBody;
            swordScale = godSwordScale;
            swordType = godSwordType;
            swordAngle = godSwordAngle;
            swordLength = godSwordLenth;
        }
        else{
            swordBody = this.matter.add.rectangle(player.x + 300,player.y, 180,15)
        }

        player.Sword = this.matter.add.sprite(player.x,player.y, swordType).setScale(swordScale).setExistingBody(swordBody)
        player.Sword.setAngle(swordAngle);
        player.Sword.Hold = this.matter.add.constraint(player.body, player.Sword, 0, 0.1, {
            pointA: { x: 0, y:0 },
            pointB: { x:swordLength , y:0 },
        });
        player.Sword.setVelocity(0,0);
        //if(player.body != this.player) player.Sword.body.collisionFilter.category = this.swordCategory;
        //player.Sword.body.collisionFilter.mask = this.playerCategory;
    }
    takeSword(player){
        this.matter.world.remove(player.Sword.Hold);
        player.Sword.destroy();
    }

    
    create() {
    window.myScene = this;
      this.add.image(0,0,'grass').setScale(1.5);
      //fountain
      this.fountian = this.matter.add.sprite(0,0,'fountain', null, {
        shape:{
            type: 'circle',
        }}).setStatic(true);
        this.matter.body.scale(myScene.fountian.body, .5, .5);
        this.fountian.setOrigin(0.5,0.46);
    
        this.playerMap = {};
        Client.askNewPlayer();
        //this.oopsie = this.add.text(125 ,350 ,'press space to continue', { font: '30px Arial Black', fill: '#ac4' }).setStroke('#abc', 16).setShadow(5, 5, "#333333", 2, true, true);
        this.matter.world.on('collisionstart', this.handleCollisionStart, this);

        // Define collision categories
        this.playerCategory = this.matter.world.nextCategory();
        this.swordCategory = this.matter.world.nextCategory();
        //animations
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
    addNewPlayer(id, x, y, angle) {
        this.playerMap[id] = this.matter.add.sprite(x, y, 'graf', null,{
            shape:{
            type: 'circle',
            },
            frictionAir: .2,
            isSensor: false,
        });
        this.matter.body.scale(this.playerMap[id].body, 1, .7);
        
        //this.playerMap[id].body.collisionFilter.mask = this.swordCategory;
        this.playerMap[id].anims.play('rest', true);
        this.playerMap[id].setAngle(angle);  
        this.giveSword(this.playerMap[id]);
        this.playerMap[id].Sword.setVelocity(0,0);
        if(id == clientID){
            //this.matter.world.remove(this.player)
            this.player = this.playerMap[id];
            this.playerMap[id].setDepth(1);
            this.player.health = 100;
            this.player.body.collisionFilter.category = this.playerCategory;
            this.time.addEvent({
                delay: 1000, // Time delay in milliseconds (1000 ms = 1 second)
                callback: this.swordSync,
                callbackScope: this,
                loop: true
            });
            
        }
        else this.playerMap[id].Sword.body.collisionFilter.category = this.swordCategory;
    }
    removePlayer(id){
        if(this.playerMap[id].Sword){
            this.takeSword(this.playerMap[id]);
        }
        this.matter.world.remove(this.playerMap[id].body);
        this.playerMap[id].destroy();
        delete this.playerMap[id];
    }
    movePlayer(id, x, y, angle) {       
        var splayer = this.playerMap[id];
        splayer.x = x;
        splayer.y = y;
        splayer.setAngle(angle);
    }
    swordSync(){
        if(this.player.Sword){
            let sword ={
            'x' : this.player.Sword.x - this.player.x,
            'y' :this.player.Sword.y - this.player.y,
            'a': this.player.Sword.angle,
            'v': this.player.Sword.body.angularVelocity
            }
            Client.sendSword(clientID, sword);
        }
    }
    moveSword(id, sword){
        if(this.playerMap[id].Sword){
            this.playerMap[id].Sword.setPosition(this.playerMap[id].x + sword.x,this.playerMap[id].y + sword.y);
            this.playerMap[id].Sword.setAngle(sword.a);
            this.playerMap[id].Sword.setAngularVelocity(sword.v);
        }
    }
    update(){
        if(!this.player){
            return;
        }
        this.cameras.main.centerOn(this.player.x, this.player.y);
        if(!(Math.abs(this.playerd.x - this.player.x) < 5) || !(Math.abs(this.playerd.y - this.player.y) < 5)  || this.player.angle != this.playerd.angle){
            Client.sendMove(clientID, this.player.x, this.player.y, this.player.angle);
            this.playerd = {
            x:this.player.x,
            y:this.player.y,
            angle: this.player.angle
        }
        
        }
        const speed = 10;
        if(!this.keys.shift.isDown){
        {if(this.keys.w.isDown)
        {
            this.player.setVelocityY(-1 * speed);
        }
        else if(this.keys.s.isDown){
            this.player.setVelocityY(speed);
        }}{
        if(this.keys.a.isDown){
            this.player.setVelocityX(speed * -1);
        }
        else if(this.keys.d.isDown){
            this.player.setVelocityX(speed);
        }}}
            if(this.keys.a.isDown){
                this.player.setAngle(180);
            }
            if(this.keys.d.isDown){
                this.player.setAngle(0);
            }
            if(this.keys.w.isDown)
            {
                if (this.keys.a.isDown) 
                    this.player.setAngle(225);
                else if (this.keys.d.isDown) 
                    this.player.setAngle(-45);
                else
                this.player.setAngle(270);
                
            }
            if(this.keys.s.isDown){
                if (this.keys.d.isDown) 
                    this.player.setAngle(45);
                else if (this.keys.a.isDown) 
                    this.player.setAngle(135);
                else
                this.player.setAngle(90);
            }
            
    }
}