
BasicGame.MainMenu = function (game) {

	this.playButton = null;

};

BasicGame.MainMenu.prototype = {

	create: function () {
    this.circle = this.game.add.sprite(this.world.centerX, this.world.centerY, "circle");
    this.circle.anchor.setTo(0.5, 0.5);
    this.circle.scale.setTo(3, 3);
    this.circle.inputEnabled = true;
    this.circle.input.pixelPerfect = true;
    this.circle.events.onInputUp.add(this.startGame, this);
    this.game.add.tween(this.circle.scale)
      .to({x: 3.5, y: 3.5}, 4000, Phaser.Easing.Quadratic.InOut)
      .to({x: 3, y: 3}, 4000, Phaser.Easing.Quadratic.InOut)
      .loop()
      .start();
    this.game.add.tween(this.circle)
      .to({alpha: 0.5}, 3000, Phaser.Easing.Sinusoidal.InOut)
      .to({alpha: 0.8}, 3000, Phaser.Easing.Sinusoidal.InOut)
      .loop()
      .start();
    var score = localStorage.getItem("score");
    console.log("CREATE MAIN MENU", score);
    var scoreTextStyle = { font: "40px Helvetica", fill: "#ccc", align: "center" };
    this.scoreText = this.game.add.text(this.world.centerX, this.world.centerY, score, scoreTextStyle);
    this.scoreText.anchor.setTo(0.5, 0.5);
	},

	update: function () {

		//	Do some nice funky main menu effect here

	},

	startGame: function (pointer) {
		this.game.state.start('Game');
	}

};
