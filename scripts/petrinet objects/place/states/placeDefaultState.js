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

    }
    
    MouseLeave(event) {

    }
}