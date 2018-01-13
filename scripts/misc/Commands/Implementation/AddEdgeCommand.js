class AddEdgeCommand extends Command {
    constructor(obj, trgt) {
        super();
        this.node = obj;
        this.target = trgt;
    }

    Execute() {
        super.Execute();
        var addTransButton = this.node.constructor.name == PetriNetState.name ;
        createEdge(this.node, this.target, addTransButton);

    }

    Undo() {
        //find the right edge and remove
        var trgt = this.target;
        var node = this.node;
        this.node.outgoingEdges.filter(x => x.To === trgt).pop().remove();
        this.target.incomingEdges.filter(x => x.From === node).pop().remove();

        this.node.outgoingEdges = this.node.outgoingEdges.filter(x => x.To !== trgt);
        this.target.incomingEdges = this.target.incomingEdges.filter(x => x.From !== node);

    }

    Redo() {
        //add the edge from node to target
        createEdge(this.node, this.target);

    }

   
}