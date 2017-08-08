class AddPlaceButton extends Button {
    constructor(x, y, width, height, text) {
        super(x, y, width, height, text);

        this.defaultState = new AddPlaceDefaultState(this);
        this.edgePendingState = new AddPlaceEdgePendingState(this);
        this.selectionState = new AddPlaceSelectionState(this);
        this.executionState = new AddPlaceExecutionState(this);
        this.currentState = this.defaultState;
        this.helpMessage = this.AddHelpMessage("Add a Place\nOr press [A].");

        this.initEventHandlers();
    }




}