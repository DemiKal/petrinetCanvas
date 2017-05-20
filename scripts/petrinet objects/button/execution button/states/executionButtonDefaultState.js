class ExecutionButtonDefaultState extends IEventHandler {
    constructor(parent) { super(parent); }
    Click(event) {
        
        //deselect
        //switch to execution state
        deselect();
        $stateManager.SwitchToExecutionState();
         

    }

    DoubleClick(event) {

    }

    MouseEnter(event) {
    }

    MouseLeave(event) {

    }
}

