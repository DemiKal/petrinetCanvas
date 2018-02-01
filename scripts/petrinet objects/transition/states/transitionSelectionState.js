class TransitionSelectionState extends IEventHandler {
    constructor(parent) { super(parent); }
    Click(event) {
        this.parent.Select();
        if (event.button == 2) { this.parent.activateContextMenu(); }

        event.stopPropagation();

    }
    DoubleClick(event) { }

    MouseEnter(event) {
        //this.parent.drawObject.stroke = "5px white"
    }
    MouseLeave(event) {
        // this.parent.drawObject.stroke = "5px red"
    }
}
