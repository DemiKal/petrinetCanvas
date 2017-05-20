class AddEdgeDefaultState extends IEventHandler {
    constructor(parent) { super(parent); }
    Click(event) {
        //adds a place in the middle of the screen.
        console.log('select  a node first!');


    }

    DoubleClick(event) {

    }

    MouseEnter(event) {
        this.parent.drawObject.fill = "orange";
        this.parent.drawObject.redraw()
    }

    MouseLeave(event) {
        this.parent.drawObject.fill = "black";
        this.parent.drawObject.redraw()
    }
}
        // addPlace.bind("mouseenter", function (event) { this.fill = "orange"; this.redraw() });
        // addPlace.bind("mouseleave", function (event) { this.fill = "black"; this.redraw() });
        // addPlace.bind("mousedown", function (event) { this.fill = "blue"; this.redraw() });
        // addPlace.bind("mouseup", function (event) { this.fill = "orange"; this.redraw() });

