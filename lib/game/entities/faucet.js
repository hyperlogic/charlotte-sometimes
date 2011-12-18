ig.module(
    'game.entities.faucet'
)
.requires(
    'impact.entity'
)
.defines(function () {

EntityFaucet = ig.Entity.extend({

    // Set some of the properties
    collides: ig.Entity.COLLIDES.FIXED,
    type: ig.Entity.TYPE.B,

    size: {x: 16, y: 16},
    offset: {x: 0, y:16},

    health: 50,

    // Load an animation sheet
    animSheet: new ig.AnimationSheet('media/faucet-16x32.png', 16, 32),

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
});

});
