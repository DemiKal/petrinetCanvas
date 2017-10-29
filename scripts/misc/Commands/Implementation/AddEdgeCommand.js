class AddEdgeCommand  extends Command {
    constructor(obj, trgt) {
        super();
        this.node = obj;
        this.target = trgt;
    }

    Execute() {
        super.Execute();
    }

    Undo() {
        //find the right edge and remove
        var edges = this.node.edges;
        
    }

    Redo() {
        //add the edge from node to target
    }
}