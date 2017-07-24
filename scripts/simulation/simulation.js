simulationStates = [];
class TransSim {
    constructor(transition) {
        var incomingEdges = {};
        var outgoingEdges = {};
        $.each(transition.incomingEdges, function (index, value) {
            var idx = value.From.name;
            incomingEdges[idx] = 1; //consumption amount, should be variable!
        });

        $.each(transition.outgoingEdges, function (index, value) {
            outgoingEdges[value.To.name] = 1; //consumption amount, should be variable!
        });
        this.incomingEdges = incomingEdges;
        this.outgoingEdges = outgoingEdges;
    }
}

function initSimulation() {

    transitions = [];
    var simulationPlaces = {};
    simulationStates = [];
    $.each($places, function (index, value) {
        //if (value.tokens > 0)
        simulationPlaces[value.name] = value.tokens;
    });

    $.each($transitions, function (index, value) {
        //if (value.tokens > 0)
        transitions.push(new TransSim(value));
    });

    var state = new petriStateSim(simulationPlaces);


    if (transitions != [])
        $.each(transitions, function (i, trans) {
            Simulate(state, transitions, trans);
        });
    else {
        simulationStates = state;
        console.log('no transition to fire, only 1 state to reach');
    }
    console.log(simulationStates);
    //then compare simstates to the user created states
}


function Simulate(state, transitions, transition) {
    simulationStates.push(state)
    var newState = FireSim(state, transition);

    if (dictEq(newState.places, state.places))
        return;

    $.each(transitions, function (i, trans) {
        Simulate(newState, transitions, trans);
    });


}

//simulate firing of transition/place
function FireSim(state, transition) {
    var newPlaces = $.extend({}, state.places);
    //var newPlaces = state.places.copy();
    var readyToFire = true;

    $.each(transition.incomingEdges, function (i, v) { if (state.places[i] <= 0) readyToFire = false; });     //make > 0 variable later!  

    if (!readyToFire) return new petriStateSim(newPlaces); //return same state -> break recursion

    $.each(transition.incomingEdges, function (i, v) { newPlaces[i] -= 1; });     //make > 0 variable later!  
    $.each(transition.outgoingEdges, function (i, v) { newPlaces[i] += 1; });
    //if nothing has changed, return 0

    return new petriStateSim(newPlaces);
}

$.fn.equals = function (compareTo) {
    if (!compareTo || this.length != compareTo.length) {
        return false;
    }
    for (var i = 0; i < this.length; ++i) {
        if (this[i] !== compareTo[i]) {
            return false;
        }
    }
    return true;
};

function dictEq(a, b) {
    var eq = true
    $.each(a, function (key, val) {
        if (b[key] != val)
            eq = false;
    });
    return eq;
    // for (var index = 0; index < a.length; index++) {
    //     var elementA = a[index];
    //     var elementB = b[index];

    // }
}