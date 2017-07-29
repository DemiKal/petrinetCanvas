//compare the user's state graph to the simulated graph by comparing the edges
function verifyUserPetrinet(simulationStates) {
    //for some reason the global $variable is not inspectable, copy to a locala array/list
    var PNStates = $.extend([], $PNstates);
    var simulatedEdges = [];
    var simulationStateEdges = [];

    //var x = simulationStates[0].places;
    //var y = Object.keys(x)
    var sim2 = Signature(simulationStates[0]);
    var PNstateEdges = CreateStateEdgeList(PNStates);
    var PNsimulatedStateEdges = CreateStateEdgeList(simulationStates);

}

function Signature(petrinetState) {
    var keys = [];
    var sortedDict = {};
    var places = petrinetState.activePlaces;
    var sortedKeys = Object.keys(places);
    sortedKeys.sort();
    sortedKeys.forEach(x => sortedDict[x] = places[x]);

    var result = "";
    $.each(sortedDict, function (key, value) {
        result += value + "*" + key + " ";
    }, this);

    return result.slice(0, -1);
}

function CreateStateEdgeList(states) {
    var PNstateEdges = {};

    for (var index = 0; index < states.length; index++) {
        var fromState = states[index];
        var fromSignature = Signature(fromState)
        //if the state doesnt exist in the dict, create it with an empty list (next states) as value
        if (!(fromSignature in PNstateEdges)) PNstateEdges[fromSignature] = [];
        //copy so the get method doesnt get called more than once
        var outgoingEdges = fromState.outgoingEdges;
        for (var j = 0; j < outgoingEdges.length; j++) {
            var followingState = outgoingEdges[j].To;
            var followingStateSignature = Signature(followingState);
            PNstateEdges[fromSignature].push(followingStateSignature);
        }
    }
    return PNstateEdges;
}