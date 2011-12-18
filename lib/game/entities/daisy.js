ig.module(
    'game.entities.daisy'
)
.requires(
    'impact.entity'
)
.defines(function () {

EntityDaisy = ig.Entity.extend({

    classname: 'EntityDaisy',

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
    },

    draw: function () {
        this.parent();
        this.font.draw(this.water.toString(), this.pos.x - ig.game.screen.x, this.pos.y - ig.game.screen.y, ig.Font.ALIGN.CENTER);
    },

    // return an array of neighbors we flow into
    // this.right, this.left, this.below & this.above will contain this entities neighbors.
    flow: function () {
        this.water += 3;
        if (this.water > this.maxWater) {
            this.water = this.maxWater;
            var flowInto = [];
            if (this.left && this.left.classname == 'EntityDaisy')
                flowInto.push(this.left);
            if (this.right && this.right.classname == 'EntityDaisy')
                flowInto.push(this.right);
            if (this.above && this.above.classname == 'EntityDaisy')
                flowInto.push(this.above);
            if (this.below && this.below.classname == 'EntityDaisy')
                flowInto.push(this.below);
            return flowInto;
        }
        return [];
    },

    drainLife: function () {
        this.water -= 1;
        if (this.water < 0)
            this.water = 0;
    }

});

});
