class canvasDefaultState {
    constructor() { }

    Click(event) {
        /// /set current place as selected
        console.log('clicked canvas in default state');
    }

    DoubleClick(event) { }
    MouseDown(event) {
       // this.initSelectionBox();

    }
    MouseUp(event) {
       // this.hideSelectionBox()
    }
    MouseMove(event) {
       // this.selectionBoxDragging()
    }

    KeyDown(event) {

        var pos = { x: $canvas.mouse.x, y: $canvas.mouse.y };
        // key T
        if (event.which === 84) SpawnTransition(pos);

        //key A
        if (event.which === 65) AddPlace(pos);
    }
    KeyPress(event) { }
    KeyUp(event) { }

    selectionBoxDragging() {
        if ($dragging) {
            $selectionBox.opacity = 0.5;
            $selectionBox.width = $canvas.mouse.x - $selectionBox.x;
            $selectionBox.height = $canvas.mouse.y - $selectionBox.y;
        }
    }

    initSelectionBox() {
        $dragging = true;
        $selectionBox.x = $canvas.mouse.x;
        $selectionBox.y = $canvas.mouse.y;
        $selectionBox.opacity = 0.5;
    }

    hideSelectionBox() {
        $dragging = false;
        $selectionBox.opacity = 0;
        $selectionBox.x = 0;
        $selectionBox.y = 0;
        $selectionBox.width = 0;
        $selectionBox.height = 0;
    }
}