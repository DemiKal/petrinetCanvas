class ExecutionButtonDefaultState extends IEventHandler {
    constructor(parent) { super(parent); }
    Click(event) {

        //deselect
        //switch to execution state
        deselect();
        console.log("clicked on exec button in default state, switching to exec");
        $stateManager.SwitchToExecutionState();
        readyCheckTransitions();
        this.parent.namePlate.fill = "red";
        this.parent.namePlate.redraw();

        // currentState = new PetriNetState(null);
    }


    DoubleClick(event) {

    }

    MouseEnter(event) {
        this.parent.fillColor("orange");
    }

    MouseLeave(event) {
        this.parent.fillColor("black");
    }
}