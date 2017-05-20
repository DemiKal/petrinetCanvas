class placeDefaultState extends IEventHandler {
    constructor(parent) { super(parent); }
    Click(event) {
        /// /set current place as selected
        this.parent.Select();

        event.stopPropagation();

        $stateManager.SwitchToSelectionState();

    }
    DoubleClick(event) { console.log('DOUBLEclicked on place in default state') }

    MouseEnter(event) {
        //this.parent.drawObject.stroke = "5px white"
    }
    MouseLeave(event) {
        //this.parent.drawObject.stroke = "5px red"
    }
}