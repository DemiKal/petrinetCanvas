class canvasEdgePendingState {
    constructor() { }

    Click(event) {
       // console.log('clicked canvas in edgepending state');
        // $stateManager.SwitchToDefaultState();

        // $nodes.forEach(function (item) {
        //     item.selected = false;
        // });

        // selected.current = null;
        // selected.name = "None selected";
        // selected.redraw();

       // console.log('click on a node to create an edge')
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
        console.log('edge is deleted')
    }

    KeyPress(event) {
    }

    KeyUp(event) { }
}