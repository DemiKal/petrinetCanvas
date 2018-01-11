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
    var nrIncorrectEdges = 0;
    var nrCorrectEdges = 0;
    for (var element in PNstateEdges) {
        if (PNstateEdges.hasOwnProperty(element)) {
            if (element in PNsimulatedStateEdges) {
                correctStates.push(element);
                var nextStates = PNstateEdges[element];
                var SimNextStates = PNsimulatedStateEdges[element];

                //check if the simulatedEdges contains all the user defined edges of the current state
                SimNextStates.forEach(function (toState) {
                    if (-1 == $.inArray(toState, nextStates)) 
                    element in missingEdges ?
                        missingEdges[element].push(toState) :
                        missingEdges[element] = [toState];
                });
            }
            else incorrectStates.push(element);
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

        var edgesRating = compareEdges(element, outerEdges, simulatedOuterEdges, signatureLookup);
        nrIncorrectEdges += edgesRating.incorrect;
        nrCorrectEdges += edgesRating.correct;
    }

    //every Incorrect state has by definition a wrong edge


    for (var index = 0; index < incorrectStates.length; index++) {
        var element = incorrectStates[index];
        var currentStateObj = signatureLookup[element];
        currentStateObj.isCorrect = false;
        var edgeCount = currentStateObj.outgoingEdges.length;
        nrIncorrectEdges += edgeCount;
    }


    // for (var fromUser in PNstateEdges) {
    //     if (PNstateEdges.hasOwnProperty(fromUser)) {
    //         var toUserArray = PNstateEdges[fromUser]; //array of states this one is pointing at
    //         if (toUserArray.length == 0) continue;

    //         for (var fromSim in PNsimulatedStateEdges) {
    //             if (PNsimulatedStateEdges.hasOwnProperty(fromSim)) {
    //                 var toSimulationArray = PNsimulatedStateEdges[fromSim];
    //                 for (var k = 0; k < toSimulationArray.length; k++) {
    //                     var toSim = toSimulationArray[k]; //string To
    //                     if (-1 != $.inArray(toSim, toUserArray))
    //                         nrCorrectEdges += 1;
    //                 }
    //             }


    //         }
    //     }
    // }

    summarize(missingEdges, correctStates, incorrectStates, PNsimulatedStateEdges, PNstateEdges, nrIncorrectEdges, nrCorrectEdges);
}

function summarize(missingEdges, correctStates, incorrectStates, PNsimulatedStateEdges, PNstateEdges, nrIncorrectEdges, nrCorrectEdges) {
    var nrOfTotalSimStates = Object.keys(PNsimulatedStateEdges).length;
    var nrOfTotalUserStates = Object.keys(PNstateEdges).length;
    var nrOfCorrStates = correctStates.length;
    var nrOfMissingStates = nrOfTotalSimStates - nrOfCorrStates;
    var stateRating = Math.round(nrOfCorrStates / nrOfTotalSimStates * 100);
    //this has to be a correct edge!
    //var nrOfUserEdges = getEdgeCount(getCorrectEdges(PNstateEdges, PNsimulatedStateEdges));
    var nrOfSimEdges = getEdgeCount(PNsimulatedStateEdges);
    var edgeRating = nrCorrectEdges / nrOfSimEdges * 100;
    //TODO: edgerating - wrong edges
    edgeRating = edgeRating > 100 ? Math.round(edgeRating - (edgeRating - 100)) : Math.round(edgeRating);
    var totalRating = Math.round(0.5 * (edgeRating + stateRating));

    //youve made nrOfCorrStates out of nrOfTotalSimStates => score
    var text = "Summary:\n";
    text += "You have made " + nrOfCorrStates + "/" + nrOfTotalSimStates + " correct state(s)\n";
    text += "You have made " + incorrectStates.length + " incorrect state(s)\n";
    text += "You are missing " + nrOfMissingStates + " state(s)\n";
    text += "this rates " + stateRating + "%\n";
    text += "You have made " + nrCorrectEdges + "/" + nrOfSimEdges + " correct edge(s)\n";
    text += "this rates " + edgeRating + "%\n";
    //text += "there are in total " + nrOfSimEdges + " edges. You made " + nrCorrectEdges + "correct edges, which rates " + edgeRating + "%\n";
    text += "Total score is avg of the above: " + totalRating + "%";

    CreateClickablePopup(mousePos(), text);
}

function getCorrectEdges(PNstateEdges, PNsimulatedStateEdges) {

}

function getEdgeCount(stateDict) {
    var length = 0;
    for (var key in stateDict) {
        if (stateDict.hasOwnProperty(key)) {
            var element = stateDict[key];
            length += element.length;
        }
    }
    return length;
}

function compareEdges(currentState, outerEdges, simulatedOuterEdges, signatureLookup) {
    var corr = 0;
    var incorr = 0;
    var edge;

    for (var index = 0; index < outerEdges.length; index++) {
        var element = outerEdges[index];
        var petriDrawObject = signatureLookup[currentState];
        var i = $.inArray(element, simulatedOuterEdges);

        if (i != -1) {
            //find the edge of element where currentState -> element then paint it green or something
            edge = findEdge(petriDrawObject, element);
            edge.stroke = $colorSettings.edge.correctStroke;
            edge.children[0].fill = $colorSettings.edge.correctArrow;
            edge.redraw();
            corr++;
        }
        else {
            edge = findEdge(petriDrawObject, element);
            edge.stroke = $colorSettings.edge.incorrectStroke;
            edge.children[0].fill = $colorSettings.edge.incorrectArrow;
            //add messagebox
            var txt = "this edge is incorrect";
            CreateClickablePopup({ x: edge.x, y: edge.y }, txt, edge);
            edge.redraw();
            incorr++;
        }
    }

    return { incorrect: incorr, correct: corr };
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
            CreateClickablePopup(mousePos(), text, obj);
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
        var fromSignature = Signature(fromState);
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
