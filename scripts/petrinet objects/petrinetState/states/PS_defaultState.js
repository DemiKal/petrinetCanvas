class PS_DefaultState extends IEventHandler {
    constructor(parent) { super(parent); }
    Click(event) {
        this.parent.Select();
        event.stopPropagation();

        $stateManager.SwitchToSelectionState();
        console.log('clicked on ps');
    }
    DoubleClick(event) { }
    MouseEnter(event) { }
    MouseLeave(event) { }
}