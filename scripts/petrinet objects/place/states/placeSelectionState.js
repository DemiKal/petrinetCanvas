class placeSelectionState extends IEventHandler {
    constructor(parent) { super(parent); }
    Click() { console.log('clicked on place from selectionstate') }
    DoubleClick() { }
    MouseEnter() {
        this.parent.drawObject.stroke = "5px white"
    }
    MouseLeave() {
        this.parent.drawObject.stroke = "5px red"
    }
}