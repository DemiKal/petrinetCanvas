class ExecutionButtonExecutionState extends IEventHandler {
    constructor(parent) { super(parent); }
    Click(event) {

        //go back to default mode;  TODO: FIX
        deselect();
        // button.children[0].text = "Execution";
        // button.children[0].fill = "#fff";
        // state.currentState = state.defaultState;
        // event.stopPropagation();

        // $nodes.forEach(function (node) {
        //     node.AddDragAndDrop();
        //     node.drawObject.stroke = "5px red"; //reset colors

        //     if (node instanceof Place) {
        //         node.tokens = node.originalTokens;
        //         // node.tokensPlate.text = node.tokens; //reset token text
        //     }

        //     node.redraw();
        // });
    }

    DoubleClick(event) { }

    MouseEnter(event) { }

    MouseLeave(event) { }
}

