class TransitionExecutionState extends IEventHandler {
    constructor(parent) { super(parent); }

    Click(event) {
        var node = this.parent;
        if (node.readyCheck()) {

            //fire the transition and swallow the nodes
            node.fire();

            //old stuff with petrinetstate
            
            // add the new state then replace the currentstate with the new one
            // var newState = new PetriNetState(currentState);
            // var idx;
            // if ((idx = $.inArray(newState.id, petrinetStates.map(i => i.id))) != -1) { }

            // currentState.nextStates.push(newState);
            // currentState = newState;

            // //add the new state in the distinct list of states
            // petrinetStates.push(currentState);
        }

        $transitions.forEach(function (elem) { elem.readyCheck(); /*set color */ });
    }

    DoubleClick(event) { }
    MouseEnter(event) { }
    MouseLeave(event) { }
}
