class TransitionDefaultState extends IEventHandler {
    constructor(parent) { super(parent); }
    Click() {
        selected.children[0].text = "Selected: " + this.parent.name;
        selected.current = this.parent;
        selected.redraw();
        event.stopPropagation();

        $stateManager.SwitchToSelectionState();
    }

    DoubleClick() {
        console.log('DOUBLEclicked on transition in default state')
    }
    MouseEnter() {
        this.parent.drawObject.stroke = "5px white"
    }
    MouseLeave() {
        this.parent.drawObject.stroke = "5px red"
    }
}

