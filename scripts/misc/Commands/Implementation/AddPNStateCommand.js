class AddPNStateCommand extends AddNodeCommand {
    constructor() {
        super();
        this.node = null;
    }

    Execute(onmouse, buttonpress) {
        super.Execute();
        this.CreatePNstate(onmouse, buttonpress);
    }

    Undo() {
        super.Undo();
        $PNstates = $PNstates.filter(x => x !== this.node);
        var nodes = $.extend([], $nodes);
    }

    Redo() {
        if (this.node != null) {
            super.Redo();
            $transitions.push(this.node);
        }
    }

    CreatePNstate(pos, buttonPress) {
        var position = { x: $canvas.width / 2, y: $canvas.height / 2 };
        if (pos) position = pos;
        var width = 200;
        var height = 100;

        var pnstate = new PetriNetState(position.x - width / 2, position.y - height / 2, width, height);

        var action = "created transition by clicking spawn button";
        if (buttonPress) action = `created by pressing [${String.fromCharCode(buttonPress)}]`;
        logAction(action, pnstate, `at ${JSON.stringify(pos)}`);
        this.node = pnstate;
        $nodes.push(pnstate);
        $PNstates.push(pnstate);

    }

}