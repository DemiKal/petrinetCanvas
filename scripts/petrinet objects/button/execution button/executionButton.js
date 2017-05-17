class ExecutionButton extends Button {
    constructor(x, y, width, height, text) {
        super(x, y, width, height, text);

        this.defaultState = new ExecutionButtonDefaultState(this);
        this.edgePendingState = new ExecutionButtonEdgePendingState(this);
        this.selectionState = new ExecutionButtonSelectionState(this);
        this.executionState = new ExecutionButtonExecutionState(this);
        this.currentState = this.defaultState;

        this.drawObject.bind("click tap", function (event) { this.classPointer.currentState.Click(event); });
        this.drawObject.bind("dblclick", function (event) { this.classPointer.currentState.DoubleClick(event); });
        this.drawObject.bind("mouseenter", function (event) { this.classPointer.currentState.MouseEnter(event); });
        this.drawObject.bind("mouseleave", function (event) { this.classPointer.currentState.MouseLeave(event); });

    }
}