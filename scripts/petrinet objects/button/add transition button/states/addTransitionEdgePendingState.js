class AddTransitionEdgePendingState extends IEventHandler {
    constructor(parent) { super(parent); }
    Click(event) {
        //adds a place in the middle of the screen.
        var pos = { x: $canvas.width / 2, y: $canvas.height / 2 };
        this.parent.AddPlace(pos);

    }

    DoubleClick(event) {

    }

    MouseEnter(event) {
    }

    MouseLeave(event) {

    }
}

