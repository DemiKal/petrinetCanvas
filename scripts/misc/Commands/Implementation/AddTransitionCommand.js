class AddTransitionCommand extends AddNodeCommand {
    constructor() {
        super();
        this.node = null;
    }

    Execute(onMouse, buttonPress) {
        this.CreateTransition(onMouse, buttonPress);
        super.Execute();
    }

    Undo() {
        super.Undo();
        $transitions = $transitions.filter(x => x !== this.node);
        var nodes = $.extend([], $nodes);
    }
    Redo() {
        if (this.node != null) {
            super.Redo();
            $transitions.push(this.node);
        }
    }
    CreateTransition(onMouse, buttonPress) {

        var position = { x: $canvas.width / 2, y: $canvas.height / 2 };
        if (onMouse) position = onMouse;
        var width = 100;
        var height = 100;
        var newTransition = new Transition(position.x - width / 2, position.y - height / 2, width, height);
        var action = "created transition by clicking spawn button";
        if (buttonPress) action = `created by pressing [${buttonPress}]`;

        $nodes.push(newTransition);
        $transitions.push(newTransition);
        this.node = newTransition;

        logAction(action, newTransition, `at ${JSON.stringify(position)}`);

    }
}