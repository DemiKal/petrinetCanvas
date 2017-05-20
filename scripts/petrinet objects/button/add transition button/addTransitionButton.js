class AddTransition extends Button {
    constructor(x, y, width, height, text) {
        super(x, y, width, height, text);

        this.defaultState = new AddTransitionDefaultState(this);
        this.edgePendingState = new AddTransitionEdgePendingState(this);
        this.selectionState = new AddTransitionSelectionState(this);
        this.executionState = new AddTransitionExecutionState(this);
        this.currentState = this.defaultState;

        // this.drawObject.bind("click tap", function (event) { this.classPointer.currentState.Click(event); });
        // this.drawObject.bind("dblclick", function (event) { this.classPointer.currentState.DoubleClick(event); });
        // this.drawObject.bind("mouseenter", function (event) { this.classPointer.currentState.MouseEnter(event); });
        // this.drawObject.bind("mouseleave", function (event) { this.classPointer.currentState.MouseLeave(event); });
        this.initEventHandlers();

    }
}