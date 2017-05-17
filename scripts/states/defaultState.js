class DefaultState extends Istate {
    constructor() {
        super();
    }

    canvasClick(event) {
        //clicked on empty spot -> deselect
        deselect();
    }

    canvasDoubleClick() { }
    placeClick(node, event) {
        // //set current place as selected
        // selected.children[0].text = "Selected: " + node.name;
        // selected.current = node; //is wrapper class
        // selected.redraw();
        // event.stopPropagation();
        // state.currentState = state.selectionState;
    }

    transitionClick(node, event) {
        // selected.children[0].text = "Selected: " + node.name;
        // selected.current = node;
        // selected.redraw();
        // event.stopPropagation();
        // state.currentState = state.selectionState;
    }

    static AddnodeClick(button) {
        AddPlace();
    }

    static AddEdgeClick() { console.log('select  a node first!') }

    keydownEvent(event) {
        // var pos = { x: $canvas.mouse.x, y: $canvas.mouse.y };
        // // key T
        // if (event.which === 84) AddTransition(pos);
        //
        // //key A
        // if (event.which === 65) AddPlace(pos);
    }

    executionClick(button, event) { switchToExecState(button); }

    placeMouseEnter(node, event) {
        // node.drawObject.stroke = "5px white"
        // node.drawObject.children[2].opacity = 1;    //set plus sign opacity to 0
    };

    placeMouseLeave(node, event) {
        // node.drawObject.stroke = "5px red"
        // node.drawObject.children[2].opacity = 0;    //set plus sign opacity to 0
    };
    // TransitionMouseEnter(node, event) { node.drawObject.stroke = "5px white" };
    // TransitionMouseLeave(node, event) { node.drawObject.stroke = "5px red" };
    // transitionDoubleClick(node, event) { console.log('dbl clicked on transition in default state') };

}


