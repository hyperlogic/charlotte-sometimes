ig.module(
    'game.entities.faucet'
)
.requires(
    'impact.entity',
    'game.entities.block'
)
.defines(function () {

EntityFaucet = ig.Entity.extend({

    classname: 'EntityFaucet',

    // Set some of the properties
    collides: ig.Entity.COLLIDES.FIXED,
    type: ig.Entity.TYPE.B,

    size: {x: 16, y: 16},
    offset: {x: 0, y:16},

    state: 'off',

    health: 50,
    engageObj: null,

    // Load an animation sheet
    animSheet: new ig.AnimationSheet('media/faucet-16x32.png', 16, 32),
    waterAnim: null,

    init: function (x, y, settings) {
        // Call the parent constructor
        this.parent(x, y, settings);

        this.zIndex = this.pos.y + 5; // sort-push it forward so the water will draw in front of near by blocks.

        // Add animations for the animation sheet
        this.addAnim('idle', 0.1, [0]);
        this.waterAnim = new ig.Animation(this.animSheet, 1, [1]);
        this.waterBlockAnim = new ig.Animation(this.animSheet, 1, [2]);
    },

    update: function () {
        this.vel.x = 0;
        this.vel.y = 0;
        this.parent();
    },

    isOn: function () {
        return this.state === 'on';
    },

    draw: function () {
        this.parent();
        // TODO: fix water splash on blocks
        if (this.state === 'on') {
            this.waterAnim.draw(this.pos.x - ig.game.screen.x + 16, this.pos.y - ig.game.screen.y - 16);
        }
        /* // TODO: REMOVE
        if (this.state === 'on') {
            if (this.engageObj && (this.engageObj instanceof EntityBlock)) {
                this.waterBlockAnim.draw(this.pos.x - ig.game.screen.x + 16, this.pos.y - ig.game.screen.y - 16);
            } else {
                this.waterAnim.draw(this.pos.x - ig.game.screen.x + 16, this.pos.y - ig.game.screen.y - 16);
            }
        }
        */
    },

    use: function (player) {
        this.state = 'on';
    },

    release: function (player) {
        this.state = 'off';
    },

    // return an array of neighbors we flow into
    // this.right, this.left, this.below & this.above will contain this entities neighbors.
    flow: function () {
        return (this.right && this.isOn()) ? [this.right] : [];
    },
});

});
