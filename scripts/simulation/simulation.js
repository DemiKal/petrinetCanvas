//prepare the start the simulation
function initSimulation() {
    // for (let i = 0; i < $PNstates.length; i++) {
    //     const a = $PNstates[i].activePlaces;
    //     for (let j = 0; j < $PNstates.length; j++) {
    //         if (i == j) continue;
    //         const b = $PNstates[j].activePlaces;
       
    //         if (dictEq(a, b))
    //             return CreatePopupMessage(mousePos(), "No duplicate Petri net states!!");

    //     }
    // }

    var transitions = [];
    var simulationPlaces = {};
    var simulationStates = [];
    $.each($places, function (index, value) {
        //if (value.tokens > 0)
        simulationPlaces[value.name] = value.tokens;
    });

    $.each($transitions, function (index, value) {
        //if (value.tokens > 0)
        transitions.push(new TransSim(value));
    });

    var initialState = new petriStateSim(simulationPlaces);

    if (transitions.length > 0)
        $.each(transitions, function (i, trans) {
            Simulate(initialState, transitions, trans, simulationStates, 0);
        });
    else {
        simulationStates = [initialState];
        console.log("no transition to fire, only 1 state to reach");
    }
    verifyUserPetrinet(simulationStates);
}

//this is the simulation algorithm. Per node this will check each transition in the graph and try to 'fire'
//the transition. If there is a change in teh network/graph, it is a new state. Then recurse again in that new state.
//recurse until there are no new states to discover.
function Simulate(state, transitions, transition, simulationStates, depth) {
    console.log(depth);
    if (!stateAlreadySeen(state, simulationStates)) simulationStates.push(state);

    var newState = FireSim(state, transition);
    if (dictEq(newState.places, state.places)) return;
    if (stateAlreadySeen(newState, simulationStates)) {
        UpdateDuplicateState(state, newState, transition.name, simulationStates);
        return;
    }
    $.each(transitions, function (i, trans) {
        Simulate(newState, transitions, trans, simulationStates, depth + 1);
    });
}

//simulate firing of transition/place
function FireSim(state, transition) {
    var newPlaces = $.extend({}, state.places);
    //var newPlaces = state.places.copy();
    var readyToFire = true;

    //make > 0 variable later!  
    $.each(transition.incomingEdges, function (i, v) { if (state.places[i] <= 0) readyToFire = false; });

    //return same state -> break recursion
    if (!readyToFire) return state;

    $.each(transition.incomingEdges, function (i, v) { newPlaces[i] -= 1; });     //make > 0 variable later!  
    $.each(transition.outgoingEdges, function (i, v) { newPlaces[i] += 1; });
    //if nothing has changed, return 0

    var newstate = new petriStateSim(newPlaces, state, transition.name);
    //newstate.transition = transition.name;
    return newstate;

}
function UpdateDuplicateState(oldState, newState, transitionName, simulationStates) {
    for (var index = 0; index < simulationStates.length; index++) {
        var element = simulationStates[index];
        if (dictEq(newState.places, element.places)) {
            element.from[JSON.stringify(oldState.places)] = transitionName;
            oldState.to[JSON.stringify(newState.places)] = transitionName;
            return;
        }
    }
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

function stateAlreadySeen(state, simulationStates) {
    var alreadySeen = false;
    var dictStates = simulationStates.map(function (x) { return x.places; });
    var i = 0;
    $.each(dictStates, function (key, val) {

        if (dictEq(val, state.places))
            alreadySeen = true;
    });

    return alreadySeen;
}
function dictEq(a, b) {
    var eq = true;
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