class placeSelectionState extends IEventHandler {
    constructor(parent) { super(parent); }
    Click(event) {
        //switch to selected
        this.parent.Select();

        if (event.which == 2) this.parent.activateContextMenu();
        event.stopPropagation();
    }
    DoubleClick(event) {
        // if (event.which == 2) {
        //     if (this.parent.tokens > 0) this.parent.tokens--;
        // }
        // else this.parent.tokens++; 

        // this.parent.drawObject.animate({
        //     //rotation: echo.rotation + 360
        //     x: this.parent.drawObject.x + 50,

        //     // opacity: 1
        // }, {
        //         duration: "short",
        //         easing: "ease-in-out-back",
        //         callback: function () {
        //             //echo.remove();
        //             //this.fill = "#fff";
        //             //canvas.redraw();
        //         }
        //     });
    }

    MouseEnter(event) {

    }

    MouseLeave(event) {

    }
}