class PS_DefaultState extends IEventHandler {
    constructor(parent) { super(parent); }
    Click(event) {
        this.parent.Select();
        event.stopPropagation();
    }

    DoubleClick(event) { }
    MouseEnter(event) { }
    MouseLeave(event) { }
}