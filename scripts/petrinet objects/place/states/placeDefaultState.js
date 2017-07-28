class placeDefaultState extends IEventHandler {
    constructor(parent) { super(parent); }
    Click(event) {
        /// /set current place as selected
        this.parent.Select();
        
        event.stopPropagation();

        $stateManager.SwitchToSelectionState();

    }
    DoubleClick(event) {
         
    }

    MouseEnter(event) {
        //this.parent.drawObject.stroke = "5px white"
    }
    MouseLeave(event) {
        //this.parent.drawObject.stroke = "5px red"
    }
}