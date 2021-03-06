BasicGame = {
    game:null,

    /* Here we've just got some global level vars that persist regardless of State swaps */
    score: 0,
    incrementNextLevel:5,
    /* If the music in your game needs to play through-out a few State swaps, then you could reference it here */
    music: null,
    /* Your game can check BasicGame.orientated in internal loops to know if it should pause or not */
    orientated: false,
    lives:40,
    level:0,
    isDie:false,
    timeGame:0,
    timerLevel:null,
    timeGameOver:12000,
    idUser:null,
    doorSelected:-1,
    doorLost:-1,
    startX:0,
    startY:0,
    startAnimation:'front',
    minCoinX:270,
    maxCoinX:990,
    minCoinY:250,
    maxCoinY:700,
    hostApi:'http://localhost',
    urlApi:'api/person/gamer_score/',
    styleTime : { font: "25px Georgia Bold Italic", fill: "#ffffff" ,align: "center"}
};

BasicGame.Boot = function (game) {
};

BasicGame.Boot.prototype = {

    init: function () {
        this.input.maxPointers = 1;
        this.stage.disableVisibilityChange = true;
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.setMinMax(462, 260, 1244, 768);
        //this.scale.setMinMax(260, 480, 768, 1024);
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        if (!this.game.device.desktop)
        {
            this.scale.forceOrientation(true, false);
            this.scale.setResizeCallback(this.gameResized, this);
            this.scale.enterIncorrectOrientation.add(this.enterIncorrectOrientation, this);
            this.scale.leaveIncorrectOrientation.add(this.leaveIncorrectOrientation, this);
        }

    },

    preload: function () {
        //  Here we load the assets required for our preloader (in this case a background and a loading bar)
        //this.load.image('preloaderBackground', 'images/preloader_background.jpg');
        this.load.image('preloaderBar', 'images/preloader_bar.png');
        BasicGame.game = this.game;
    },

    create: function () {
        this.state.start('Preloader');

    },
    gameResized: function (width, height) {
        //  This could be handy if you need to do any extra processing if the game resizes.
        //  A resize could happen if for example swapping orientation on a device or resizing the browser window.
        //  Note that this callback is only really useful if you use a ScaleMode of RESIZE and place it inside your main game state.

    },

    enterIncorrectOrientation: function () {
        BasicGame.orientated = false;
        document.getElementById('orientation').style.display = 'block';

    },

    leaveIncorrectOrientation: function () {

        BasicGame.orientated = true;
        document.getElementById('orientation').style.display = 'none';

    },



};
