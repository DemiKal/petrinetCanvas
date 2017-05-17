class canvasEdgePendingState {
    constructor() { }

    Click(event) {
        console.log('clicked canvas in selectState');
        $stateManager.SwitchToDefaultState();

        $nodes.forEach(function (item) {
            item.selected = false;
        });

        selected.current = null;
        selected.children[0].text = "None selected";
        selected.redraw();

    }
    DoubleClick(event) { console.log('DOUBLEclicked canvas ss') }
    MouseDown(event) { console.log('mousedown canvas ss'); }
    MouseUp(event) { }
    MouseMove(event) { }
    KeyDown(event) {
        //press any button to remove the pending edge

        edgePending.remove();
        edgePending = null;

        $stateManager.SwitchToSelectionState();

    }

    KeyPress(event) {
    }

    KeyUp(event) { }
}