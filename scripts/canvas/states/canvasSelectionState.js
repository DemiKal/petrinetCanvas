class canvasSelectionState {
    constructor() { }

    Click(event) {
        console.log('clicked canvas in selectState');
        $stateManager.SwitchToDefaultState();

        deselect();

    }
    DoubleClick(event) { console.log('DOUBLEclicked canvas ss') }
    MouseDown(event) { console.log('mousedown canvas ss'); }
    MouseUp(event) { }
    MouseMove(event) { }
    KeyDown(event) {
        //simulate clicking on adding edge button by pressing E
        if (event.which == 69)
            this.spawnPendingEdge();
    }

    KeyPress(event) { }
    KeyUp(event) { }

    spawnPendingEdge() {
        var line = $canvas.display.line({
            start: selected.current.center,
            end: { x: $canvas.mouse.x, y: $canvas.mouse.y },
            stroke: "11px #0aa",
            cap: "round"
        }).add();

        edgePending = line;

        $stateManager.SwitchToEdgePendingState();
    }
}

