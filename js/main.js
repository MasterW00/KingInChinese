/// <reference path="../typings/phaser.d.ts" />

const config = {
    type: Phaser.AUTO,
    backgroundColor: '#cdcdcd',
    scale: {
      mode: Phaser.Scale.ENVELOP,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 1920,
      height: 1080,
      parent: 'phaser-example'
    },
    physics:{
        default:'matter',
        arcade:{
            debug: true,
            gravity: {y: 0},
        },
        matter:{
            debug:false,
            gravity: {y: 0}
        }
    },
    antialias: true,
    scene: [DeTest, MainScene]
  };
  
  window.addEventListener('load', () => {
    const game = new Phaser.Game(config)
  });
  