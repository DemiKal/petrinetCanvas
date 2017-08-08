class AddPlaceExecutionState extends IEventHandler {
    constructor(parent) { super(parent); }
    Click(event) {
        console.log('cant add place in execution mode!')

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