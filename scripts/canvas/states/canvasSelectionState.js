class canvasSelectionState {
    constructor() { }

    Click(event) {
        console.log('clicked canvas in selectState');
        $stateManager.SwitchToDefaultState();

        $nodes.forEach(function (item) {
            item.selected = false;
        });

        selected.current = null;
        selected.name = "None selected";
        selected.redraw();

    }
    DoubleClick(event) { console.log('DOUBLEclicked canvas ss') }
    MouseDown(event) { console.log('mousedown canvas ss'); }
    MouseUp(event) { }
    MouseMove(event) { }
    KeyDown(event) {
        if (event.which == 69) //simulate clicking on adding edge button by pressing E
        //TODO: add edge 
        { }
    }
    KeyPress(event) { }
    KeyUp(event) { }
}

