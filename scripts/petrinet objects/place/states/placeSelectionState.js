class placeSelectionState extends IEventHandler {
    constructor(parent) { super(parent); }
    Click(event) {
        //switch to selected
        this.parent.Select();
        if (event.which == 2) {
            if (this.parent.tokens > 0) this.parent.tokens--;
        }
         event.stopPropagation();
    }
    DoubleClick(event) { this.parent.tokens++;}
    MouseEnter(event) {
       // this.parent.drawObject.stroke = "5px white"
    }
    MouseLeave(event) {
     //   this.parent.drawObject.stroke = "5px red"
    }
}