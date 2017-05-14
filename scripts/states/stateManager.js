class StateManager {
    constructor() { }

    get currentState() {
        if (!nodes) return null
        if (nodes.length < 1) return null
        if (nodes.length > 0) return nodes[0].currentState.constructor;
    }

    SwitchToDefaultState() { $nodes.forEach(function (element) { element.currentState = element.defaultState; }) };
    SwitchToSelectionState() { $nodes.forEach(function (element) { element.currentState = element.selectionState; }) };
    SwitchToExecutionState() { $nodes.forEach(function (element) { element.currentState = element.executionState; }) };
    SwitchToEdgePendingState() { $nodes.forEach(function (element) { element.currentState = element.edgePendingState; }) };
    SwitchToSimulationState() { $nodes.forEach(function (element) { element.currentState = element.simulationState; }) };

}