class AddPlaceCommand extends Command {
    constructor() {
        super();
        this.place = null;
    }

    Execute(onMouse) {
        this.CreatePlace(onMouse);
        $commandManager.executed.push(this);
    }

    Undo() { 
        var place = this.place;
        place.remove();
        
        $nodes = $nodes.filter(x => x !== place);
        $places = $places.filter(x => x !== place);
    }

    Redo(){
        //it shouldnt be null!
        if(this.place != null)    {
            $nodes.push(this.place);
            $places.push(this.place);
            this.place.drawObject.add();
        }
    }

    CreatePlace(onMouse, buttonPress) {
        var position = { x: $canvas.width / 2, y: $canvas.height / 2 };
        if (onMouse) position = onMouse;

        var newPlace = new Place(position.x, position.y, 50, 1);
        var action = "created place by clicking spawn button";
        if (buttonPress) action = `created by pressing [${String.fromCharCode(buttonPress)}]`;

        $nodes.push(newPlace);
        $places.push(newPlace);
        this.place = newPlace;
        
        logAction(action, newPlace, `at ${JSON.stringify(position)}`);
    }
}