class placeEdgePendingState extends IEventHandler {
    constructor(parent) { super(parent); }
    Click(event) {
        TryEdge(this.parent);
        event.stopPropagation();
    }

    DoubleClick(event) { }
    MouseEnter(event) { }
    MouseLeave(event) { }
}