
BasicGame.MainMenu = function (game) {

	this.playButton = null;

};

BasicGame.MainMenu.prototype = {

	create: function () {
		this.add.sprite(0, 0, 'titlepage');
    var score = localStorage.getItem("score");
    console.log("CREATE MAIN MENU", score);
    var scoreTextStyle = { font: "40px Helvetica", fill: "#ccc", align: "center" };
    this.scoreText = this.game.add.text(this.world.centerX, this.world.centerY, score, scoreTextStyle);
		this.playButton = this.add.button(400, 600, 'playButton', this.startGame, this);
	},

	update: function () {

		//	Do some nice funky main menu effect here

	},

	startGame: function (pointer) {
		this.game.state.start('Game');
	}

};
