
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
		this.spritebg=this.game.add.sprite(0,0,'floor');
    this.spritebg.width=this.game.world.width;
    this.spritebg.height=this.game.world.height;
		console.log("size:"+this.spritebg.width+" - "+this.spritebg.height);
    //  Sprite 1 will use the World (global) gravity
    //this.createBall();
    this.cgGhost = this.game.physics.p2.createCollisionGroup();
    this.createCoins();
    this.createBorder();
    //this.createPipes();
    //this.createStones();
    //this.createBarTop();
    this.createGhost();



	},
  createGhost: function(){
    this.ghost=this.game.add.sprite(this.game.world.centerX,this.game.world.centerY,'ghost');
    this.ghost.scale.setTo(0.3,0.3);
    this.game.physics.p2.enable(this.ghost);
    this.ghost.body.clearShapes();
		//this.bubble.body.loadPolygon('physdata1', 'donut90-thin');
    this.ghost.body.setCircle(this.ghost.width/2);
		this.ghost.body.onBeginContact.add(this.ghostCollision, this.ghost);
		//this.ghost.body.onEndContact.add(this.bubbleCollisionEnd, this);
		this.ghost.body.fixedRotation = true;
		this.ghost.myType = 'ghost';
		this.ghost.isPlayer = true;
    this.game.input.onDown.add(this.moveSprite, this);
    this.finishpoint=new Phaser.Pointer(this.game,1);

  },
  createBorder: function (){
    var rectW=10;
    var width = this.game.world.width;
    var height = this.game.world.height;
    var borderBottom = this.game.add.bitmapData(width, rectW);
    borderBottom.ctx.beginPath();
    borderBottom.ctx.rect(0, 0, width, rectW);
    borderBottom.ctx.fillStyle = '#ffffff';
    borderBottom.ctx.fill();
    var spriteBorderBottom = this.game.add.sprite(this.game.world.centerX, height-(rectW/2), borderBottom);
    spriteBorderBottom.anchor.setTo(0.5, 0.5);
    this.game.physics.p2.enable(spriteBorderBottom,false);
    spriteBorderBottom.body.static=true;
    var borderLR = this.game.add.bitmapData(rectW, height);
    borderLR.ctx.beginPath();
    borderLR.ctx.rect(0, 0, rectW, this.game.world.height);
    borderLR.ctx.fillStyle="#FFFFFF";
    borderLR.ctx.fill();
    var spriteBorderLeft = this.game.add.sprite(80, this.game.world.centerY, borderLR);
    spriteBorderLeft.isLeftB=true;
    spriteBorderLeft.anchor.setTo(0.5, 0.5);
    this.game.physics.p2.enable(spriteBorderLeft,false);
    spriteBorderLeft.body.static=true;
    spriteBorderLeft.body.angle=19;
    var spriteBorderRight = this.game.add.sprite(width-(rectW/2)-80, this.game.world.centerY, borderLR);
    spriteBorderRight.isRightB=true;
    spriteBorderRight.anchor.setTo(0.5, 0.5);
    this.game.physics.p2.enable(spriteBorderRight,false);
    spriteBorderRight.body.static=true;
    spriteBorderRight.body.angle=-19;
    var spriteBorderTop = this.game.add.sprite(this.game.world.centerX, 120, borderBottom);
    spriteBorderTop.isTopB=true;
    spriteBorderTop.anchor.setTo(0.5, 0.5);
    this.game.physics.p2.enable(spriteBorderTop,false);
    spriteBorderTop.body.static=true;

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
    for(var i=0;i<points.length;i++ ){
      var coin=this.game.add.sprite(points[i].x,points[i].y,'coin');
      coin.isCoin=true;
      this.game.physics.p2.enable(coin,false);
      coin.body.static=true;
    }
  },
  getCoinPoints: function(){
    var points=[
      new BasicGame.Point(160,250,-30,true),
      new BasicGame.Point(450,250,15,false),
      new BasicGame.Point(670,280,-20,true),
      new BasicGame.Point(190,450,10,false),
      new BasicGame.Point(495,550,-60,false),
      new BasicGame.Point(650,450,40,false),
      new BasicGame.Point(120,650,-10,false),
      new BasicGame.Point(750,560,15,true),
      new BasicGame.Point(320,390,10,false)
    ];
    return points;
  },
  ghostCollision: function(objectHit, shapeA, shapeB, equation) {
    if(!objectHit){
      return;
    }
		if (objectHit.sprite.isLeftB) {
			this.body.setZeroVelocity();
		} else if (objectHit.sprite.isRightB) {
      this.body.setZeroVelocity();
		} else if (objectHit.sprite.isCoin) {
      objectHit.sprite.body.velocity.y=0;
      objectHit.sprite.body.velocity.x=0;
      objectHit.sprite.visible=false;
      objectHit.sprite.body.destroy();
      this.body.setZeroVelocity();
		} else if (objectHit.sprite.isBoxWin) {
      console.log("score:"+objectHit.sprite.valueWin);
			this.body.setZeroVelocity();
      objectHit.sprite.visible=false;
      objectHit.sprite.body.destroy();
		}
	},
  movePlayer: function(velocityIncrease) {

		if (this.paused) return;
		if (this.popped) return;
		var clickPoint = new Phaser.Point(this.game.input.activePointer.worldX, this.game.input.activePointer.worldY);
		var ghostPoint = new Phaser.Point(this.ghost.x, this.ghost.y);

		//console.log(Phaser.Point.angle(clickPoint, bubblePoint));
		var angleToBubble = Phaser.Point.angle(clickPoint, ghostPoint);
		var distanceToBubble = Phaser.Point.distance(clickPoint, ghostPoint);
		//console.log(angleToBubble);
		//console.log(distanceToBubble);
		var below = true;
		if (angleToBubble < 0) {
			below = false;
		}
		var left = true;
		if (Math.abs(angleToBubble) < 1.57079633) {
			left = false;
		}
		//console.log('below:' + below + '  left:' + left);
		var maxVelocity = 10;
		//var velocityIncrease = distanceToBubble;
		//var velocityIncrease = 10;
		var angleRatio;

		if (!below) {
			if (left) {
				angleRatio = (angleToBubble - 1.57079633) / 1.57079633;
				this.ghost.body.velocity.y = this.ghost.body.velocity.y - (velocityIncrease * (1 - angleRatio));
				this.ghost.body.velocity.x = this.ghost.body.velocity.x - (velocityIncrease * angleRatio);
			} else { //Right
				angleRatio = angleToBubble / 1.57079633;
				this.ghost.body.velocity.y = this.ghost.body.velocity.y - (velocityIncrease * angleRatio);
				this.ghost.body.velocity.x = this.ghost.body.velocity.x + (velocityIncrease * (1 - angleRatio));
			}
		} else { //above
			if (left) {
				angleRatio = (Math.abs(angleToBubble) - 1.57079633) / 1.57079633;
				this.ghost.body.velocity.y = this.ghost.body.velocity.y + (velocityIncrease * (1 - angleRatio));
				this.ghost.body.velocity.x = this.ghost.body.velocity.x - (velocityIncrease * angleRatio);
			} else { //Right
				angleRatio = Math.abs(angleToBubble) / 1.57079633;
				this.ghost.body.velocity.y = this.ghost.body.velocity.y + (velocityIncrease * angleRatio);
				this.ghost.body.velocity.x = this.ghost.body.velocity.x + (velocityIncrease * (1 - angleRatio));
			}
		}


	},
  moveSprite: function(pointer) {
       console.log("pointer X = " + pointer.x);
       console.log("pointer Y = " + pointer.y);

       //BORDERS OF THE GAME ROOM
       if(pointer.x < this.game.world.centerX ){
           this.mouseTargetX = -pointer.x;
       }else{
         this.mouseTargetX = pointer.x;
       }

       if(pointer.y > this.game.world.centerY){
           this.mouseTargetY = pointer.y;
       }else {
           this.mouseTargetY = -pointer.y;
       }
       console.log("pointer X = " + this.mouseTargetX);
       console.log("pointer Y = " + this.mouseTargetY);

       //TODO

       var length = 1000,
           points = [
               {x: 0, y: 0},
               {x: 0, y: length},
               {x: length, y: 10},
               {x: -length, y: -10},
               {x: 0, y: -length},
               {x: 0, y: 0}
           ];

       console.log(this.isPointInPoly(points, {x:this.mouseTargetY, y:this.mouseTargetY}));


       //this.hero.rotation = this.game.physics.angleToPointer(this.hero, pointer);
       this.ghost.isWalking = true;
       /***if(this.ghost.x < this.mouseTargetX) {
           this.ghost.scale.x = -1;
       } else {
           this.ghost.scale.x = 1;
       }
**/
       //  300 = 300 pixels per second = the speed the sprite will move at, regardless of the distance it has to travel
       var duration = (Phaser.Math.distance(this.ghost.x,this.ghost.y,pointer.x, pointer.y) / 600) * 1000;
       this.game.physics.arcade.moveToXY(this.ghost,pointer.x,pointer.y,0,duration);
       /***this. game.time.events.add(duration*2, function () {
          this.ghost.body.velocity.x = 0;
          this.ghost.body.velocity.y = 0;
       }, this);
**/
      this.finishpoint=pointer;
       //this.tween = this.game.add.tween(this.ghost.body.velocity).to({ x: this.mouseTargetX, y: this.mouseTargetY }, duration, Phaser.Easing.Linear.None, true);

   },

  processPointerInput: function(){
    if (this.game.input.activePointer.isDown) {
      //this.movePlayer(10);
    }
    if(this.ghost.x==this.finishpoint.x&&this.ghost.y==this.finishpoint.y){
      this.ghost.body.velocity.x = 0;
      this.ghost.body.velocity.y = 0;
    }
  },
	update: function () {
    this.processPointerInput();

	},
	quitGame: function (pointer) {

		//	Here you should destroy anything you no longer need.
		//	Stop music, delete sprites, purge caches, free resources, all that good stuff.

		//	Then let's go back to the main menu.this.game.time.events.add(3000,function(){
      this.state.start('MainMenu');
	},
  isPointInPoly :function(poly, pt){
        for(var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
            ((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y))
                && (pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x)
            && (c = !c);
        return c;
    }

};
