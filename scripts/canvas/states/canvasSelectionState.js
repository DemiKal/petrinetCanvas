class canvasSelectionState{
    constructor(){ }

    Click(event) {
        console.log('clicked canvas in selectState');
        $stateManager.SwitchToDefaultState();

        $nodes.forEach(function(item){
            item.selected = false;
        });

        selected.current = null;
        selected.children[0].text = "None selected";
        selected.redraw();

    }
    DoubleClick(event){ console.log('DOUBLEclicked canvas ss') }
    MouseDown(event){       console.log('mousedown canvas ss');    }
    MouseUp(event){    }
    MouseMove(event) { }
    KeyDown(event) { }
    KeyPress(event) { }
    KeyUp(event) { }
}