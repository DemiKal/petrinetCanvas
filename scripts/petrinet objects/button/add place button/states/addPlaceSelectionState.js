class AddPlaceSelectionState extends IEventHandler {
    constructor(parent) { super(parent); }
    Click(event) {


    }

    DoubleClick(event) {

    }

    MouseEnter(event) {
        this.parent.fillColor("orange");
    }

    MouseLeave(event) {
        this.parent.fillColor("black");
    }
}