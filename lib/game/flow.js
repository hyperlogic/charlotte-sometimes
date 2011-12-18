ig.module(
    'game.flow'
)
.requires(
    'impact.entity'
)
.defines(function () {

var TOUCHING_DISTANCE = 20;

FlowBuddy = ig.Class.extend({

    directions: ['right', 'left', 'below', 'above'],

    init: function () {

    },

    update: function () {
        this._linkEntities();
        this._flow();
    },

    _flow: function () {
        // do a breath first search from faucets.
        var entities = this._findFaucets();
        while (entities.length > 0) {
            entity = entities.shift();
            entity.flowMarked = true;  // to prevent back-tracking
            neighbors = entity.flow ? entity.flow() : [];
            for (i = 0; i < neighbors.length; i++) {
                if (!neighbors[i].flowMarked) {
                    entities.push(neighbors[i]);
                }
            }
        }
    },

    _linkEntities: function () {
        //console.log('_linkEntities()');
        var i, j, entity, entities, neighbors;

        // first unlink and unmark all entities.
        this.allEntities = ig.game.getEntitiesByType(ig.Entity);
        for (i = 0; i < this.allEntities.length; i++) {
            entity = this.allEntities[i];
            entity.marked = false;
            entity.flowMarked = false;
            for (j = 0; j < this.directions.length; j++) {
                entity[this.directions[i]] = null;
            }
        }

        // do a breath first search from faucets.
        entities = this._findFaucets();
        while (entities.length > 0) {
            entity = entities.shift();
            entity.marked = true;  // to prevent back-tracking
            neighbors = this._findAndAddNeighbors(entity);
            for (i = 0; i < neighbors.length; i++) {
                entities.push(neighbors[i]);
            }
        }
    },

    _findAndAddNeighbors: function (entity) {
        var i, j, dir, other, neighbors = [];
        for (i = 0; i < this.allEntities.length; i++) {
            other = this.allEntities[i];
            //console.log('   checking ' + entity.name + ' vs ' + other.name);
            if (other.classname == 'EntityCharlotte' || other.marked) {
                //console.log('        rejected, other.marked = ' + other.marked);
                continue;
            }
            if (this._areTouching(entity, other)) {
                // link the two
                var entityDir = this._objDir(entity, other);
                var otherDir = this._objDir(other, entity);
                entity[entityDir] = other;
                other[otherDir] = entity;
                neighbors.push(other);
                //console.log('        ' + entity.name + '[' + entityDir + '] -> ' + other.name + '[' + otherDir + ']');
            }
        }
        return neighbors;
    },

    _areTouching: function (a, b) {
        var dx = a.pos.x - b.pos.x;
        var dy = a.pos.y - b.pos.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        //console.log('        ' + a.name + ' and ' + b.name + ' are ' + dist + ' units apart.');
        return dist <= TOUCHING_DISTANCE;
    },

    _objDir: function (a, b) {
        var dx = b.pos.x - a.pos.x;
        var dy = b.pos.y - a.pos.y;
        var result;
        if (Math.abs(dx) > Math.abs(dy)) {
            result = dx > 0 ? 'right' : 'left';
        } else {
            result = dy > 0 ? 'below' : 'above';
        }
        return result;
    },

    _findFaucets: function () {
        var faucets = ig.game.getEntitiesByType('EntityFaucet');
        var results = [];
        var i;
        for (i = 0; i < faucets.length; i++) {
            if (faucets[i].isOn()) {
                results.push(faucets[i]);
            }
        }
        return results;
    },
});
});