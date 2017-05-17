class AddPlaceButton extends Button {
    constructor(x, y, width, height, text) {
        super(x, y, width, height, text);

        this.defaultState = new AddPlaceDefaultState(this);
        this.edgePendingState = new AddPlaceEdgePendingState(this);
        this.selectionState = new AddPlaceSelectionState(this);
        this.executionState = new AddPlaceExecutionState(this);
        this.currentState = this.defaultState;

        this.drawObject.bind("click tap", function (event) { this.classPointer.currentState.Click(event); });
        this.drawObject.bind("dblclick", function (event) { this.classPointer.currentState.DoubleClick(event); });
        this.drawObject.bind("mouseenter", function (event) { this.classPointer.currentState.MouseEnter(event); });
        this.drawObject.bind("mouseleave", function (event) { this.classPointer.currentState.MouseLeave(event); });


    }

    


}