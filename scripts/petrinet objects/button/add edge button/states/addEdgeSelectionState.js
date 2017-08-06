class AddEdgeSelectionState extends IEventHandler {
    constructor(parent) { super(parent); }
    Click(event) {

        var line = $canvas.display.line({
            start: { x: $selected.center.x, y: $selected.center.y },
            end: { x: $canvas.mouse.x, y: $canvas.mouse.y },
            stroke: $edgeStroke,
            cap: "round"
        }).add();

        edgePending = line;

        //switch state
        $stateManager.SwitchToEdgePendingState();
       // state.currentState = state.edgePendingState;
    }

    DoubleClick(event) {

    }

    MouseEnter(event) {
    }

    MouseLeave(event) {

    }
}