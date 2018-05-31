
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
		this.spritebg=this.game.add.sprite(0,0,'loadScreen');
    this.spritebg.width=this.game.world.width;
    this.spritebg.height=this.game.world.height;
		this.music = this.add.audio('titleMusic');
		//this.music.play();

		//this.add.sprite(0, 0, 'titlepage');
 		let distx=45,disty=351,dify=95, scale=0.48;
		this.jugarButton = this.add.button(distx, disty, 'jugarButton', this.startGame, this);
		this.jugarButton.scale.setTo(scale,scale);
		this.intentosButton = this.add.button(distx,disty+=dify,'intentosButton',this.startGame,this);
		this.intentosButton.scale.setTo(scale,scale);
		this.salirButton = this.add.button(distx,disty+=dify,'salirButton',this.startGame,this);
		this.salirButton.scale.setTo(scale,scale);
		//BasicGame.setOffsetCentre(this.playButton,100);
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
