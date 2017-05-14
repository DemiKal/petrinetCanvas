class placeDefaultState extends IEventHandler {
    constructor(parent) { super(parent); }
    Click() {  //set current place as selected
        // selected.children[0].text = "Selected: " + this.parent.name;
        // selected.current = this.parent; //is wrapper class
        // selected.redraw();
        // event.stopPropagation();

        $stateManager.SwitchToSelectionState();
        $selectedNodes = this.parent;
        this.parent.selected = true;
    }
    DoubleClick() { console.log('DOUBLEclicked on place in default state') }

    MouseEnter() {
        this.parent.drawObject.stroke = "5px white"
    }
    MouseLeave() {
        this.parent.drawObject.stroke = "5px red"
    }
}