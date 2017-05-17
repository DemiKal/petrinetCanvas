class ExecutionButtonSelectionState extends IEventHandler {
    constructor(parent) { super(parent); }

    Click(event) {

       //invoke the default state method
       this.parent.defaultState.Click();
    }

    DoubleClick(event) {

    }

    MouseEnter(event) {
    }

    MouseLeave(event) {

    }
}