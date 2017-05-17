class placeEdgePendingState extends IEventHandler {
    constructor(parent) { super(parent); }
        Click(event){
            if (!edgePlacementValidation(node)) return;

            var newEdge = createEdge(selected.current, node);

            // selected.current = null;
            edgePending.remove();
            edgePending = null;
            event.stopPropagation();
            //switch states
            state.currentState = state.selectionState;
        }
    DoubleClick(event){}
    MouseEnter(event){}
    MouseLeave(event){}
}