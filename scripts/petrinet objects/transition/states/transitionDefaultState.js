class TransitionDefaultState extends IEventHandler {
    constructor(parent) { super(parent); }
    Click(event) {
        this.parent.Select();
        event.stopPropagation();

        $stateManager.SwitchToSelectionState();


    }

    DoubleClick(event) {
        console.log('DOUBLEclicked on transition in default state')
    }
    MouseEnter(event) {
       // this.parent.drawObject.stroke = "5px white"
    }
    MouseLeave(event) {
       // this.parent.drawObject.stroke = "5px red"
    }
}

