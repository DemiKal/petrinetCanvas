class DefaultState extends Istate {
    constructor() { super(); }

    canvasClick(node, event) {
        //clicked on empty spot -> deselect
        deselect();
    }

    canvasDoubleClick() { }
    placeClick(node, event) {
        //set current place as selected
        selected.children[0].text = "Selected: " + node.name;
        selected.current = node; //is wrapper class
        selected.redraw();
        event.stopPropagation();
        state.currentState = state.selectionState;
    }

    transitionClick(node, event) {
        selected.children[0].text = "Selected: " + node.name;
        selected.current = node;
        selected.redraw();
        event.stopPropagation();
        state.currentState = state.selectionState;
    }

    AddnodeClick(button) {
        $nodes.push(new Place($canvas.width / 2, $canvas.height / 2, 50, "P" + Math.round(Math.random() * 100), Math.round(Math.random() * 10)));
    }
    AddEdgeClick() { console.log("select node first!") }

    keydownEvent(event) {
        if (event.which == 84) //= key T
            $nodes.push(new Transition($canvas.mouse.x - 50, $canvas.mouse.y - 50, 100, 100, "T" + Math.round(Math.random() * 100), Math.round(Math.random() * 10)));//createTransition($canvas.mouse.x - 50, $canvas.mouse.y - 50, 100, "T" + Math.round(Math.random() * 100)));
        if (event.which == 65)  //key A
            $nodes.push(new Place($canvas.mouse.x, $canvas.mouse.y, 50, "P" + Math.round(Math.random() * 100), Math.round(Math.random() * 10)));
    }

    executionClick(button, event) { switchToExecState(button); }
}