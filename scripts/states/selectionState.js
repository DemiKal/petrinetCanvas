class SelectionState extends Istate {
    constructor() { super(); }
    canvasDoubleClick() { }
    canvasClick() {
        deselect();
        state.currentState = state.defaultState;
    }

    placeClick(node, event) {
        // //switch to selected
        // selected.children[0].text = "Selected: " + node.name;
        // selected.current = node;
        // selected.redraw();
        // event.stopPropagation();
    }

    transitionClick(node, event) {
        // selected.children[0].text = "Selected: " + node.name;
        // selected.current = node;
        // selected.redraw();
        // event.stopPropagation();
    }

    AddnodeClick() { }

    AddEdgeClick() {
        var line = $canvas.display.line({
            start: { x: selected.current.center.x, y: selected.current.center.y },
            end: { x: $canvas.mouse.x, y: $canvas.mouse.y },
            stroke: "11px #0aa",
            cap: "round"
        }).add();

        selected.current;
        edgePending = line;

        //switch state
        state.currentState = state.edgePendingState;
    }

    keydownEvent(event) {
        if (event.which == 69) //simulate clicking on adding edge button by pressing E
            state.currentState.AddEdgeClick();
    }

    executionClick(button, event) {
        deselect();
        switchToExecState(button);
    }

    transitionDoubleClick(){}
}