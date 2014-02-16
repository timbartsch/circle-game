
BasicGame.Game = function (game) {

	//	When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.game;		//	a reference to the currently running game
    this.add;		//	used to add sprites, text, groups, etc
    this.camera;	//	a reference to the game camera
    this.cache;		//	the game cache
    this.input;		//	the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)
    this.load;		//	for preloading assets
    this.math;		//	lots of useful common math operations
    this.sound;		//	the sound manager - add a sound, play one, set-up markers, etc
    this.stage;		//	the game stage
    this.time;		//	the clock
    this.tweens;	//	the tween manager
    this.world;		//	the game world
    this.particles;	//	the particle manager
    this.physics;	//	the physics manager
    this.rnd;		//	the repeatable random number generator

    //	You can use any of these from any function within this State.
    //	But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.

    this.background;
    this.circles;
    this.scoreText;
};

BasicGame.Game.prototype = {

	create: function () {

		//	Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!

    this.background = this.game.add.sprite(0, 0, "background");
    this.background.inputEnabled = true;
    this.background.events.onInputUp.add(this.onBackgroundInputUp, this);
    this.scoreText = this.game.add.text(0, 0, "Score: " + BasicGame.score);
    this.circles = this.game.add.group();
    this.game.time.events.repeat(Phaser.Timer.SECOND, 3, this.createCircle, this);

	},

	update: function () {

		//	Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
    //
    if(BasicGame.score < 0) {
      this.quitGame();
    }

	},

	quitGame: function (pointer) {

		//	Here you should destroy anything you no longer need.
		//	Stop music, delete sprites, purge caches, free resources, all that good stuff.
    
    this.scoreText.destroy();
    this.circles.destroy(true);
    this.background.destroy();

		//	Then let's go back to the main menu.
		this.game.state.start('MainMenu');

	},

  createCircle: function(){
    var circle = this.circles.create(this.game.world.randomX, this.game.world.randomY, "circle");
    circle.inputEnabled = true;
    circle.input.pixelPerfect = true;
    circle.events.onInputUp.add(this.onCircleInputUp, this);
    circle.anchor.setTo(0.5, 0.5);
    circle.scale.setTo(0, 0);
    this.game.add.tween(circle.scale)
      .to({x: 1, y: 1}, 1000, Phaser.Easing.Linear.None)
      .to({x: 0, y: 0}, 1000, Phaser.Easing.Linear.None)
      .start();
  },

  onCircleInputUp: function(circle, pointer){
    this.updateScore(+5);
    circle.kill();
  },

  onBackgroundInputUp: function(background, pointer){
    this.updateScore(-10);
  },

  updateScore: function(scoreChange){
    BasicGame.score += scoreChange;
    this.scoreText.setText("Score: " + BasicGame.score);
  }

};
