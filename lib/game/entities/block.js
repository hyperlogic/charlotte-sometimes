ig.module(
    'game.entities.block'
)
.requires(
    'impact.entity'
)
.defines(function () {

EntityBlock = ig.Entity.extend({

    classname: 'EntityBlock',

    // Set some of the properties
    collides: ig.Entity.COLLIDES.FIXED,
    type: ig.Entity.TYPE.B,

    size: {x: 16, y: 16},
    offset: {x: 0, y:16},

    health: 50,
    maxWater: 100,
    water: 0,

    type: 0,   // 0: --  1: |  2: -'  3: '-  4: -,  5: ,-

    // Load an animation sheet
    animSheet: new ig.AnimationSheet('media/block-16x32.png', 16, 32),

    init: function (x, y, settings) {
        // Call the parent constructor
        this.parent(x, y, settings);

        if (settings && settings.type !== undefined)
            this.type = settings.type;

        // Add animations for the animation sheet
        this.addAnim('idle0', 0.1, [0 * 6 + this.type]);
        this.addAnim('idle1', 0.1, [1 * 6 + this.type]);
        this.addAnim('idle2', 0.1, [2 * 6 + this.type]);
        this.addAnim('idle3', 0.1, [3 * 6 + this.type]);
        this.addAnim('idle4', 0.1, [4 * 6 + this.type]);

        this._updateAnim();

        this.vel.x = 0;
        this.vel.y = 0;
    },

    update: function () {

        // block pulling 
        if (this.grabbed) {
            this.vel.x = this.reqVelX;
            this.vel.y = this.reqVelY;
        } else {
            this.vel.x = 0;
            this.vel.y = 0;
        }

        this.parent();
        this.zIndex = this.pos.y;

        this._updateAnim();

        // drain water
        if (this.water > 0)
            this.water -= 1;
        else
            this.water = 0;
    },

    draw: function () {
        this.parent();
    },

    grab: function (player) {
        //console.log('grab!');
        this.grabbed = true;
        this.collides = ig.Entity.COLLIDES.PASSIVE;
        this.reqVelX = 0;
        this.reqVelY = 0;
    },

    release: function () {
        //console.log('release!');
        this.grabbed = false;
        this.collides = ig.Entity.COLLIDES.FIXED;
    },

    setVelRequest: function (velx, vely) {
        this.reqVelX = velx;
        this.reqVelY = vely;
    },

    fillWithWater: function (source) {
        this.waterSource = source;
    },

    // return an array of neighbors we flow into
    // this.right, this.left, this.below & this.above will contain this entities neighbors.
    flow: function () {
        this.water += 3;
        if (this.water > this.maxWater) {
            this.water = this.maxWater;

            // only flow into neighbors when we are full.
            var flowInto = [];

            // 0: --  1: |  2: -'  3: '-  4: -,  5: ,-
            if (this.type == 0) {
                if (this.left)
                    flowInto.push(this.left);
                if (this.right)
                    flowInto.push(this.right);
            } else if (this.type == 1) {
                if (this.above)
                    flowInto.push(this.above);
                if (this.below)
                    flowInto.push(this.below);
            } else if (this.type == 2) {
                if (this.left)
                    flowInto.push(this.left);
                if (this.above)
                    flowInto.push(this.above);
            } else if (this.type == 3) {
                if (this.above)
                    flowInto.push(this.above);
                if (this.right)
                    flowInto.push(this.right);
            } else if (this.type == 4) {
                if (this.left)
                    flowInto.push(this.left);
                if (this.below)
                    flowInto.push(this.below);
            } else if (this.type == 5) {
                if (this.below)
                    flowInto.push(this.below);
                if (this.right)
                    flowInto.push(this.right);
            }
            return flowInto;
        }
        return [];
    },

    _updateAnim: function () {
        var percentFull = (this.water * 100) / this.maxWater;
        if (percentFull > 80) {
            this.currentAnim = this.anims.idle4;
        } else if (percentFull > 60) {
            this.currentAnim = this.anims.idle3;
        } else if (percentFull > 40) {
            this.currentAnim = this.anims.idle2;
        } else if (percentFull > 20) {
            this.currentAnim = this.anims.idle1;
        } else {
            this.currentAnim = this.anims.idle0;
        }
    },

});

});
