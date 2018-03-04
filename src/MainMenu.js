
BasicGame.MainMenu = function (game) {

	this.playButton = null;

};

BasicGame.MainMenu.prototype = {

	create: function () {
    this.background = this.game.add.sprite(0, 0, "background");
    this.background.inputEnabled = true;
    this.background.events.onInputUp.add(this.requestFullScreen, this);
    this.circle = this.game.add.sprite(this.world.centerX, this.world.centerY, "circle_big");
    this.circle.anchor.setTo(0.5, 0.5);
    this.circle.scale.setTo(0, 0);
    this.circle.inputEnabled = true;
    this.circle.input.pixelPerfect = true;
    this.circle.events.onInputUp.add(this.startGame, this);
    this.game.add.tween(this.circle.scale)
      .to({x: 0.5, y: 0.5}, 4000, Phaser.Easing.Quadratic.InOut)
      .to({x: 0.6, y: 0.6}, 4000, Phaser.Easing.Quadratic.InOut)
      .loop()
      .start();
    this.game.add.tween(this.circle)
      .to({alpha: 0.5}, 3000, Phaser.Easing.Sinusoidal.InOut)
      .to({alpha: 0.8}, 3000, Phaser.Easing.Sinusoidal.InOut)
      .loop()
      .start();
    var score = localStorage.getItem("score");
    this.scoreText = this.game.add.text(this.world.centerX, this.world.centerY, score, BasicGame.scoreTextStyle);
    this.scoreText.anchor.setTo(0.5, 0.5);
    this.scoreText.scale.setTo(0, 0);
    this.game.add.tween(this.scoreText.scale)
      .to({x: 1, y: 1}, 4000, Phaser.Easing.Quadratic.InOut)
      .start();
	},

	update: function () {

		//	Do some nice funky main menu effect here

	},

	startGame: function (pointer) {
		this.game.state.start('Game');
	},
  requestFullScreen: function(){
    if( document.documentElement.webkitRequestFullScreen){
      document.documentElement.webkitRequestFullScreen();
    } else if( document.documentElement.mozRequestFullScreen){
      document.documentElement.mozRequestFullScreen();
    } else if( document.documentElement.msRequestFullScreen){
      document.documentElement.msRequestFullScreen();
    }
  }
};
