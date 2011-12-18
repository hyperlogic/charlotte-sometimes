ig.module(
	'game.main'
)
.requires(
	'impact.game',
	'impact.font',
    'game.levels.test_level',

    'game.entities.charlotte',
    'game.entities.daisy',
    'game.entities.block',
    'game.entities.faucet'
)
.defines(function(){

var WIDTH = 320;
var HEIGHT = 240;

MyGame = ig.Game.extend({

	// Load a font
	font: new ig.Font('media/04b03.font.png'),

	init: function () {
		ig.input.bind(ig.KEY.UP_ARROW, 'up');
		ig.input.bind(ig.KEY.DOWN_ARROW, 'down');
        ig.input.bind(ig.KEY.LEFT_ARROW, 'left');
		ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');
        ig.input.bind(ig.KEY.X, 'grab');

        this.loadLevel(LevelTest_level);

        this.charlotte = ig.game.getEntitiesByType('EntityCharlotte')[0];
	},

	update: function () {
		// Update all entities and backgroundMaps
		this.parent();

        // resort z order every frame.
        ig.game.sortEntitiesDeferred();

        // TODO: smooth follow scroll.
        this.screen.x = this.charlotte.pos.x - WIDTH/2;
        this.screen.y = this.charlotte.pos.y - HEIGHT/2;
	},

	draw: function () {
		// Draw all entities and backgroundMaps
		this.parent();


		// Add your own drawing code here
		var x = ig.system.width/2,
 		    y = ig.system.height/2;

		this.font.draw('Charlotte Sometimes..', x, y, ig.Font.ALIGN.CENTER);
	}
});

ig.main('#canvas', MyGame, 60, WIDTH, HEIGHT, 3);

});
