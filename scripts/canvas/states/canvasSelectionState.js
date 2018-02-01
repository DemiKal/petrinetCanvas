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
                spawnPendingEdge();
                break;
            case ".":   //delete button
                var cmd = new DeleteNodeCommand($selected);
                cmd.Execute();
                //$selected.remove();
                break;
            default:
                break;
        }

    }

    KeyPress(event) { }
    KeyUp(event) { }


}

