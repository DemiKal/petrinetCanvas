class PS_SelectionState extends IEventHandler {
    constructor(parent) { super(parent); }
    Click(event) {
        deselect();
        this.parent.Select();
        event.stopPropagation();
        // var parent = this.parent;
        // if (event.which == 2) {
        //     $.each(this.parent.activePlaces, function (key, value) {
        //         delete parent.activePlaces[key];

        //     });
        //     var drawObj = this.parent.drawObject;
        //     //this.parent.placeAnchor.remove(true);
        //     for (var i = 0; i < drawObj.children.length; i++) {
        //         if (drawObj.children[i].name == "place anchor")
        //             drawObj.removeChildAt(i)
        //     }

        //   //  this.parent.placeAnchor.remove();

        //     this.parent.redraw();

        // }
    }
    DoubleClick(event) { }
    MouseEnter(event) { }
    MouseLeave(event) { }
}