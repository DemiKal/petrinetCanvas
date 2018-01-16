class ExecutionButtonExecutionState extends IEventHandler {
    constructor(parent) { super(parent); }
    Click(event) {

        //go back to default mode;  TODO: FIX
        deselect();
        console.log("clicked on exec button in exec state");

        //  this.parent.children[0].text = "Execution";
        //  this.parent.children[0].fill = "#fff";
        // state.currentState = state.defaultState;
        // event.stopPropagation();
        $transitions.forEach(t => t.ResetColors());
        $places.forEach(t => t.ResetColors());
        $places.forEach(p => p.tokens = p.originalTokens);
        $nodes.forEach(n => n.AddDragAndDrop());

        this.parent.namePlate.fill = "white";
        this.parent.namePlate.redraw();

        $stateManager.SwitchToDefaultState();
    }

    DoubleClick(event) { }

    MouseEnter(event) {
        this.parent.fillColor("orange");
    }

    MouseLeave(event) {
        this.parent.fillColor("black");
    }
}

