ig.module(
    'game.entities.block'
)
.requires(
    'impact.entity'
)
.defines(function () {

EntityBlock = ig.Entity.extend({

	// Load a font
	font: new ig.Font('media/04b03.font.png'),

    // Set some of the properties
    collides: ig.Entity.COLLIDES.FIXED,
    type: ig.Entity.TYPE.B,

    size: {x: 16, y: 16},
    offset: {x: 0, y:16},

    health: 50,
    maxWater: 100,
    water: 0,

    // Load an animation sheet
    animSheet: new ig.AnimationSheet('media/block-16x32.png', 16, 32),

    init: function (x, y, settings) {
        // Call the parent constructor
        this.parent(x, y, settings);

        // Add animations for the animation sheet
        this.addAnim('idle', 0.1, [0]);
        this.vel.x = 0;
        this.vel.y = 0;
    },

    update: function () {

        if (this.grabbed) {
            this.vel.x = this.reqVelX;
            this.vel.y = this.reqVelY;
        } else {
            this.vel.x = 0;
            this.vel.y = 0;
        }

        this.parent();
        this.zIndex = this.pos.y;

        if (this.water == this.maxWater) {
            var obj = this._objCheck();
            if (obj) {
                obj.fillWithWater();
            }
        }

        // drain water
        if (this.water > 0)
            this.water -= 1;
        else
            this.water = 0;
    },

    draw: function () {
        this.parent();
        this.font.draw(this.water.toString(), this.pos.x - ig.game.screen.x, this.pos.y - ig.game.screen.y, ig.Font.ALIGN.CENTER);
    },

    grab: function (player) {
        console.log('grab!');
        this.grabbed = true;
        this.collides = ig.Entity.COLLIDES.PASSIVE;
        this.reqVelX = 0;
        this.reqVelY = 0;
    },

    release: function () {
        console.log('release!');
        this.grabbed = false;
        this.collides = ig.Entity.COLLIDES.FIXED;
    },

    setVelRequest: function (velx, vely) {
        this.reqVelX = velx;
        this.reqVelY = vely;
    },

    fillWithWater: function () {
        this.water += 2;
        if (this.water > this.maxWater)
            this.water = this.maxWater;
    },

    _objCheck: function () {
        // check to see if there is a block on the right.
        var blocks = ig.game.getEntitiesByType('EntityBlock');
        var i, block;
        for (i = 0; i < blocks.length; i++) {
            block = blocks[i];
            if (this.touches(block) && (block.pos.x > this.pos.x) && Math.abs(this.pos.y - block.pos.y) < 8) {
                return block;
            }
        }
        var flowers = ig.game.getEntitiesByType('EntityDaisy');
        var flower;
        for (i = 0; i < flowers.length; i++) {
            flower = flowers[i];
            if (this.touches(flower) && (flower.pos.x > this.pos.x) && Math.abs(this.pos.y - flower.pos.y) < 8) {
                return flower;
            }
        }
        return null;
    },

});

});
