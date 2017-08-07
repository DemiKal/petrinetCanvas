//compare the user's state graph to the simulated graph by comparing the edges
function verifyUserPetrinet(simulationStates) {
    //for some reason the global $variable is not inspectable, copy to a locala array/list
    var PNStates = $.extend([], $PNstates);
    var simulatedEdges = [];
    var simulationStateEdges = [];
    var signatureLookup = createLookupTable(PNStates);

    //var x = simulationStates[0].places;
    //var y = Object.keys(x)
    var sim2 = Signature(simulationStates[0]);
    var PNstateEdges = CreateStateEdgeList(PNStates);
    var PNsimulatedStateEdges = CreateStateEdgeList(simulationStates);

    //now compare the two datastructures and send feedback to the user
    compareSimulation(PNstateEdges, PNsimulatedStateEdges, signatureLookup);
}

function compareSimulation(PNstateEdges, PNsimulatedStateEdges, signatureLookup) {
    var correctStates = [];
    var incorrectStates = [];
    var x = PNsimulatedStateEdges.length;
    var missingEdges = {};

    for (var element in PNstateEdges) {
        if (PNstateEdges.hasOwnProperty(element)) {
            if (element in PNsimulatedStateEdges) {
                missingEdges[element] = []
                correctStates.push(element);
                var nextStates = PNstateEdges[element];
                var SimNextStates = PNsimulatedStateEdges[element];

                //check if the simulatedEdges contains all the user defined edges of the current state
                SimNextStates.forEach(function (toState) {
                    if (-1 < $.inArray(toState, nextStates)) {

                    }
                    else {
                        missingEdges[element].push(toState);

                    }


                }, this);
            }
            else incorrectStates.push(element)

        }
    }

    popupMessageMissingEdges(missingEdges, signatureLookup);

    for (var index = 0; index < correctStates.length; index++) {
        var element = correctStates[index];
        var currentStateObj = signatureLookup[element];
        currentStateObj.isCorrect = true;

        var outerEdges = currentStateObj.nextStates;
        var simulatedOuterEdges = PNsimulatedStateEdges[element];
        outerEdges.sort();
        simulatedOuterEdges.sort();

        compareEdges(element, outerEdges, simulatedOuterEdges, signatureLookup);
    }

    for (var index = 0; index < incorrectStates.length; index++) {
        var element = incorrectStates[index];
        var currentStateObj = signatureLookup[element];
        currentStateObj.isCorrect = false;

    }
}

function compareEdges(currentState, outerEdges, simulatedOuterEdges, signatureLookup) {
    for (var index = 0; index < outerEdges.length; index++) {
        var element = outerEdges[index];
        var petriDrawObject = signatureLookup[currentState];
        var i = $.inArray(element, simulatedOuterEdges)

        if (i != -1) {
            //find the edge of element where currentState -> element then paint it green or something
            var edge = findEdge(petriDrawObject, element);
            edge.stroke = $colorSettings.edge.correctStroke;
            edge.children[0].fill = $colorSettings.edge.correctArrow;
            edge.redraw();
        }
        else {
            var edge = findEdge(petriDrawObject, element);
            edge.stroke = $colorSettings.edge.incorrectStroke;
            edge.children[0].fill = $colorSettings.edge.incorrectArrow;
            //add messagebox
            var txt = "this edge is incorrect";
            CreatePopup({ x: edge.x, y: edge.y }, txt, false, edge);
            edge.redraw();
        }
    }
}

//create a popup message for the states that are missing edges
function popupMessageMissingEdges(missingEdges, signatureLookup) {
    var nrMissing = Object.keys(missingEdges).length;
    var PNStates = $.extend([], $PNstates);
    for (var key in missingEdges) {
        if (missingEdges.hasOwnProperty(key)) {
            var missingStates = missingEdges[key];
            var obj = signatureLookup[key];
            var text = "this state is missing " + nrMissing + " edge(s)!\n";
            var alreadyExisting = 0;
            PNStates.forEach(function (element) { if (Signature(element) in missingStates) alreadyExisting++; }, this);
            var nrOfnewStates = (nrMissing - alreadyExisting);
            text += "You have already made " + alreadyExisting + " states\nThat this one should point to.\nFigure out which one to connect!\n";
            text += "Therefore, " + nrOfnewStates + " new states should be made.";
            CreatePopup({ x: obj.x, y: obj.y }, text, false, obj);

        }
    }

}
function findEdge(petriDrawObject, id) {
    var edge = null;
    petriDrawObject.outgoingEdges.forEach(function (_edge) {
        if (_edge.To.id == id)
            edge = _edge;
    });
    return edge;
}

function Signature(petrinetState) {
    var sortedDict = SortDictionary(petrinetState.activePlaces);
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
function createLookupTable(PNStates) {
    var dict = {};
    for (var index = 0; index < PNStates.length; index++) {
        var element = PNStates[index];
        var sign = Signature(element);
        dict[sign] = element;
    }
    return dict;
}
function SortDictionary(dict) {
    var sortedDict = {};
    var sortedKeys = Object.keys(dict);
    sortedKeys.sort();
    sortedKeys.forEach(x => sortedDict[x] = dict[x]);
    return sortedDict;
}
