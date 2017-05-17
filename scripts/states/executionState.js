class ExecutionState extends Istate {
    constructor() { super(); }
    canvasClick() { } //nothing
    placeClick() { }

    transitionClick(node, event) {
        // if (node.readyCheck()) {
        //
        //     //fire the transition and swallow the nodes
        //     node.fire();
        //
        //     // add the new state then replace the currentstate with the new one
        //     var newState = new PetriNetState(currentState);
        //     var idx;
        //     if ((idx = $.inArray(newState.id, petrinetStates.map(i => i.id))) != -1) { }
        //
        //     currentState.nextStates.push(newState);
        //     currentState = newState
        //
        //     //add the new state in the distinct list of states
        //     petrinetStates.push(currentState);
        //
        //     console.log(currentState)
        //     console.log(currentState.id)
        // }
        // $transitions.forEach(function (elem) { elem.readyCheck(); /*set color */ })
    }

    AddnodeClick(node, event) { }
    AddEdgeClick() { /* do nothing */ }
    keydownEvent() { }
    executionClick(button, event) {
        //go back to default mode;
        button.children[0].text = "Execution";
        button.children[0].fill = "#fff";
        state.currentState = state.defaultState;
        event.stopPropagation();

        $nodes.forEach(function (node) {
            node.AddDragAndDrop();
            node.drawObject.stroke = "5px red"; //reset colors

            if (node instanceof Place) {
                node.tokens = node.originalTokens;
                // node.tokensPlate.text = node.tokens; //reset token text
            }

            node.redraw();
        });
    }
}