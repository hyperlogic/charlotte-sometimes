ig.module(
    'game.entities.block'
)
.requires(
    'impact.entity'
)
.defines(function () {

EntityBlock = ig.Entity.extend({

    // Set some of the properties
    collides: ig.Entity.COLLIDES.FIXED,
    type: ig.Entity.TYPE.B,

    size: {x: 16, y: 16},
    offset: {x: 0, y:16},

    health: 50,

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
        console.log('fill!');
    },

});

});
