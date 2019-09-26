function Hero(game, x, y) {
	Phaser.Sprite.call(this, game, x, y, 'hero');
	this.anchor.set(0.5, 0.5);
	this.game.physics.enable(this);
	this.body.collideWorldBounds = true;
	this.game.physics.arcade.checkCollision.right = false;
	
	//this.animations.add('move', [0, 1, 2, 3], 8, true);
}

Hero.prototype = Object.create(Phaser.Sprite.prototype);
Hero.prototype.constructor = Hero;

Hero.prototype.move = function (direction) {
	const SPEED = 150;
	this.body.velocity.x = direction * SPEED;
};

Hero.prototype.jump = function () {
	const JUMP_SPEED = 150;
	this.body.velocity.y = -JUMP_SPEED;
};

/* Hero.prototype.update = function () {
	this.animations.play('move');
}; */

PlayState = {};

window.onload = function () {
	let game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');
	game.state.add('play', PlayState);
	game.state.start('play', true, false, {level: 0});
};	

const LEVEL_COUNT = 2;

PlayState.init = function (data) {
	this.keys = this.game.input.keyboard.addKeys({
		left: Phaser.KeyCode.LEFT,
		right: Phaser.KeyCode.RIGHT,
		up: Phaser.KeyCode.UP
	});
	
	this.keys.up.onDown.add(function () {
		this.hero.jump();
	}, this);
	
	this.level = (data.level || 0) % LEVEL_COUNT;
};

PlayState.preload = function () {
	this.game.load.json('level:1', 'data/level_02.json');
	this.game.load.json('level:0', 'data/level_01.json');
	this.game.load.image('background', 'images/background.png');
	this.game.load.image('platform_1', 'images/platform_1.png');
	this.game.load.image('platform_2', 'images/platform_2.png');
	this.game.load.image('platform_3', 'images/platform_3.png');
	this.game.load.image('platform_4', 'images/platform_4.png');
	this.game.load.image('platform_5', 'images/platform_5.png');
	this.game.load.image('platform_6', 'images/platform_6.png');
	this.game.load.image('platform_7', 'images/platform_7.png');
	this.game.load.image('platform_8', 'images/platform_8.png');
	this.game.load.image('hero', 'images/new-hero.png');
	//this.game.load.spritesheet('hero', 'images/hero_move.png', 49, 52);

};

PlayState.create = function () {
	this.game.add.image(0, 0, 'background');
	this._loadLevel(this.game.cache.getJSON(`level:${this.level}`));

	this.hero.checkWorldBounds=true;
	this.hero.events.onOutOfBounds.add(function() {
		alert("Congratulations! Press enter key to start a new level");
		this.game.state.restart(true, false, {level: this.level+1});
	}, this);
};

PlayState.update = function () {
	this._handleCollisions();
	this._handleInput();
};

PlayState._handleCollisions = function () {
	//this.game.physics.arcade.collide(this.hero, this.platforms);
	this.game.physics.arcade.overlap(this.hero, this.platforms,
		this._onHeroVsPlatform, null, this);
};

 PlayState._onHeroVsPlatform = function (hero, platform) {
 	alert('Game over!');
	this.game.state.restart(true, false, {level: this.level});
};

PlayState._handleInput = function () {
	if (this.keys.left.isDown) {
		this.hero.move(-1);
	}
	
	else if (this.keys.right.isDown) {
		this.hero.move(1);
	}
	
	else {
		this.hero.move(0);
	}
};
PlayState._loadLevel = function (data) {
	//create all the groups/layers that we need
	this.platforms = this.game.add.group();
	data.platforms.forEach(this._spawnPlatform, this);
	//spawn hero
	this._spawnCharacters({hero: data.hero});
	
	//enable gravity
	const GRAVITY = 600;
	this.game.physics.arcade.gravity.y = GRAVITY;
};

PlayState._spawnCharacters = function (data) {
	this.hero = new Hero(this.game, data.hero.x, data.hero.y);
	this.game.add.existing(this.hero);
}

PlayState._spawnPlatform = function (platform) {
	let sprite = this.platforms.create(platform.x, platform.y, platform.image);
	this.game.physics.enable(sprite);
	sprite.body.allowGravity = false;
	sprite.body.immovable = true;
};
