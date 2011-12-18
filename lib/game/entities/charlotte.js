ig.module(
    'game.entities.charlotte'
)
.requires(
    'impact.entity',
    'impact.timer',
    'game.sm'
)
.defines(function () {

    var MOVE_SPEED = 100;
    var PUSH_SPEED = 50;

EntityCharlotte = ig.Entity.extend({

    // Set some of the properties
    collides: ig.Entity.COLLIDES.PASSIVE,
    type: ig.Entity.TYPE.A,
    checkAgainst: ig.Entity.TYPE.B,

    size: {x: 16, y: 16},
    offset: {x: 0, y: 16},
    health: 50,

    sm: new StateMachine(),

    // Load an animation sheet
    animSheet: new ig.AnimationSheet('media/charlotte-16x32.png', 16, 32),

    init: function (x, y, settings) {
        // Call the parent constructor
        this.parent(x, y, settings);

        // Add animations for the animation sheet
        this.addAnim('idle', 0.1, [0]);
        this.addAnim('move', 0.1, [0]);
        this.addAnim('grabIdle', 0.1, [1]);
        this.addAnim('grabMove', 0.1, [1]);
        this.addAnim('grabFail', 0.1, [2]);
        this.currentAnim = this.anims.idle;

        this.sm.setHost(this);

        // idle
        this.sm.addState({
            name: 'idle',
            enter: function () {
                var prevAnim = this.currentAnim;
                this.currentAnim = this.anims.idle;
                this.currentAnim.flip.x = prevAnim.flip.x;  // copy over the flip from the previous anim.
                this.vel.x = 0;
                this.vel.y = 0;
            },
            update: function () {
                if (ig.input.state('grab')) {
                    if (this._grabCheck()) {
                        this.sm.changeState('grabIdle');
                        return;
                    }
                    else {
                        this.sm.changeState('grabFail');
                        return;
                    }
                }
                if (ig.input.state('up') || ig.input.state('down') || ig.input.state('left') || ig.input.state('right')) {
                    this.sm.changeState('move');
                    return;
                }
            }
        });

        // move
        this.sm.addState({
            name: 'move',
            update: function () {

                if (ig.input.state('grab')) {
                    if (this._grabCheck()) {
                        this.sm.changeState('grabMove');
                        return;
                    }
                    else
                    {
                        this.sm.changeState('grabFail');
                        return;
                    }
                }
                if (!ig.input.state('up') && !ig.input.state('down') && !ig.input.state('left') && !ig.input.state('right')) {
                    this.sm.changeState('idle');
                    return;
                }

                this._generalMove(MOVE_SPEED);

                // animation
                if (this.vel.x > 0) {
                    this.currentAnim = this.anims.move;
                    this.currentAnim.flip.x = false;
                } else if (this.vel.x < 0) {
                    this.currentAnim = this.anims.move;
                    this.currentAnim.flip.x = true;
                }
            }
        });

        // grabIdle
        this.sm.addState({
            name: 'grabIdle',
            enter: function (prevState) {
                var prevAnim = this.currentAnim;
                this.currentAnim = this.anims.grabIdle;
                this.currentAnim.flip.x = prevAnim.flip.x;  // copy over the flip from the previous anim.
                this.vel.x = 0;
                this.vel.y = 0;

                if (!prevState.match(/^grab/)) {
                    if (this.grabbedBlock) {
                        this.grabbedBlock.grab(this);
                    }
                }
            },
            exit: function (nextState) {
                if (!nextState.match(/^grab/)) {
                    if (this.grabbedBlock) {
                        this.grabbedBlock.release(this);
                        this.grabbedBlock = null;
                    }
                }
            },
            update: function () {
                if (!ig.input.state('grab')) {
                    this.sm.changeState('idle');
                    return;
                }
                if (ig.input.state('up') || ig.input.state('down') || ig.input.state('left') || ig.input.state('right')) {
                    this.sm.changeState('grabMove');
                    return;
                }

                // move the block too!
                if (this.grabbedBlock) {
                    this.grabbedBlock.setVelRequest(0, 0);
                }
            }
        });

        // grabMove
        this.sm.addState({
            name: 'grabMove',
            enter: function (prevState) {
                if (!prevState.match(/^grab/)) {
                    if (this.grabbedBlock) {
                        this.grabbedBlock.grab(this);
                    }
                }
            },
            exit: function (nextState) {
                if (!nextState.match(/^grab/)) {
                    if (this.grabbedBlock) {
                        this.grabbedBlock.release(this);
                        this.grabbedBlock = null;
                    }
                }
            },
            update: function () {

                if (!ig.input.state('grab')) {
                    this.sm.changeState('move');
                    return;
                }
                if (!ig.input.state('up') && !ig.input.state('down') && !ig.input.state('left') && !ig.input.state('right')) {
                    this.sm.changeState('grabIdle');
                    return;
                }

                this._generalMove(PUSH_SPEED);

                // move the block too!
                if (this.grabbedBlock) {
                    this.grabbedBlock.setVelRequest(this.vel.x, this.vel.y);
                }

                // animation
                if (this.vel.x > 0) {
                    this.currentAnim = this.anims.grabMove;
                    this.currentAnim.flip.x = false;
                } else if (this.vel.x < 0) {
                    this.currentAnim = this.anims.grabMove;
                    this.currentAnim.flip.x = true;
                }

            }
        });

        // grabFail
        this.sm.addState({
            name: 'grabFail',
            enter: function () {
                this.grabFailTimer = new ig.Timer(0.5);
                var prevAnim = this.currentAnim;
                this.currentAnim = this.anims.grabFail;
                this.currentAnim.flip.x = prevAnim.flip.x;
                this.vel.x = 0;
                this.vel.y = 0;
            },
            update: function () {
                if (this.grabFailTimer.delta() > 0) {
                    this.sm.changeState('idle');
                    return;
                }
            }
        });
    },

    update: function () {
        this.sm.update();
        this.parent();
        this.zIndex = this.pos.y;
    },

    _grabCheck: function () {
        var blocks = ig.game.getEntitiesByType('EntityBlock');
        var i;
        for (i = 0; i < blocks.length; ++i) {
            if (this.touches(blocks[i])) {
                this.grabbedBlock = blocks[i];
                return true;
            }
        }
        return false;
    },

    _generalMove: function (speed) {
        var dx = 0, dy = 0, vx = 0; vy = 0;
        var len;
        if (ig.input.state('left'))
            dx -= 1;
        if (ig.input.state('right'))
            dx += 1;
        if (ig.input.state('up'))
            dy -= 1;
        if (ig.input.state('down'))
            dy += 1;

        len = Math.sqrt(dx * dx + dy * dy);
        if (len > 0) {
            vx = (dx / len) * speed;
            vy = (dy / len) * speed;
        }
        this.vel.x = vx;
        this.vel.y = vy;
    }

});

});