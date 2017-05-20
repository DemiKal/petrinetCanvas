class placeExecutionState extends IEventHandler {
    constructor(parent) { super(parent); }
    Click(event) { console.log('clicked on place'+ this.parent.name)};
    DoubleClick(event) { }
    MouseEnter(event) { }
    MouseLeave(event) { }
}