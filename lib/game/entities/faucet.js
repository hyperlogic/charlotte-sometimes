ig.module(
    'game.entities.faucet'
)
.requires(
    'impact.entity',
    'game.entities.block'
)
.defines(function () {

EntityFaucet = ig.Entity.extend({

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
        if (this.state === 'on' && this.engageObj && this.engageObj.fillWithWater) {
            this.engageObj.fillWithWater();
        }
    },

    draw: function () {
        this.parent();
        if (this.state === 'on') {
            if (this.engageObj && (this.engageObj instanceof EntityBlock)) {
                this.waterBlockAnim.draw(this.pos.x - ig.game.screen.x + 16, this.pos.y - ig.game.screen.y - 16);
            } else {
                this.waterAnim.draw(this.pos.x - ig.game.screen.x + 16, this.pos.y - ig.game.screen.y - 16);
            }
        }
    },

    use: function (player) {
        // check for block.
        this.engageObj = this._objCheck();
        this.state = 'on';
    },

    release: function (player) {
        this.state = 'off';
        this.engageObj = null;
    },

    _objCheck: function () {
        // check to see if there is a block on the right.
        var blocks = ig.game.getEntitiesByType('EntityBlock');
        var i, block;
        for (i = 0; i < blocks.length; ++i) {
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
