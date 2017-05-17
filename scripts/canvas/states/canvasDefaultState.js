class canvasDefaultState {
    constructor() { }

    Click(event) {
        /// /set current place as selected
        console.log('clicked canvas in default state');

    }

    DoubleClick(event) { }
    MouseDown(event) {
        $dragging = true;
        $selectionBox.x = $canvas.mouse.x;
        $selectionBox.y = $canvas.mouse.y;
        $selectionBox.opacity = 0.5;
    }
    MouseUp(event) {
        $dragging = false;
        $selectionBox.opacity = 0;
        $selectionBox.x = 0;
        $selectionBox.y = 0;
        $selectionBox.width = 0;
        $selectionBox.height = 0;
    }
    MouseMove(event) {
        if ($dragging ) {
            $selectionBox.opacity = 0.5;
            $selectionBox.width = $canvas.mouse.x - $selectionBox.x;
            $selectionBox.height = $canvas.mouse.y - $selectionBox.y;
        }
    }

    KeyDown(event) {

        var pos = { x: $canvas.mouse.x, y: $canvas.mouse.y };
        // key T
        if (event.which === 84) AddTransition(pos);

        //key A
        if (event.which === 65) AddPlace(pos);
    }
    KeyPress(event) { }
    KeyUp(event) { }
}