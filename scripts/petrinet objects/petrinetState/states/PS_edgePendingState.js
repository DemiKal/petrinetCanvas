class PS_EdgePendingState extends IEventHandler {
    constructor(parent) { super(parent); }
    Click() 
    { 
        TryEdge(this.parent)
        event.stopPropagation();
    }
    DoubleClick() { }
    MouseEnter() { }
    MouseLeave() { }
}