class ExecutionButtonSelectionState extends IEventHandler {
    constructor(parent) { super(parent); }

    Click(event) {

        //invoke the default state method
        this.parent.defaultState.Click();
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