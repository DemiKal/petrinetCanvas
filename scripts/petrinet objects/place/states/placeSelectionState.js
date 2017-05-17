class placeSelectionState extends IEventHandler {
    constructor(parent) { super(parent); }
    Click(event) {
        //switch to selected
        this.parent.Select();

         event.stopPropagation();
    }
    DoubleClick(event) { }
    MouseEnter(event) {
        this.parent.drawObject.stroke = "5px white"
    }
    MouseLeave(event) {
        this.parent.drawObject.stroke = "5px red"
    }
}