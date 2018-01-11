class DeleteNodeCommand extends Command {
    constructor(obj) {
        super();
        this.node = obj;
        this.rememberedoutgoingEdges = obj.outgoingEdges;
        this.rememberedIncomingEdges = obj.incomingEdges;
    }

    Execute() {
        super.Execute();
        this.node.remove();

    }

    Undo() {
        this.node.Readd();
        var addTrans = this.node.constructor === PetriNetState;

        this.rememberedoutgoingEdges.forEach(function (element) {
            createEdge(this.node, element.To,addTrans);
        }, this);
        this.rememberedIncomingEdges.forEach(function (element) {
            createEdge(element.From, this.node,addTrans);
        }, this);

    }

    Redo() {
        this.node.remove();
    }
}