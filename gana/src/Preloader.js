
BasicGame.Preloader = function (game) {

	this.background = null;
	this.preloadBar = null;

	this.ready = false;

};

BasicGame.Preloader.prototype = {

	preload: function () {

		//	These are the assets we loaded in Boot.js
		//	A nice sparkly background and a loading progress bar
		//this.background = this.add.sprite(0, 0, 'preloaderBackground');
		this.preloadBar = this.add.sprite(this.world.centerX, this.world.centerY, 'preloaderBar');

		//	This sets the preloadBar sprite as a loader sprite.
		//	What that does is automatically crop the sprite from 0 to full-width
		//	as the files below are loaded in.this.world.centerY
		this.load.setPreloadSprite(this.preloadBar);

		//	Here we load the rest of the assets our game needs.
		//	As this is just a Project Template I've not provided these assets, the lines below won't work as the files themselves will 404, they are just an example of use.
		this.load.image('ilkke', 'images/MetalBall.png');
		this.load.image('bg-game','images/bg_ladrillos.png');
		this.load.image('pipe','images/PipeH.png');
		this.load.image('blockYellow','images/block_yellow.png');
		this.load.image('stones','images/Stones.png');
		this.load.image('bgScore','images/bg_score_lives.png');
		this.load.image('adsLogo','images/Logo_Munanqui.jpg');
		this.load.audio('titleMusic', ['audio/portalwin.mp3']);
		this.load.image('playButton','images/play_start.png');
		this.load.spritesheet('ghost','images/Personaje/sprites/ghost2.png',86.66,142.50);
		this.load.image('floor','images/Escenario/base_stage.png');
		this.load.image('floor2','images/Escenario/base_stage2.png');
		this.load.image('coin','images/Escenario/coin0.png');
		this.load.image('door1','images/Escenario/door1.png');
		this.load.image('door2','images/Escenario/doorb1.png');
		this.load.image('vorticew','images/Escenario/vorticew.png');
		this.load.image('vorticek','images/Escenario/vorticek.png');
		this.load.image('gift','images/Escenario/gift.png');
		this.load.image('overlay','images/overlay.png');
		//	+ lots of other required assets here

	},

	create: function () {

		//	Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
		this.preloadBar.cropEnabled = false;

	},

	update: function () {

		//	You don't actually need to do this, but I find it gives a much smoother game experience.
		//	Basically it will wait for our audio file to be decoded before proceeding to the MainMenu.
		//	You can jump right into the menu if you want and still play the music, but you'll have a few
		//	seconds of delay while the mp3 decodes - so if you need your music to be in-sync with your menu
		//	it's best to wait for it to decode here first, then carry on.

		//	If you don't have any music in your game then put the game.state.start line into the create function and delete
		//	the update function completely.
		if (this.cache.isSoundDecoded('titleMusic') && this.ready == false)
		{
			this.ready = true;
			this.state.start('MainMenu');
		}

	}

};
