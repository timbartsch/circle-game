
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
      { circles: 10, timeBetweenCircles: 1000}, //Level 0 
      { circles: 15, timeBetweenCircles: 900 }, //Level 1
      { circles: 20, timeBetweenCircles: 800 }, //Level 2
      { circles: 25, timeBetweenCircles: 700 }, //Level 3
      { circles: 30, timeBetweenCircles: 600 }, //Level 4
      { circles: 35, timeBetweenCircles: 500 }, //Level 5
      { circles: 40, timeBetweenCircles: 400 }, //Level 6
      { circles: 45, timeBetweenCircles: 300 }, //Level 7
      { circles: 50, timeBetweenCircles: 250 }, //Level 8
      { circles: 55, timeBetweenCircles: 200 }, //Level 9
      { circles: 60, timeBetweenCircles: 150 }, //Level 10 
    ];
};

BasicGame.Game.prototype = {

	create: function () {
    BasicGame.score = 0;
    this.misses = 0;
    this.level = 0;
    this.background = this.game.add.sprite(0, 0, "background");
    this.background.inputEnabled = true;
    this.background.events.onInputUp.add(this.onBackgroundInputUp, this);
    this.levelText = this.game.add.text(this.world.centerX, this.world.centerY, "0", BasicGame.levelTextStyle);
    this.levelText.anchor.setTo(0.5, 0.5);
    this.levelText.scale.setTo(0, 0);
    this.circles = this.game.add.group();
    this.scoreText = this.game.add.text(this.world.centerX, this.world.centerY, "0", BasicGame.scoreTextStyle);
    this.scoreText.anchor.setTo(0.5, 0.5);

    this.startLevel(0); 
	},

  onScoreTextShrinkComplete: function(){
    var tween = this.game.add.tween(this.levelText.scale)
      .to({x: 1, y: 1}, 1000, Phaser.Easing.Quadratic.InOut);
      tween.onComplete.add(this.onLevelTextGrowComplete, this)
    tween.start();
  },
  onLevelTextGrowComplete: function(){
    var tween = this.game.add.tween(this.levelText.scale)
      .to({x: 0, y: 0}, 1000, Phaser.Easing.Quadratic.InOut)
      .delay(1000);
      tween.onComplete.add(this.onLevelTextShrinkComplete, this)
    tween.start();
  },
  onLevelTextShrinkComplete: function(){
    var tween = this.game.add.tween(this.scoreText.scale)
      .to({x: 1, y: 1}, 1000, Phaser.Easing.Quadratic.InOut);
    tween.start();
  },

  startLevel: function(level){
    this.level = level;

    var circlesCount = this.levels[this.level].circles;
    var timeBetweenCircles = this.levels[this.level].timeBetweenCircles;
    var i;
    var deadCircles = [];
    var delay = 5000;

    this.levelText.setText(level);
    
    var scoreTextTween = this.game.add.tween(this.scoreText.scale)
      .to({x: 0, y: 0}, 1000, Phaser.Easing.Quadratic.InOut)
    scoreTextTween.onComplete.add(this.onScoreTextShrinkComplete, this);
    scoreTextTween.start();
    
    this.circles.forEachDead(function(circle, i){
      deadCircles.push(circle);
    }, this);

    for(i=0; i < deadCircles.length; i++){
      this.circles.remove(deadCircles[i]);
    }

    for(i = 0; i < circlesCount; i++){
      this.game.time.events.add((timeBetweenCircles * (i + 1)) + delay, this.createCircle, this);
    }

  },

  startNextLevel: function(){
    this.startLevel(this.level + 1);
  },

	update: function () {
    if(this.misses > 3) {
      this.quitGame();
    }
	},

	quitGame: function (pointer) {

		//	Here you should destroy anything you no longer need.
		//	Stop music, delete sprites, purge caches, free resources, all that good stuff.
    
		//	Then let's go back to the main menu.
    localStorage.setItem("score", BasicGame.score);
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

  killCircle: function(circle){
    circle.kill();
    if(this.circles.countDead() === this.levels[this.level].circles) {
      this.startNextLevel();
    }
  },

  onCircleShrinkEnd: function(pointer){
    var circle = this;

    circle.game.killCircle(circle);
    circle.game.misses += 1;

  },

  onCircleInputUp: function(circle, pointer){
    circle.growTween.stop();
    circle.shrinkTween.stop();
    this.killCircle(circle);
    this.updateScore(+1);
  },

  onBackgroundInputUp: function(background, pointer){
  },

  updateScore: function(scoreChange){
    BasicGame.score += scoreChange;
    this.scoreText.setText(BasicGame.score);
  }

};
