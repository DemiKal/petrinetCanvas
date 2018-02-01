class canvasDefaultState {
    constructor() { }

    Click(event) {
        /// /set current place as selected
        console.log("clicked canvas in default state");
        if ($selected) if ($selected.contextMenu) $selected.deactivateContextMenu();

        //create canvas context menu
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
        var mousepos = mousePos();
        var key = String.fromCharCode(event.which);

        if ($inputPopup) {
            //backspace
            if (event.which == 8) {
                $inputPopup.text.text = $inputPopup.text.text.slice(0, -1);
            } else
                $inputPopup.text.text += key;

            $inputPopup.resize();
            $inputPopup.redraw();

            return;
        }

        switch (key) {
            case "T":
                var cmd = new AddTransitionCommand();
                cmd.Execute(mousepos, key);
                break;
            case "P":
                var cmd = new AddPlaceCommand();
                cmd.Execute(mousepos, key);
                break;
            case "Q":
                //SpawnPNState(pos, event.which);
                var cmd = new AddPNStateCommand();
                cmd.Execute(mousepos, false);
                break;
            case "Z":
                if (event.ctrlKey == true) { $commandManager.Undo(); }
                break;
            case "Y":
                if (event.ctrlKey == true) { $commandManager.Redo(); }
                break;
            default:
                logAction(`pressed ${key}`, null);
        }

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