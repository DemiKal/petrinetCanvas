class canvasSelectionState {
    constructor() { }

    Click(event) {
        deselect();
    }

    DoubleClick(event) {
        //console.log('DOUBLEclicked canvas ss') 
    }

    MouseDown(event) {
        //console.log('mousedown canvas ss'); 
    }

    MouseUp(event) { }
    MouseMove(event) { }
    KeyDown(event) {
        //call the default event first, then its own methods
        $canvas.defaultState.KeyDown(event);
        var key = String.fromCharCode(event.which);

        switch (key) {
            case "E":
                this.spawnPendingEdge();
                break;
            case ".":
                $selected.remove();
                break;
            default:
                break;
        }

    }

    KeyPress(event) { }
    KeyUp(event) { }

    spawnPendingEdge() {
        var line = $canvas.display.line({
            start: $selected.center,
            end: { x: $canvas.mouse.x, y: $canvas.mouse.y },
            stroke: $colorSettings.edge.stroke,
            cap: "round"
        }).add();

        edgePending = line;

        $stateManager.SwitchToEdgePendingState();
    }
}

