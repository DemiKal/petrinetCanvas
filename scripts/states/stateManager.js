class StateManager {
    constructor() { }

    get currentState() {
        if (!nodes) return null;
        if (nodes.length < 1) return null;
        if (nodes.length > 0) return nodes[0].currentState.constructor;
    }

    SwitchToDefaultState() { ($nodes.concat([$canvas])).forEach(function (element) { element.currentState = element.defaultState; console.log('switched to default'); }) };
    SwitchToSelectionState() { ($nodes.concat([$canvas])).forEach(function (element) { element.currentState = element.selectionState; console.log('switched to selection'); }) };
    SwitchToExecutionState() { ($nodes.concat([$canvas])).forEach(function (element) { element.currentState = element.executionState; console.log('switched to exec'); }) };
    SwitchToEdgePendingState() { ($nodes.concat([$canvas])).forEach(function (element) { element.currentState = element.edgePendingState; console.log('switched to edgepending'); }) };
    SwitchToSimulationState() { ($nodes.concat([$canvas])).forEach(function (element) { element.currentState = element.simulationState; }); console.log('switched to simulation'); };


    switchToExecState(button) {
        //switch state and button


        //disable drag & drop
        $nodes.forEach(function (element) { element.dragAndDrop(false); })

        //check each transition for fire eligibility (green = allowed to Fire())
        $nodes.forEach(function (node) {
            if (node instanceof Transition)
                node.readyCheck();
            else node.originalTokens = node.tokens;  //remember token amount before execution
        });
    }

    petriNetSimulation() {
        state.currentState = state.executionState;
        button.children[0].text = "Execution Mode";
        button.children[0].fill = "red";

        //create new currentStaet in the context of coverability graph. The new state has null as parent
        currentState = new PetriNetState();
        petrinetStates.push(currentState);
        console.log(currentState)
        console.log(currentState.id)
    }
}