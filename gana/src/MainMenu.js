
BasicGame.MainMenu = function (game) {

	this.music = null;
	this.playButton = null;

};

BasicGame.MainMenu.prototype = {

	create: function () {

		//	We've already preloaded our assets, so let's kick right into the Main Menu itself.
		//	Here all we're doing is playing some music and adding a picture and button
		//	Naturally I expect you to do something significantly better :)
		this.stage.backgroundColor = "#FFFFFF";
		this.music = this.add.audio('titleMusic');
		//this.music.play();

		//this.add.sprite(0, 0, 'titlepage');

		this.playButton = this.add.button(0, 0, 'playButton', this.startGame, this);
		BasicGame.setOffsetCentre(this.playButton,100);
		BasicGame.startX=this.game.world.centerX;
		BasicGame.startY=this.game.world.centerY;
		BasicGame.startAnimation='front';

	},

	update: function () {

		//	Do some nice funky main menu effect here

	},

	startGame: function (pointer) {

		//	Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
		if(BasicGame.lives<=0){
			console.log('No tienes vidas');
			return;
		}
		this.music.stop();
		//	And start the actual game
		this.state.start('Game');

	}

};
