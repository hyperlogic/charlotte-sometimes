ig.module(
	'game.main'
)
.requires(
	'impact.game',
	'impact.font',
    'game.flow',

    'game.levels.level01',
    'game.levels.level02',
    'game.levels.level03',
    'game.levels.level04',
    'game.levels.level05',
    'game.levels.level06',

    'game.entities.charlotte',
    'game.entities.daisy',
    'game.entities.block',
    'game.entities.faucet',
    'game.entities.door'
)
.defines(function(){

MyGame = ig.Game.extend({

	// Load a font
	font: new ig.Font('media/04b03.font.png'),
    flow: null,

	init: function () {
		ig.input.bind(ig.KEY.UP_ARROW, 'up');
		ig.input.bind(ig.KEY.DOWN_ARROW, 'down');
        ig.input.bind(ig.KEY.LEFT_ARROW, 'left');
		ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');
        ig.input.bind(ig.KEY.X, 'use');

        this.levels = [LevelLevel01, LevelLevel02, LevelLevel03, LevelLevel04, LevelLevel05, LevelLevel06];

        ig.music.add('music/lace.mp3');
        ig.music.play();

        this.currentLevel = 0;
        this._startLevel(this.currentLevel);
	},

	update: function () {

		// Update all entities and backgroundMaps
		this.parent();

        // flow!
        this.flow.update();

        // resort z order every frame.
        ig.game.sortEntitiesDeferred();

        // TODO: smooth follow scroll.
        this.screen.x = this.charlotte.pos.x - ig.system.width/2;
        this.screen.y = this.charlotte.pos.y - ig.system.height/2;

        // check for end of level condition.
        if (!this.gameOver && this._levelComplete()) {
            this.gameOver = true;
            this._openAllDoors();
        }
	},

	draw: function () {
		// Draw all entities and backgroundMaps
		this.parent();

		// Add your own drawing code here
		var x = ig.system.width/2,
 		    y = ig.system.height/2;
	},

    _levelComplete: function () {
        var flowers = ig.game.getEntitiesByType('EntityDaisy');
        var flower;

        for (i = 0; i < flowers.length; i++) {
            flower = flowers[i];
            if (flower.water <= (flower.maxWater - 2)) {
                return false;
            }
        }

        // all flowers are watered!
        return true;
    },

    _openAllDoors: function () {
        var doors = ig.game.getEntitiesByType('EntityDoor');
        for (i = 0; i < doors.length; i++) {
            doors[i].open();
        }
    },

    endLevel: function () {
        console.log('endLevel!');

        // disable player control
        this.charlotte.disable();

        // TODO: fade to black...

        // load next level
        this._startLevel((this.currentLevel + 1) % this.levels.length);
    },

    _startLevel: function (levelNum) {
        this.currentLevel = levelNum;
        this.loadLevel(this.levels[levelNum]);
        this.gameOver = false;

        // find the player
        this.charlotte = ig.game.getEntitiesByType('EntityCharlotte')[0];

        // new flow buddy
        this.flow = new FlowBuddy();
    },
});

ig.main('#canvas', MyGame, 60, 320, 240, 2);

});
