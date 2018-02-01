class PS_SelectionState extends IEventHandler {
    constructor(parent) { super(parent); }
    Click(event) {
        deselect();
        this.parent.Select();
        event.stopPropagation();
    }
    
    DoubleClick(event) { }
    MouseEnter(event) { }
    MouseLeave(event) { }
}