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

var HINT_DELAY = 0;

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

        var playerHasMoved = false;
        var playerHasUsed = false;
        var plantsWatered = [false, false, false, false, false, false];  // for all 6 levels
        var playerHasExited = [false, false, false, false, false, false];
        var playerHasGrabbedBlock = false;
        var playerHasMovedBlock = false;
        this.hints = [{ text: 'Use Arrow keys to move',
                        level: 0,
                        doneCheck: function () {
                            if (this.charlotte.sm.currentState.name == 'move') {
                                playerHasMoved = true;
                            }
                            return playerHasMoved;
                        }
                      },
                      { text: 'Move near the faucet and press x to use it.',
                        level: 0,
                        doneCheck: function () {
                            if (this.charlotte.sm.currentState.name == 'useFaucet') {
                                playerHasUsed = true;
                            }
                            return playerHasUsed;
                        }
                      },
                      { text: 'Hold the use key down until all plants are watered.',
                        level: 0,
                        doneCheck: function () {
                            if (this.gameOver) {
                                plantsWatered[0] = true;
                            }
                            return plantsWatered[0];
                        }
                      },
                      { text: 'A door has opened',
                        level: 0,
                        doneCheck: function () {
                            if (this.currentLevel > 0) {
                                playerHasExited[0] = true;
                            }
                            return playerHasExited[0];
                        }
                      },

                      // level1
                      { text: '',
                        level: 1,
                        doneCheck: function () {
                            if (this.gameOver) {
                                plantsWatered[1] = true;
                            }
                            return plantsWatered[1];
                        }
                      },
                      { text: 'A door has opened',
                        level: 1,
                        doneCheck: function () {
                            if (this.currentLevel > 1) {
                                playerHasExited[1] = true;
                            }
                            return playerHasExited[1];
                        }
                      },

                      // level2
                      { text: 'Stand next to a block and press x to grab it',
                        level: 2,
                        doneCheck: function () {
                            if (this.charlotte.sm.currentState.name == 'grabIdle') {
                                playerHasGrabbedBlock = true;
                            }
                            return playerHasGrabbedBlock;
                        }
                      },

                      { text: 'While holding x use the arrow keys to move the block.',
                        level: 2,
                        doneCheck: function () {
                            if (this.charlotte.sm.currentState.name == 'grabMove') {
                                playerHasMovedBlock = true;
                            }
                            return playerHasMovedBlock;
                        }
                      },

                      { text: '',
                        level: 2,
                        doneCheck: function () {
                            if (this.gameOver) {
                                plantsWatered[2] = true;
                            }
                            return plantsWatered[2];
                        }
                      },
                      { text: 'A door has opened',
                        level: 2,
                        doneCheck: function () {
                            if (this.currentLevel > 2) {
                                playerHasExited[2] = true;
                            }
                            return playerHasExited[2];
                        }
                      },

                      // level3
                      { text: '',
                        level: 3,
                        doneCheck: function () {
                            if (this.gameOver) {
                                plantsWatered[3] = true;
                            }
                            return plantsWatered[3];
                        }
                      },

                      { text: 'A door has opened',
                        level: 3,
                        doneCheck: function () {
                            if (this.currentLevel > 3) {
                                playerHasExited[3] = true;
                            }
                            return playerHasExited[3];
                        }
                      },

                      // level4
                      { text: '',
                        level: 4,
                        doneCheck: function () {
                            if (this.gameOver) {
                                plantsWatered[4] = true;
                            }
                            return plantsWatered[4];
                        }
                      },

                      { text: 'A door has opened',
                        level: 4,
                        doneCheck: function () {
                            if (this.currentLevel > 4) {
                                playerHasExited[4] = true;
                            }
                            return playerHasExited[4];
                        }
                      },

                      // level 5
                      { text: '',
                        level: 5,
                        doneCheck: function () {
                            if (this.gameOver) {
                                plantsWatered[5] = true;
                            }
                            return plantsWatered[5];
                        }
                      },

                      { text: 'A door has opened',
                        level: 5,
                        doneCheck: function () {
                            if (this.currentLevel != 5) {
                                playerHasExited[5] = true;
                            }
                            return playerHasExited[5];
                        }
                      },

                      { text: 'You WIN! Thank you for playing!',
                        level: 6,
                        doneCheck: function () {
                            return false;
                        }
                      },
                     ];
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
 		    y = ig.system.height - 10;

        if (this.hints.length > 0 && this.hintTimer.delta() > 0)
        {
            var hint = this.hints[0];
            this.font.draw(hint.text, x, y, ig.Font.ALIGN.CENTER);
            if (hint.doneCheck.apply(this, [])) {
                // dismiss the hint.
                this.hints.shift();
                this.hintTimer = new ig.Timer(HINT_DELAY);  // wait a bit before showing the next hint.
            }
        }
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

        // wait a bit before displaying the first hint.
        this.hintTimer = new ig.Timer(HINT_DELAY);
    },
});

ig.main('#canvas', MyGame, 60, 320, 240, 2);

});
