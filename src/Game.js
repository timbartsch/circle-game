
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
    this.levelText;
    this.misses;
    this.level;

    this.levels = [
      { circles: 10, timeBetweenCircles: 1000 },
      { circles: 12, timeBetweenCircles: 900 },
      { circles: 14, timeBetweenCircles: 800 },
      { circles: 16, timeBetweenCircles: 700 },
      { circles: 18, timeBetweenCircles: 600 },
      { circles: 20, timeBetweenCircles: 500 },
      { circles: 22, timeBetweenCircles: 400 },
      { circles: 24, timeBetweenCircles: 300 },
      { circles: 26, timeBetweenCircles: 200 },
      { circles: 28, timeBetweenCircles: 100 },
    ];
};

BasicGame.Game.prototype = {

	create: function () {

		//	Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
    

    BasicGame.score = 0;
    this.misses = 0;
    this.level = 0;
    this.background = this.game.add.sprite(0, 0, "background");
    this.background.inputEnabled = true;
    this.background.events.onInputUp.add(this.onBackgroundInputUp, this);
    this.scoreText = this.game.add.text(0, 0, "Score: " + BasicGame.score);
    this.levelText = this.game.add.text(200, 0, "Level: " + this.level);
    this.circles = this.game.add.group();

    this.startLevel(0); 
	},

  startLevel: function(level){
    this.level = level;

    console.log("LEVEL", level);
    
    var circlesCount = this.levels[this.level].circles;
    var timeBetweenCircles = this.levels[this.level].timeBetweenCircles;
    var i;
    var deadCircles = [];

    this.levelText.setText("Level: " + level);

    this.circles.forEachDead(function(circle, i){
      deadCircles.push(circle);
    }, this);

    for(i=0; i < deadCircles.length; i++){
      this.circles.remove(deadCircles[i]);
    }

    for(i = 0; i < circlesCount; i++){
      this.game.time.events.add(timeBetweenCircles * (i + 1), this.createCircle, this);
    }

  },

  startNextLevel: function(){
    this.startLevel(this.level + 1);
  },

	update: function () {

		//	Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
    

    console.log(this.circles.countDead());
    if(this.circles.countDead() === this.levels[this.level].circles) {
      this.startNextLevel();
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

    console.log("MISS");
    circle.kill();
    circle.game.updateScore(-5);
    circle.game.misses += 1;
    if(circle.game.misses > 3) {
      circle.game.quitGame();
    }
  },

  onCircleInputUp: function(circle, pointer){
    circle.growTween.stop();
    circle.shrinkTween.stop();
    circle.kill();
    this.updateScore(+5);
  },

  onBackgroundInputUp: function(background, pointer){
    this.updateScore(-10);
  },

  updateScore: function(scoreChange){
    BasicGame.score += scoreChange;
    this.scoreText.setText("Score: " + BasicGame.score);
  }

};
