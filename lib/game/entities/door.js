ig.module(
    'game.entities.door'
)
.requires(
    'impact.entity'
)
.defines(function () {

EntityDoor = ig.Entity.extend({

    classname: 'EntityDoor',

    // Set some of the properties
    collides: ig.Entity.COLLIDES.FIXED,
    type: ig.Entity.TYPE.B,

    size: {x: 32, y: 8},
    offset: {x: 0, y: 16},

    health: 50,

    // Load an animation sheet
    animSheet: new ig.AnimationSheet('media/door-32x32.png', 32, 32),

    init: function (x, y, settings) {
        // Call the parent constructor
        this.parent(x, y, settings);

        this.zIndex = this.pos.y;

        // Add animations for the animation sheet
        this.addAnim('idle', 0.1, [0]);
        this.addAnim('locked', 0.1, [4]);
        this.addAnim('open', 0.5, [0, 1, 2, 3], true);

        if (settings && settings.state && settings.state === 'locked') {
            this.lock();
        }
    },

    update: function () {
        if (this.openTimer && this.openTimer.delta() > 0) {
            if (this.touches(ig.game.charlotte)) {
                ig.game.endLevel();
            }
        }
        this.parent();
    },

    lock: function () {
        this.currentAnim = this.anims.locked;
        this.locked = true;
    },

    unlock: function () {
        this.currentAnim = this.anims.idle;
        this.locked = false;
    },

    open: function () {
        if (!this.locked && !this.openTimer) {
            this.openTimer = new ig.Timer(1.5);
            this.currentAnim = this.anims.open.rewind();
            this.collides = ig.Entity.COLLIDES.NONE;
        }
    }

});

});
