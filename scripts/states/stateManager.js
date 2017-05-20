class StateManager {
    constructor() { }
    get allDrawObjects() {
        return $nodes.concat([$canvas], $buttons)
    }

    get currentState() {
        if (!nodes) return null;
        if (nodes.length < 1) return null;
        if (nodes.length > 0) return nodes[0].currentState.constructor;
    }

    SwitchToDefaultState() {
        this.allDrawObjects.forEach(function (element) { element.currentState = element.defaultState; })
        console.log('switched to default')
    };
    SwitchToSelectionState() {
        this.allDrawObjects.forEach(function (element) { element.currentState = element.selectionState; });
        console.log('switched to selection')
    };
    SwitchToExecutionState() {
        this.allDrawObjects.forEach(function (element) { element.currentState = element.executionState; });
        console.log('switched to exec')

    };

    SwitchToEdgePendingState() {
        this.allDrawObjects.forEach(function (element) { element.currentState = element.edgePendingState; });

        console.log('switched to edgepending');
    };

    SwitchToSimulationState() {
        this.allDrawObjects.forEach(function (element) { element.currentState = element.simulationState; });
        console.log('switched to ');
    };


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
