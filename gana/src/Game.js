
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
};

BasicGame.Game.prototype = {

	create: function () {

    this.game.stage.backgroundColor = '#2d2d2d';
		this.game.physics.startSystem(Phaser.Physics.P2JS);
    this.game.physics.p2.restitution = 0.1;
		this.spritebg=this.game.add.sprite(0,50,'floor');
    this.spritebg.width=this.game.world.width;
    this.spritebg.height=this.game.world.height;
		console.log("size:"+this.spritebg.width+" - "+this.spritebg.height);
    //  Sprite 1 will use the World (global) gravity
    //this.createBall();
    this.cgGhost = this.game.physics.p2.createCollisionGroup();
    this.cgCoins = this.game.physics.p2.createCollisionGroup();
    this.cgDoors = this.game.physics.p2.createCollisionGroup();
    BasicGame.isDie=false;
    this.timeGO=BasicGame.timeGameOver/1000;
    this.createBarTime();
    this.createDoors();
    this.createCoins();
    this.vorticek=this.game.add.sprite(-1000,-1000,'vorticed');
    this.createGhost();
    this.createBorder();
    this.createPauseGame();
    this.createMenuButtons();
    this.createTimerGame();
    //this.createStones();
    //this.createBarTop();
	},
  createBarTime: function(){
    let y=-370,scale=0.7;
    this.barLoad = this.game.add.sprite(0,0,'barLoad');
    this.barLoad.scale.setTo(scale,scale);
    BasicGame.setOffsetCentre(this.barLoad,y+6);
    this.barLoad.width=5;
    this.barAll = this.game.add.sprite(0,0,'barAll');
    this.barAll.scale.setTo(scale,scale);
    BasicGame.setOffsetCentre(this.barAll,y);
    this.increaseBar=(this.barAll.width-30)/((BasicGame.timeGameOver-1000)/1000);
    this.label_time = this.game.add.text(20, 0,BasicGame.timeToText(BasicGame.timeGame), BasicGame.styleTime);
    this.st = this.add.sprite(0, 0);
    this.st.addChild(this.label_time);
    BasicGame.setOffsetFromCentre(this.st,-(this.barAll.width/2)-140,y+15);
    this.label_timeGameOver = this.game.add.text(20, 0,--this.timeGO, BasicGame.styleTime);
    this.st2 = this.add.sprite(0, 0);
    this.st2.addChild(this.label_timeGameOver);
    BasicGame.setOffsetFromCentre(this.st2,(this.barAll.width/2)+10,y+20);
  },
  createDoors: function(){
    let scale=1.3,y=220;
    BasicGame.doorLost=BasicGame.getRandomInt(1,3);
    this.door1=this.game.add.sprite(this.game.world.centerX-230,y,'door1');
    this.enablePhysicsDoor(this.door1,1,scale);
    this.door2=this.game.add.sprite(this.game.world.centerX,y,'door2');
    this.enablePhysicsDoor(this.door2,2,scale);
    this.door3=this.game.add.sprite(this.game.world.centerX+230,y,'door3');
    this.enablePhysicsDoor(this.door3,3,scale);
  },
  enablePhysicsDoor(sprite,index,scale){
    sprite.frame=2;
    sprite.animations.add('open',[1,0],4,false);
    sprite.scale.setTo(scale,scale);
    sprite.isDoor=true;
    sprite.indexDoor=index;
    this.game.physics.p2.enable(sprite);
    sprite.body.static=true;
    sprite.body.setCircle(sprite.width/10);
    sprite.body.setCollisionGroup(this.cgCoins);
    sprite.body.collides([this.cgGhost]);
    if(BasicGame.doorLost===index){
      sprite.isLost=true;
    }
  },
  createGhost: function(){
    this.ghost=this.game.add.sprite(BasicGame.startX,BasicGame.startY,'ghost');
    this.ghost.frame=1;
    this.ghost.scale.setTo(1.3,1.3);
    this.game.physics.p2.enable(this.ghost);
    this.ghost.body.clearShapes();
    this.ghost.body.restitution=0;
		//this.bubble.body.loadPolygon('physdata1', 'donut90-thin');
    this.ghost.body.setCircle(this.ghost.width/12);
		this.ghost.body.onBeginContact.add(this.ghostCollision, this.ghost);
		//this.ghost.body.onEndContact.add(this.bubbleCollisionEnd, this);
		this.ghost.body.fixedRotation = true;
		this.ghost.myType = 'ghost';
		this.ghost.isPlayer = true;
    this.ghost.animations.add('front',[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14],10,true);
    this.ghost.animations.add('left',[15,16,17,18,19,20,21,22,23,24,25,26,27,28,29],10,true);
    this.ghost.animations.add('right',[30,31,32,33,34,35,36,37,38,39,40,41,42,43,44],10,true);
    this.ghost.animations.add('left-down',[45,46,47,48,49,50,51,52,53,54,55,56,57,58,59],10,true);
    this.ghost.animations.add('right-down',[60,61,62,63,64,65,66,67,68,69,70,71,72,73,74],10,true);
    this.ghost.animations.add('left-up',[75,76,77,78,79,80,81,82,83,84,85,86,87,88,89],10,true);
    this.ghost.animations.add('right-up',[90,91,92,93,94,95,96,97,98,99,100,101,102,103,104],10,true);
    this.ghost.animations.add('up',[105,106,107,108,109,110,111,112,113,114,115,116,117,118,119],10,true);
    this.ghost.animations.add('die',[120,121,122,123,124,125,126,127,128,129,130,131,132,133,134],10,true);
    this.ghost.body.setCollisionGroup(this.cgGhost);
    this.ghost.body.collides([this.cgCoins]);
    this.game.input.onDown.add(this.moveSprite, this);

    this.finishpoint=new Phaser.Pointer(this.game,1);
    this.ghost.animations.play(BasicGame.startAnimation);

  },
  createBorder: function (){
    var rectW=20;
    var width = this.game.world.width;
    var height = this.game.world.height;
    var borderBottom = this.game.add.bitmapData(width, rectW);
    borderBottom.ctx.beginPath();
    borderBottom.ctx.rect(0, 0, width, rectW);
    //borderBottom.ctx.fillStyle = '#ffffff';
    //borderBottom.ctx.fill();
    var spriteBorderBottom = this.game.add.sprite(this.game.world.centerX, height-(rectW/2)-40, borderBottom);
    spriteBorderBottom.anchor.setTo(0.5, 0.5);
    this.game.physics.p2.enable(spriteBorderBottom,false);
    spriteBorderBottom.body.static=true;
    spriteBorderBottom.body.setCollisionGroup(this.cgCoins);
    spriteBorderBottom.body.collides([this.cgGhost]);
    var borderLR = this.game.add.bitmapData(rectW, height);
    borderLR.ctx.beginPath();
    borderLR.ctx.rect(0, 0, rectW, this.game.world.height);
    //borderLR.ctx.fillStyle="#FFFFFF";
    //borderLR.ctx.fill();
    var spriteBorderLeft = this.game.add.sprite(165, this.game.world.centerY, borderLR);
    spriteBorderLeft.isLeftB=true;
    spriteBorderLeft.anchor.setTo(0.5, 0.5);
    this.game.physics.p2.enable(spriteBorderLeft,false);
    spriteBorderLeft.body.static=true;
    spriteBorderLeft.body.angle=19;
    spriteBorderLeft.body.setCollisionGroup(this.cgCoins);
    spriteBorderLeft.body.collides([this.cgGhost]);
    var spriteBorderRight = this.game.add.sprite(width-(rectW/2)-150, this.game.world.centerY, borderLR);
    spriteBorderRight.isRightB=true;
    spriteBorderRight.anchor.setTo(0.5, 0.5);
    this.game.physics.p2.enable(spriteBorderRight,false);
    spriteBorderRight.body.static=true;
    spriteBorderRight.body.angle=-19;
    spriteBorderRight.body.setCollisionGroup(this.cgCoins);
    spriteBorderRight.body.collides([this.cgGhost]);
    var spriteBorderTop = this.game.add.sprite(this.game.world.centerX, 150, borderBottom);
    spriteBorderTop.isTopB=true;
    spriteBorderTop.anchor.setTo(0.5, 0.5);
    this.game.physics.p2.enable(spriteBorderTop,false);
    spriteBorderTop.body.static=true;
    spriteBorderTop.body.setCollisionGroup(this.cgCoins);
    spriteBorderTop.body.collides([this.cgGhost]);

  },
  createBarTop:function(){
    var style = { font: "30px Arial Black", fill: "#ffffff" ,align: "center"};
    label_score = this.game.add.text(0, 0,"Puntaje 0", style);
    sb = this.game.add.sprite(120, 50);
    sb.addChild(label_score);
    var style = { font: "30px Arial Black", fill: "#ffffff" ,align: "center"};
    label_lives = this.game.add.text(0, 0,"Intentos 10", style);
    sb = this.game.add.sprite(500, 50);
    sb.addChild(label_lives);
    var graphics = this.add.graphics(0, 0);
    graphics.lineStyle(4, 0xFFFFFF);
    graphics.beginFill(0xFFFFFF,1);
    graphics.drawRoundedRect(this.game.world.centerX-52, 0, 125, 125,15);
    graphics.endFill();
    this.gameBorderAdds = this.add.sprite();
    this.gameBorderAdds.addChild(graphics);
    adsLogo=this.game.add.sprite(this.game.world.centerX-50,2,'adsLogo');
    adsLogo.scale.setTo(0.2,0.2);
  },
  createCoins: function(){
    var points=this.getCoinPoints();
    this.coins=[];
    for(var i=0;i<points.length;i++ ){
      let coin=this.game.add.sprite(points[i].x+50,points[i].y+50,'coin');
      coin.frame=1;
      coin.scale.setTo(1.2,1.2);
      //let coinMon=this.game.add.sprite(points[i].x,points[i].y,'coin');
      coin.isCoin=true;
      this.game.physics.p2.enable(coin,false);
      coin.body.clearShapes();
  		//this.bubble.body.loadPolygon('physdata1', 'donut90-thin');
      coin.body.setCircle(coin.width/2);
      coin.body.static=true;
      coin.animations.add('rotate',[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18],19,true);
      coin.body.setCollisionGroup(this.cgCoins);
      coin.body.collides([this.cgGhost,this.cgCoins]);
      coin.body.onBeginContact.add(this.contactBox,this);
      coin.animations.play('rotate');
      this.coins.push(coin);

    }
  },
  getCoinPoints: function(){
    return BasicGame.getPointsCoins(1);
  },
  contactBox:function(target){
    //target.sprite.visible=false;
    //target.sprite.body.destroy();
    //this.ghost.body.setZeroVelocity();
  },
  ghostCollision: function(objectHit, shapeA, shapeB, equation) {
    if(!objectHit||BasicGame.isDie){
      console.log("colllllision");
      this.body.setZeroVelocity();
      return;
    }
		if (objectHit.sprite.isCoin) {
      objectHit.sprite.body.velocity.y=0;
      objectHit.sprite.body.velocity.x=0;
      objectHit.sprite.visible=false;
      objectHit.sprite.body.destroy();
      this.body.setZeroVelocity();
      this.body.velocity.y=0;
      this.body.velocity.x=0;
      BasicGame.incrementScore(1);
      return;
		}
    if(objectHit.sprite.isDoor){
      BasicGame.Game.prototype.nextLevel(objectHit,this);
    }
	},
  moveSprite: function(pointer) {
       console.log("pointer X = " + pointer.x);
       console.log("pointer Y = " + pointer.y);
       if(this.paused)return;
       if(BasicGame.isDie)return;
       this.ghost.isWalking = true;
       //  300 = 300 pixels per second =moveSprite the speed the sprite will move at, regardless of the distance it has to travel
       var duration = (Phaser.Math.distance(this.ghost.x,this.ghost.y,pointer.x, pointer.y) / 800) * 1000;
       this.game.physics.arcade.moveToXY(this.ghost,pointer.x,pointer.y,0,duration);
      this. game.time.events.add(duration*2.5, function () {
          this.ghost.isWalking=false;
       }, this);
      this.finishpoint=pointer;
      this.ghost.animations.play(this.getAnimationGhost(this.ghost.x,this.ghost.y,pointer));
       //this.tween = this.game.add.tween(this.ghost.body.velocity).to({ x: this.mouseTargetX, y: this.mouseTargetY }, duration, Phaser.Easing.Linear.None, true);

   },
   getAnimationGhost: function(x,y,pointer){
     let angle = Math.atan2(pointer.y - y, pointer.x - x) * 180 / Math.PI;
     if(angle>15&&angle<75){return 'right-down'; }
     if(angle>=165||angle<=-165){ return 'left';}
     if(angle<15&&angle>-15){ return 'right';}
     if(angle>105&&angle<=165){ return 'left-down'; }
     if(angle>=75&&angle<=105){ return 'front';}
     if(angle>-165&&angle<-105){ return 'left-up';}
     if(angle<-15&&angle>-75){ return 'right-up';}
     if(angle<=-75&&angle>=-105){ return 'up';}
   },

  processPointerInput: function(){
    if(BasicGame.isDie){
      if(!(Math.abs(this.ghost.body.velocity.x)>15||Math.abs(this.ghost.body.velocity.y)>15)){
        this.ghost.body.velocity.x = this.ghost.body.velocity.x*1.05;
        this.ghost.body.velocity.y = this.ghost.body.velocity.y*1.05;
      }else{
        this.ghost.body.velocity.x = this.ghost.body.velocity.x/1.01;
        this.ghost.body.velocity.y = this.ghost.body.velocity.y/1.01;
      }
      return;
    }
    if (this.game.input.activePointer.isDown) {
      if(!(Math.abs(this.ghost.body.velocity.x)>10||Math.abs(this.ghost.body.velocity.y)>10)){
        this.ghost.body.velocity.x = this.ghost.body.velocity.x*1.05;
        this.ghost.body.velocity.y = this.ghost.body.velocity.y*1.05;
      }
    }
    if (this.game.input.activePointer.isUp) {
      this.ghost.body.velocity.x = this.ghost.body.velocity.x/1.05;
      this.ghost.body.velocity.y = this.ghost.body.velocity.y/1.05;
    }
    if(!this.ghost.isWalking){
      this.ghost.body.velocity.x = this.ghost.body.velocity.x/2;
      this.ghost.body.velocity.y = this.ghost.body.velocity.y/2;
    }
  },
  createTimerGame: function(){
    BasicGame.timerLevel =  this.game.time.create(false);
    BasicGame.timerLevel.loop(Phaser.Timer.SECOND, this.updateTimerLevel, this);
    BasicGame.timerLevel.start();
  },
  updateTimerLevel: function(){
    if(!navigator.onLine){
      this.flagConn=false;
      //this.pauseGame();
      //return;
    }
    if(BasicGame.timerLevel.ms>BasicGame.timeGameOver){
      this.timeGameOver();
      return;
    }
    this.barLoad.width=this.barLoad.width+this.increaseBar;
    this.flagConn=true;
    this.label_time.setText(BasicGame.timeToText(BasicGame.timeGame+BasicGame.timerLevel.ms));
    this.label_timeGameOver.setText(--this.timeGO);
  },
  timeGameOver: function(){
    BasicGame.isDie=true;
    BasicGame.timerLevel.pause();
    //BasicGame.setOffsetFromCentre(this.vorticek,0,20);
    this.destroyCoins();
    var killGhost = this.game.add.bitmapData(30, 30);
    killGhost.ctx.beginPath();
    killGhost.ctx.rect(0, 0, 30, 30);
    var spriteKillGhost = this.game.add.sprite(this.game.world.centerX-15, this.game.world.centerY+120, killGhost);
    //spriteBorderBottom.anchor.setTo(0.5, 0.5);
    this.game.physics.p2.enable(spriteKillGhost,false);
    spriteKillGhost.body.static=true;
    spriteKillGhost.body.restitution=0.1;
    spriteKillGhost.body.setCollisionGroup(this.cgCoins);
    spriteKillGhost.body.collides([this.cgGhost]);
    this.vorticek.animations.add('play',[0,1,2,3,4,5],6,true);
    this.vorticek.scale.setTo(4,4);
    this.vorticek.x=this.game.world.centerX-(this.vorticek.width/2);
    this.vorticek.y=this.game.world.centerY-(this.vorticek.height/2)+120;
    this.vorticek.animations.play('play');
    //var vorticekTwn = this.add.tween(this.vorticek).to( { width: this.game.world.width,height:this.game.world.height,x:0,y:0 }, 4000, Phaser.Easing.Linear.None, true, 0, -1, false);
    //BasicGame.setOffsetFromCentre(this.ghost,0,0);
    var duration = (Phaser.Math.distance(this.ghost.x,this.ghost.y,this.game.world.centerX, this.game.world.centerY) / 800) * 1000;
    this.game.physics.arcade.moveToXY(this.ghost,this.game.world.centerX, this.game.world.centerY+120,0,duration);
    this.ghost.animations.play('die');
    BasicGame.updateTimeGame(BasicGame.timerLevel.ms);
    this.game.time.events.add(4000, function () {
      this.ghost.body.setZeroVelocity();
       BasicGame.gameOver(this);
    }, this);
  },
  destroyCoins: function(){
    for(let i=0;i<this.coins.length;i++){
      this.coins[i].reset(-1000,-1000);
      console.log(this.coins[i]);
    }
  },
	update: function () {
    this.processPointerInput();

	},
  createMenuButtons: function(){
    let varY=20, scale=0.2;
    this.pauseButton=this.game.add.button(varY,varY,'menuButton',this.pauseGame,this);
    this.pauseButton.scale.setTo(scale,scale);
    this.livesButton=this.game.add.button(this.game.world.width-120,varY,'lifesButton',this.pauseGame,this);
    this.livesButton.scale.setTo(scale,scale);
    this.coinButton=this.game.add.button(this.game.world.width-120,varY+80,'coinButton',this.pauseGame,this);
    this.coinButton.scale.setTo(scale,scale);
  },
  createPauseGame: function(){
    this.paused=false;
    this.overlay=this.game.add.sprite(-1000,-1000,'overlay');
    this.unpauseButton=this.game.add.button(-1000,-1000,'playButton',this.unpauseGame,this);

  },
  pauseGame: function () {
    this.paused=true;
    this.game.physics.p2.pause();
    BasicGame.timerLevel.pause();
    BasicGame.setOffsetFromCentre(this.overlay,0,0);
    BasicGame.setOffsetFromCentre(this.unpauseButton,200,100);

  },
  unpauseGame: function(){
    this.overlay.cameraOffset.setTo(-1000,-1000);
    this.unpauseButton.cameraOffset.setTo(-1000,-1000);
    this.game.physics.p2.resume();
    BasicGame.timerLevel.resume();
    this.paused=false;
  },
  nextLevel: function(objectHit,that){
    that.game.physics.p2.pause();
    BasicGame.timerLevel.pause();
    BasicGame.updateTimeGame(BasicGame.timerLevel.ms);
    objectHit.sprite.animations.play('open');
    that.game.time.events.add(1000, function () {
        that.game.state.start('Transition');
     }, that);
    BasicGame.doorSelected=objectHit.sprite.indexDoor;
  },
	quitGame: function (pointer) {

		//	Here you should destroy anything you no longer need.
		//	Stop music, delete sprites, purge caches, free resources, all that good stuff.

		//	Then let's go back to the main menu.this.game.time.events.add(3000,function(){
      this.state.start('MainMenu');
	}
};
