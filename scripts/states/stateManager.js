class StateManager {
    constructor() { }

    get currentState() {
        if (!nodes) return null;
        if (nodes.length < 1) return null;
        if (nodes.length > 0) return nodes[0].currentState.constructor;
    }

    SwitchToDefaultState() { ($nodes.concat([$canvas])).forEach(function (element) { element.currentState = element.defaultState; console.log('switched to default');}) };
    SwitchToSelectionState() { ($nodes.concat([$canvas])).forEach(function (element) { element.currentState = element.selectionState; console.log('switched to selection');}) };
    SwitchToExecutionState() {($nodes.concat([$canvas])).forEach(function (element) { element.currentState = element.executionState; console.log('switched to exec');}) };
    SwitchToEdgePendingState() { ($nodes.concat([$canvas])).forEach(function (element) { element.currentState = element.edgePendingState; console.log('switched to edgepending');}) };
    SwitchToSimulationState() { ($nodes.concat([$canvas])).forEach(function (element) { element.currentState = element.simulationState; }); console.log('switched to simulation');};

}