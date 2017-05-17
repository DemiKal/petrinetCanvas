class AddEdgeSelectionState extends IEventHandler {
    constructor(parent) { super(parent); }
    Click(event) {

        var line = $canvas.display.line({
            start: { x: selected.current.center.x, y: selected.current.center.y },
            end: { x: $canvas.mouse.x, y: $canvas.mouse.y },
            stroke: "11px #0aa",
            cap: "round"
        }).add();

        selected.current;
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