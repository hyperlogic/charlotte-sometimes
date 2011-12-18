ig.module(
    'game.sm'
)
.requires()
.defines(function () {
StateMachine = ig.Class.extend({
    init: function () {
        this.host = null;
        this.states = {};
        this.currentState = null;
        this.previousState = null;
    },

    addState: function (state) {
        if (!this.currentState)
        {
            // make this the default state
            this.currentState = state;
            this.previousState = state;
        }
        this.states[state.name] = state;
    },

    changeState: function (name) {
        var nextState = this.states[name];
        console.log(this.currentState.name + ' -> ' + name);
        if (nextState) {
            // invoke exit callback
            if (this.currentState) {
                if (this.currentState.exit) {
                    this.currentState.exit.apply(this.host, [nextState.name]);
                }
            }

            // change states
            this.previousState = this.currentState;
            this.currentState = nextState;

            // invoke enter callback
            if (this.currentState.enter) {
                this.currentState.enter.apply(this.host, [this.previousState.name]);
            }
        }
    },

    update: function () {
        if (this.currentState && this.currentState.update)
            this.currentState.update.apply(this.host, []);
    },

    setHost: function (host) {
        this.host = host;
    },

});
});