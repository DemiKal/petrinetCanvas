class State {
    constructor() {
        this.defaultState = new DefaultState();
        this.selectionState = new SelectionState();
        this.executionState = new ExecutionState();
        this.edgePendingState = new EdgePendingState();
        this.reachabilityState = new ReachabilityState();
        this.currentState = this.defaultState;
    }
}