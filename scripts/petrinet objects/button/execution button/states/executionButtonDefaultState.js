class ExecutionButtonDefaultState extends IEventHandler {
    constructor(parent) { super(parent); }
    Click(event) {

        //deselect
        //switch to execution state
        deselect();
        console.log('clicked on exec button in default state, switching to exec');
        $stateManager.SwitchToExecutionState();
        this.readyCheckTransitions();
        this.parent.namePlate.fill = "red";
        this.parent.namePlate.redraw();

    }

    DoubleClick(event) {

    }

    MouseEnter(event) {
    }

    MouseLeave(event) {

    }
    readyCheckTransitions() {
        $nodes.forEach(function (node) {
            if (node instanceof Transition)
                node.readyCheck();
            else node.originalTokens = node.tokens;  //remember token amount before execution
        });

        $nodes.forEach(function (element) { element.dragAndDrop(false); })

    }

}