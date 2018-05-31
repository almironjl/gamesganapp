BasicGame.Transition = function (game) {

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
};
BasicGame.Transition.prototype={
  create: function(){
    this.game.stage.backgroundColor = '#2d2d2d';
		this.game.physics.startSystem(Phaser.Physics.P2JS);
    this.game.physics.p2.resume();
    this.cgVortices = this.game.physics.p2.createCollisionGroup();
    this.cgGhost = this.game.physics.p2.createCollisionGroup();
    this.createVortices();
		this.spritebg=this.game.add.sprite(0,0,'floor2');
    this.spritebg.width=this.game.world.width;
    this.spritebg.height=this.game.world.height;
    this.createGhostPos();
  },
  createGhostPos: function(){
    var x,y;
    if(BasicGame.doorSelected==1){
      this.ghost=this.game.add.sprite(220,this.game.world.height-80,'ghost');
      x=this.vortice1.x;
      y=160;
    }
    if(BasicGame.doorSelected==2){
      this.ghost=this.game.add.sprite(620,this.game.world.height-80,'ghost');
      x=this.vortice2.x;
      y=160;
    }
    if(BasicGame.doorSelected==3){
      this.ghost=this.game.add.sprite(1020,this.game.world.height-80,'ghost');
      x=this.vortice3.x;
      y=160;
    }
    this.ghost.animations.add('up',[105,106,107,108,109,110,111,112,113,114,115,116,117,118,119],10,true);
    this.ghost.frame=1;
    this.ghost.scale.setTo(1.3,1.3);
    this.game.physics.p2.enable(this.ghost);
    this.ghost.body.clearShapes();

    //this.ghost.body.onBeginContact.add(this.ghostCollisionVortice, this.ghost);
    this.ghost.body.setCircle(this.ghost.width/20);
    this.ghost.body.onBeginContact.add(this.ghostCollisionVortice, this.ghost);
    this.ghost.body.setCollisionGroup(this.cgGhost);
    this.ghost.body.collides([this.cgVortices]);
    this.ghost.animations.play('up');
    this.game.physics.arcade.moveToXY(this.ghost,x,y,0,1000);
  },
  moveGhost: function(){

  },
  createVortices: function(){
    this.vortice1=this.createEnablePhysicsVortice(310,140,1);
    this.vortice2=this.createEnablePhysicsVortice(620,140,2);
    this.vortice3=this.createEnablePhysicsVortice(940,140,3);
  },
  getTypeVortice:function(index){
    if(index===BasicGame.doorLost){
      return 'vorticek';
    }else{
      return 'vorticew';
    }
  },
  createEnablePhysicsVortice: function(x,y,index){
    let sprite=this.game.add.sprite(x,y,this.getTypeVortice(index));
    sprite.scale.setTo(0.5,0.5);
    sprite.isFail=(index===BasicGame.doorLost);
    this.game.physics.p2.enable(sprite,false);
    sprite.body.static=true;
    sprite.body.setCircle(sprite.width/10);
    sprite.body.setCollisionGroup(this.cgVortices);
    sprite.body.collides([this.cgGhost]);
    return sprite;

  },
  ghostCollisionVortice: function(objectHit, shapeA, shapeB, equation) {
    console.log("colllllision vortice");
    if(!objectHit){
      return;
    }
		if (objectHit.sprite.isFail) {
      this.body.setZeroVelocity();
      BasicGame.gameOver(this.game);
      return;
		}else{
      this.game.state.start('Game');
      if(BasicGame.doorSelected==1){
        BasicGame.startX=220;
      }else if(BasicGame.doorSelected==2){
        BasicGame.startX=620;
      }else{
        BasicGame.startX=1020;
      }
      BasicGame.startY=this.game.world.height-70;
      BasicGame.startAnimation='up';
      BasicGame.incrementScore(BasicGame.incrementNextLevel);
    }
	},
  update: function(){

  }
}
