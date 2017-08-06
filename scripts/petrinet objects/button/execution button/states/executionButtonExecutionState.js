class ExecutionButtonExecutionState extends IEventHandler {
    constructor(parent) { super(parent); }
    Click(event) {

        //go back to default mode;  TODO: FIX
        deselect();
        console.log('clicked on exec button in exec state');

        //  this.parent.children[0].text = "Execution";
        //  this.parent.children[0].fill = "#fff";
        // state.currentState = state.defaultState;
        // event.stopPropagation();

        $nodes.forEach(function (node) {
            node.AddDragAndDrop();
            node.drawObject.stroke = "5px red"; //reset colors TODO: FIX

            if (node instanceof Place) {
                node.tokens = node.originalTokens;
            }

            node.redraw();
        });

        this.parent.namePlate.fill = "white";
        this.parent.namePlate.redraw();

        $stateManager.SwitchToDefaultState();
    }

    DoubleClick(event) { }

    MouseEnter(event) { }

    MouseLeave(event) { }
}

