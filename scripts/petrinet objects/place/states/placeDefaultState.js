class placeDefaultState extends IEventHandler {
    constructor(parent) { super(parent); }
    Click(event) {
        /// /set current place as selected
        this.parent.Select();

        event.stopPropagation();
        //if rightbutton is clicked
        if (event.button == 2) {
             this.parent.activateContextMenu();

        }


    }



    DoubleClick(event) {

    }

    MouseEnter(event) {

    }

    MouseLeave(event) {

    }
}