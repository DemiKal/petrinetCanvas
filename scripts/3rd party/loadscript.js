$LAB
    //3rd party
    //.script('scripts/3rd party/jquery-3.2.1.min.js').wait()
    .script("scripts/3rd party/ocanvas-2.8.9.js").wait()
    .script("scripts/3rd party/victor.js").wait()
    .script("scripts/3rd party/filesaver.js").wait()
    .script("scripts/3rd party/bson.js").wait()

    //misc
    .script("scripts/misc/popup.js").wait()
    .script("scripts/misc/logging.js").wait()
    .script("scripts/misc/achievementSystem.js").wait()

    .script("scripts/misc/menus/UI.js").wait()
    .script("scripts/misc/menus/mainMenu.js").wait()
    .script("scripts/misc/menus/playerstats.js").wait()
    .script("scripts/misc/menus/campaignMenu.js").wait()

    //command patterns
    .script("scripts/misc/Commands/Command.js").wait()
    .script("scripts/misc/Commands/CommandManager.js").wait()
    .script("scripts/misc/Commands/Implementation/AddNodeCommand.js").wait()
    .script("scripts/misc/Commands/Implementation/AddPlaceCommand.js").wait()
    .script("scripts/misc/Commands/Implementation/AddTransitionCommand.js").wait()
    .script("scripts/misc/Commands/Implementation/AddPNStateCommand.js").wait()
    .script("scripts/misc/Commands/Implementation/MoveNodeCommand.js").wait()
    .script("scripts/misc/Commands/Implementation/DeleteNodeCommand.js").wait()
    .script("scripts/misc/Commands/Implementation/AddEdgeCommand.js").wait()
    
    
    //canvas
    .script("scripts/canvas/states/canvasDefaultState.js").wait()
    .script("scripts/canvas/states/canvasEdgePendingState.js").wait()
    .script("scripts/canvas/states/canvasExecutionState.js").wait()
    .script("scripts/canvas/states/canvasSelectionState.js").wait()
    .script("scripts/canvas/canvas.js").wait()

    //petri net objects
    .script("scripts/petrinet objects/drawObject/drawObject.js").wait()
    .script("scripts/petrinet objects/drawObject/eventHandler.js").wait()
    .script("scripts/petrinet objects/button/button.js").wait()

    //buttons
    .script("scripts/petrinet objects/button/add edge button/states/addEdgeDefaultState.js").wait()
    .script("scripts/petrinet objects/button/add edge button/states/addEdgeEdgePendingState.js").wait()
    .script("scripts/petrinet objects/button/add edge button/states/addEdgeExecutionState.js").wait()
    .script("scripts/petrinet objects/button/add edge button/states/addEdgeSelectionState.js").wait()
    .script("scripts/petrinet objects/button/add edge button/addEdgeButton.js").wait()

    .script("scripts/petrinet objects/button/add place button/states/addPlaceDefaultState.js").wait()
    .script("scripts/petrinet objects/button/add place button/states/addPlaceEdgePendingState.js").wait()
    .script("scripts/petrinet objects/button/add place button/states/addPlaceExecutionState.js").wait()
    .script("scripts/petrinet objects/button/add place button/states/addPlaceSelectionState.js").wait()
    .script("scripts/petrinet objects/button/add place button/addPlaceButton.js").wait()

    .script("scripts/petrinet objects/button/add transition button/states/addTransitionDefaultState.js").wait()
    .script("scripts/petrinet objects/button/add transition button/states/addTransitionEdgePendingState.js").wait()
    .script("scripts/petrinet objects/button/add transition button/states/addTransitionExecutionState.js").wait()
    .script("scripts/petrinet objects/button/add transition button/states/addTransitionSelectionState.js").wait()
    .script("scripts/petrinet objects/button/add transition button/addTransitionButton.js").wait()

    .script("scripts/petrinet objects/button/execution button/states/executionButtonDefaultState.js").wait()
    .script("scripts/petrinet objects/button/execution button/states/executionButtonEdgePendingState.js").wait()
    .script("scripts/petrinet objects/button/execution button/states/executionButtonExecutionState.js").wait()
    .script("scripts/petrinet objects/button/execution button/states/executionButtonSelectionState.js").wait()
    .script("scripts/petrinet objects/button/execution button/executionButton.js").wait()

    .script("scripts/petrinet objects/node/node.js").wait()
    .script("scripts/petrinet objects/node/nodeHandler.js").wait()

    .script("scripts/petrinet objects/petrinetState/petrinetState.js").wait()
    .script("scripts/petrinet objects/petrinetState/states/PS_defaultState.js").wait()
    .script("scripts/petrinet objects/petrinetState/states/PS_edgePendingState.js").wait()
    .script("scripts/petrinet objects/petrinetState/states/PS_executionState.js").wait()
    .script("scripts/petrinet objects/petrinetState/states/PS_selectionState.js").wait()
    .script("scripts/petrinet objects/petrinetState/states/PS_simulationState.js").wait()

    .script("scripts/petrinet objects/place/place.js").wait()
    .script("scripts/petrinet objects/place/states/placeDefaultState.js").wait()
    .script("scripts/petrinet objects/place/states/placeEdgePendingState.js").wait()
    .script("scripts/petrinet objects/place/states/placeExecutionState.js").wait()
    .script("scripts/petrinet objects/place/states/placeSelectionState.js").wait()
    .script("scripts/petrinet objects/place/states/placeSimulationState.js").wait()

    .script("scripts/simulation/simulation.js").wait()
    .script("scripts/simulation/simVerification.js").wait()
    .script("scripts/simulation/petriStateSim.js").wait()
    .script("scripts/simulation/transSim.js").wait()

    .script("scripts/petrinet objects/transition/transition.js").wait()
    .script("scripts/petrinet objects/transition/states/transitionEdgePendingState.js").wait()
    .script("scripts/petrinet objects/transition/states/transitionExecutionState.js").wait()
    .script("scripts/petrinet objects/transition/states/transitionSelectionState.js").wait()
    .script("scripts/petrinet objects/transition/states/transitionDefaultState.js").wait()
    .script("scripts/petrinet objects/transition/states/transitionSimulationState.js").wait()

    //old state vars soon to be deleted
    // .script('scripts/states/Istate.js').wait()
    // .script('scripts/states/defaultState.js').wait()
    // .script('scripts/states/selectionState.js').wait()
    // .script('scripts/states/executionState.js').wait()
    // .script('scripts/states/edgePendingState.js').wait()
    // .script('scripts/states/reachabilityState.js').wait()
    // .script('scripts/states/state.js').wait()
    // .script('scripts/canvas/states/canvasDefaultState.js').wait()
    // .script('scripts/canvas/states/canvasExecutionState.js').wait()
    // .script('scripts/canvas/states/canvasSelectionState.js').wait()

    .script("scripts/states/stateManager.js").wait()

    .script("scripts/mycanvas.js").wait(function () {
        console.log("script loaded!");
    });
