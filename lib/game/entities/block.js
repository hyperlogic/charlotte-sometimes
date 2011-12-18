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

    // Types:
    // 0: --
    // 1: |
    // 2: -'
    // 3: '-
    // 4: -,
    // 5: ,-
    type: 0,

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
            console.log('block : ', this.name);
            var obj = this._objCheck();
            if (obj) {
                obj.fillWithWater(this);
            }
        }

        this._updateAnim();

        // drain water
        if (this.water > 0)
            this.water -= 1;
        else
            this.water = 0;
    },

    draw: function () {
        this.parent();
        //this.font.draw(this.water.toString(), this.pos.x - ig.game.screen.x, this.pos.y - ig.game.screen.y, ig.Font.ALIGN.CENTER);
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

    fillWithWater: function (source) {
        this.waterSource = source;
        this.water += 2;
        if (this.water > this.maxWater)
            this.water = this.maxWater;
    },

    _objCheck: function () {
        if (!this.waterSource)
            return null;

        // water flows from source
        var sourceDir = this._objDir(this.waterSource);
        console.log('   my source is ' + this.waterSource.name);
        console.log('   my source is to my ' + sourceDir);

        var blocks = ig.game.getEntitiesByType('EntityBlock');
        var i, block;
        for (i = 0; i < blocks.length; i++) {
            block = blocks[i];
            if (block.id === this.waterSource.id || block.id === this.id)
                continue;
            if (this._closeTo(block) && this._checkDir(block, sourceDir)) {
                console.log('    found block : ' + block.name);
                return block;
            }
        }
        var flowers = ig.game.getEntitiesByType('EntityDaisy');
        var flower;
        for (i = 0; i < flowers.length; i++) {
            flower = flowers[i];
            if (flower.id === this.waterSource.id)
                continue;
            if (this._closeTo(flower) && this._checkDir(flower, sourceDir)) {
                console.log('    found flower!');
                return flower;
            }
        }
        return null;
    },

    _checkDir: function (obj, sourceDir) {
        // check opposite sourceDir
        var objDir = this._objDir(obj);
        var type = this.type
        if (sourceDir === 'left') {
            if (type === 0) {
                return objDir === 'right';
            } else if (type === 1) {
                return false;
            } else if (type === 2) {
                return objDir === 'above';
            } else if (type === 3) {
                return false;
            } else if (type === 4) {
                return objDir === 'below';
            } else if (type === 5) {
                return false;
            }
        } else if (sourceDir == 'right') {
            if (type === 0) {
                return objDir === 'left';
            } else if (type === 1) {
                return false;
            } else if (type === 2) {
                return false;
            } else if (type === 3) {
                return objDir === 'above';
            } else if (type === 4) {
                return false;
            } else if (type === 5) {
                return objDir === 'below';
            }
        } else if (sourceDir == 'above') {
            if (type === 0) {
                return false;
            } else if (type === 1) {
                return objDir === 'below';
            } else if (type === 2) {
                return objDir === 'left';
            } else if (type === 3) {
                return objDir === 'right';
            } else if (type === 4) {
                return false;
            } else if (type === 5) {
                return false;
            }
        } else if (sourceDir == 'below') {
            if (type === 0) {
                return false;
            } else if (type === 1) {
                return objDir === 'above';
            } else if (type === 2) {
                return false;
            } else if (type === 3) {
                return false;
            } else if (type === 4) {
                return objDir === 'left';
            } else if (type === 5) {
                return objDir === 'right';
            }
        }
        return false;
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

    _objDir: function (obj) {
        var dx = obj.pos.x - this.pos.x;
        var dy = obj.pos.y - this.pos.y;
        var result;
        if (Math.abs(dx) > Math.abs(dy)) {
            result = dx > 0 ? 'right' : 'left';
        } else {
            result = dy > 0 ? 'below' : 'above';
        }

        console.log('    obj : ' + obj.name + ' is to my ' + result);
        return result;
    },

    _closeTo: function (obj) {
        var dx = obj.pos.x - this.pos.x;
        var dy = obj.pos.y - this.pos.y;
        var dist = Math.sqrt(dx * dx + dy * dy);

        console.log('    obj : ' + obj.name + ' is ' + dist + ' units away!');
        if (dist <= 18) {
            return true;
        }
    },

});

});
