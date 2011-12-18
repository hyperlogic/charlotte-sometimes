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

    engaageObj: null,

    init: function (x, y, settings) {
        // Call the parent constructor
        this.parent(x, y, settings);

        // Add animations for the animation sheet
        this.addAnim('idle', 0.1, [0]);
        this.addAnim('move', 0.1, [0]);
        this.addAnim('grabIdle', 0.1, [1]);
        this.addAnim('grabMove', 0.1, [1]);
        this.addAnim('useFail', 0.1, [2]);
        this.addAnim('use', 0.1, [3]);
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
                if (ig.input.state('use')) {
                    if (this._grabBlockCheck()) {
                        this.sm.changeState('grabIdle');
                        return;
                    } else if (this._useFaucetCheck()) {
                        this.sm.changeState('useFaucet');
                        return;
                    }
                    else {
                        this.sm.changeState('useFail');
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

                if (ig.input.state('use')) {
                    if (this._grabBlockCheck()) {
                        this.sm.changeState('grabMove');
                        return;
                    } else if (this._useFaucetCheck()) {
                        this.sm.changeState('useFaucet');
                        return;
                    }
                    else
                    {
                        this.sm.changeState('useFail');
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
                    if (this.engageObj) {
                        this.engageObj.grab(this);
                    }
                }
            },
            exit: function (nextState) {
                if (!nextState.match(/^grab/)) {
                    if (this.engageObj) {
                        this.engageObj.release(this);
                        this.engageObj = null;
                    }
                }
            },
            update: function () {
                if (!ig.input.state('use')) {
                    this.sm.changeState('idle');
                    return;
                }
                if (ig.input.state('up') || ig.input.state('down') || ig.input.state('left') || ig.input.state('right')) {
                    this.sm.changeState('grabMove');
                    return;
                }

                // move the block too!
                if (this.engageObj) {
                    this.engageObj.setVelRequest(0, 0);
                }
            }
        });

        // grabMove
        this.sm.addState({
            name: 'grabMove',
            enter: function (prevState) {
                if (!prevState.match(/^grab/)) {
                    if (this.engageObj) {
                        this.engageObj.grab(this);
                    }
                }
            },
            exit: function (nextState) {
                if (!nextState.match(/^grab/)) {
                    if (this.engageObj) {
                        this.engageObj.release(this);
                        this.engageObj = null;
                    }
                }
            },
            update: function () {

                if (!ig.input.state('use')) {
                    this.sm.changeState('move');
                    return;
                }
                if (!ig.input.state('up') && !ig.input.state('down') && !ig.input.state('left') && !ig.input.state('right')) {
                    this.sm.changeState('grabIdle');
                    return;
                }

                this._generalMove(PUSH_SPEED);

                // move the block too!
                if (this.engageObj) {
                    this.engageObj.setVelRequest(this.vel.x, this.vel.y);
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

        // useFail
        this.sm.addState({
            name: 'useFail',
            enter: function () {
                this.useFailTimer = new ig.Timer(0.5);
                var prevAnim = this.currentAnim;
                this.currentAnim = this.anims.useFail;
                this.currentAnim.flip.x = prevAnim.flip.x;
                this.vel.x = 0;
                this.vel.y = 0;
            },
            update: function () {
                if (this.useFailTimer.delta() > 0) {
                    this.sm.changeState('idle');
                    return;
                }
            }
        });

        // useFaucet
        this.sm.addState({
            name: 'useFaucet',
            enter: function () {
                var prevAnim = this.currentAnim;
                this.currentAnim = this.anims.use;
                this.currentAnim.flip.x = prevAnim.flip.x;
                this.vel.x = 0;
                this.vel.y = 0;

                if (this.engageObj) {
                    this.engageObj.use(this);
                }
            },
            exit: function () {
                if (this.engageObj) {
                    this.engageObj.release(this);
                }
            },
            update: function () {
                if (!ig.input.state('use')) {
                    this.sm.changeState('idle');
                    return;
                }
            }
        });
    },

    update: function () {
        this.sm.update();
        this._drainLife();
        this.parent();
        this.zIndex = this.pos.y;
    },

    _grabBlockCheck: function () {
        var blocks = ig.game.getEntitiesByType('EntityBlock');
        var i;
        for (i = 0; i < blocks.length; ++i) {
            if (this.touches(blocks[i])) {
                this.engageObj = blocks[i];
                return true;
            }
        }
        return false;
    },

    _useFaucetCheck: function () {
        var faucets = ig.game.getEntitiesByType('EntityFaucet');
        var i;
        for (i = 0; i < faucets.length; ++i) {
            if (this.touches(faucets[i])) {
                this.engageObj = faucets[i];
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
    },

    _drainLife: function () {
        var flowers = ig.game.getEntitiesByType('EntityDaisy');
        var flower, dx, dy;
        for (i = 0; i < flowers.length; i++) {
            flower = flowers[i];
            dx = this.pos.x - flower.pos.x;
            dy = this.pos.y - flower.pos.y;
            if (Math.sqrt(dx * dx + dy * dy) < 32) {
                flower.drainLife();
            }
        }
        return null;
    }

});

});