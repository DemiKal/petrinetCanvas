class canvasEdgePendingState {
    constructor() { }

    Click(event) {
    }
    DoubleClick(event) { 
        //console.log('DOUBLEclicked canvas ss') 
    }
    MouseDown(event) {
        // console.log('mousedown canvas ss');
     }
    MouseUp(event) { }
    MouseMove(event) {
        edgePending.end = { x: $canvas.mouse.x, y: $canvas.mouse.y };
        edgePending.redraw();
    }

    KeyDown(event) {
        //press any button to remove the pending edge

        edgePending.remove();
        edgePending = null;

        $stateManager.SwitchToSelectionState();
        console.log("edge is deleted");
    }

    KeyPress(event) {
    }

    KeyUp(event) { }
}