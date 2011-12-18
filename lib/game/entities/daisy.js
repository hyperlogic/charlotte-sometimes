ig.module(
    'game.entities.daisy'
)
.requires(
    'impact.entity'
)
.defines(function () {

EntityDaisy = ig.Entity.extend({

	// Load a font
	font: new ig.Font('media/04b03.font.png'),

    // Set some of the properties
    collides: ig.Entity.COLLIDES.FIXED,
    type: ig.Entity.TYPE.B,

    size: {x: 16, y: 16},
    offset: {x: 0, y:16},

    health: 50,
    water: 50,
    maxWater: 100,

    // Load an animation sheet
    animSheet: new ig.AnimationSheet('media/daisy-16x32.png', 16, 32),

    init: function (x, y, settings) {
        // Call the parent constructor
        this.parent(x, y, settings);

        this.zIndex = this.pos.y;

        // Add animations for the animation sheet
        this.addAnim('idle', 0.1, [0]);
    },

    update: function () {
        this.parent();

        if (this.water === this.maxWater) {
            var flowers = ig.game.getEntitiesByType('EntityDaisy');
            var flower;
            for (i = 0; i < flowers.length; i++) {
                flower = flowers[i];
                if (this.touches(flower) && this.water > flower.water) {
                    flower.fillWithWater();
                    this.water -= 1;
                }
            }
        }
    },

    draw: function () {
        this.parent();
        this.font.draw(this.water.toString(), this.pos.x - ig.game.screen.x, this.pos.y - ig.game.screen.y, ig.Font.ALIGN.CENTER);
    },

    fillWithWater: function () {
        this.water += 1;
        if (this.water > this.maxWater)
            this.water = this.maxWater;
    },

    drainLife: function () {
        this.water -= 1;
        if (this.water < 0)
            this.water = 0;
    }
});

});
