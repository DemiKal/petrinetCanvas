class AddEdgeButton extends Button {
    constructor(x, y, width, height, text) {

        super(x, y, width, height, text);

        this.defaultState = new AddEdgeDefaultState(this);
        this.edgePendingState = new AddEdgePendingState(this);
        this.selectionState = new AddEdgeSelectionState(this);
        this.executionState = new AddEdgeExecutionState(this);
        this.currentState = this.defaultState;
       // this.helpMessage = CreatePopup(mousePos(), "Click this button or press [E]\nto create an edge from\nthe selected object.", true, this);
        this.helpMessage = this.AddHelpMessage("Click this button or press [E]\nto create an edge from\nthe selected object.");


        this.initEventHandlers();
    }




}