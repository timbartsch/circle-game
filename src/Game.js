
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
    this.dead;
    this.spawnTimer;

};

BasicGame.Game.prototype = {

	create: function () {
    BasicGame.score = 0;
    this.dead = false;
    this.background = this.game.add.sprite(0, 0, "background");
    this.background.inputEnabled = true;
    this.background.events.onInputUp.add(this.onBackgroundInputUp, this);
    this.circles = this.game.add.group();
    this.scoreText = this.game.add.text(this.world.centerX, this.world.centerY, "0", BasicGame.scoreTextStyle);
    this.scoreText.anchor.setTo(0.5, 0.5);

    var timeBetweenCircles = 900;
    this.spawnTimer = this.time.events.loop(timeBetweenCircles, this.createCircle, this);
	},

	update: function () {
    if(this.dead){
      this.quitGame();
    }
	},

	quitGame: function (pointer) {
    this.spawnTimer.pendingDelete = true;
    localStorage.setItem("score", BasicGame.score);
		this.game.state.start('MainMenu');
	},

  createCircle: function(){
    console.log("Created Circle");
    var circle, circleGrowTween, circleShrinkTween;
    
    circle = this.circles.create(this.game.world.randomX, this.game.world.randomY, "circle");
    circle.inputEnabled = true;
    circle.input.pixelPerfect = true;
    circle.events.onInputUp.add(this.onCircleInputUp, this);
    circle.anchor.setTo(0.5, 0.5);
    circle.scale.setTo(0, 0);

    circleGrowTween = this.game.add.tween(circle.scale).to({x: 1, y: 1}, 1000, Phaser.Easing.Linear.None);
    circleShrinkTween = this.game.add.tween(circle.scale).to({x: 0, y: 0}, 1000, Phaser.Easing.Linear.None);
    circle.game = this;
    circleShrinkTween.onComplete.add(this.onCircleShrinkEnd, circle);
    circleGrowTween.chain(circleShrinkTween);
    circle.growTween = circleGrowTween;
    circle.shrinkTween = circleShrinkTween;
    circleGrowTween.start();
  },

  onCircleShrinkEnd: function(pointer){
    var circle = this;

    circle.kill();
    circle.game.dead = true;
  },

  onCircleInputUp: function(circle, pointer){
    circle.growTween.stop();
    circle.shrinkTween.stop();
    circle.kill();
    this.updateScore(+1);
  },

  onBackgroundInputUp: function(background, pointer){
    this.dead = true;
  },

  updateScore: function(scoreChange){
    BasicGame.score += scoreChange;
    this.scoreText.setText(BasicGame.score);
  }

};
