//compare the user's state graph to the simulated graph by comparing the edges
function verifyUserPetrinet(simulationStates) {
    //for some reason the $variable is not inspectable, copy to a locala array/list
    var PNStates = $.extend([], $PNstates);
    var PNstateEdges = [];
    var simulationStateEdges = [];

    for (var index = 0; index < PNStates.length; index++) {
        var element = PNStates[index];
        var fromState = element.activePlaces;
        for (var j = 0; j < element.outgoingEdges.length; j++) {
            var nextPlaces = element.outgoingEdges[j].To.activePlaces;
            PNstateEdges.push("from state" + JSON.stringify(fromState) + " to state " + JSON.stringify(nextPlaces));
        }
    }

}