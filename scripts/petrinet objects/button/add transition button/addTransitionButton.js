class AddTransition extends Button {
    constructor(x, y, width, height, text) {
        super(x, y, width, height, text);

        this.defaultState = new AddTransitionDefaultState(this);
        this.edgePendingState = new AddTransitionEdgePendingState(this);
        this.selectionState = new AddTransitionSelectionState(this);
        this.executionState = new AddTransitionExecutionState(this);
        this.currentState = this.defaultState;
        this.helpMessage = this.AddHelpMessage("Add a transition\nOr press [T]");

        this.initEventHandlers();

    }
}