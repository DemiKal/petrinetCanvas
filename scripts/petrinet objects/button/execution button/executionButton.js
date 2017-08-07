class ExecutionButton extends Button {
    constructor(x, y, width, height, text) {
        super(x, y, width, height, text);

        this.defaultState = new ExecutionButtonDefaultState(this);
        this.edgePendingState = new ExecutionButtonEdgePendingState(this);
        this.selectionState = new ExecutionButtonSelectionState(this);
        this.executionState = new ExecutionButtonExecutionState(this);
        this.currentState = this.defaultState;
        this.helpMessage = this.AddHelpMessage("Click to execute your Petrinet.\n Click on the transitions to fire\ngreen means ready to fire");
        this.initEventHandlers();
    }
}