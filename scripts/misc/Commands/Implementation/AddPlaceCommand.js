class AddPlaceCommand extends AddNodeCommand {
    constructor() {
        super();
        this.node = null;
    }

    Execute(onMouse) {
        this.CreatePlace(onMouse);
        super.Execute();
    }

    Undo() {
        super.Undo();
        $places = $places.filter(x => x !== this.node);
        var places = $.extend([], $places);
        var nodes = $.extend([], $nodes);
    }

    Redo() {
        //it shouldnt be null!
        if (this.node != null) {
            super.Redo();
            $places.push(this.node);
            
        }
        var nodes = $.extend([], $nodes);
        var places = $.extend([], $places);
    }

    CreatePlace(onMouse, buttonPress) {
        var position = { x: $canvas.width / 2, y: $canvas.height / 2 };
        if (onMouse) position = onMouse;

        var newPlace = new Place(position.x, position.y, 50, 1);
        var action = "created place by clicking spawn button";
        if (buttonPress) action = `created by pressing [${buttonPress}]`;

        $nodes.push(newPlace);
        $places.push(newPlace);
        this.node = newPlace;

        logAction(action, newPlace, `at ${JSON.stringify(position)}`);
    }
}