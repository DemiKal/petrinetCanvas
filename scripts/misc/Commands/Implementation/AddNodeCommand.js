class AddNodeCommand extends Command {
    constructor() {
        super();
    }

    Execute() {
        $commandManager.executed.push(this);
        super.Execute();
    }
    Undo() {
        var n = this.node;
        n.remove();

        $nodes = $nodes.filter(x => x !== n);
    }
    Redo() {
        $nodes.push(this.node);
        this.node.drawObject.add();
    }
}