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
        
        this.rememberedoutgoingEdges.forEach(function (element) {
            createEdge(this.node, element.To);
        }, this);
        this.rememberedIncomingEdges.forEach(function (element) {
            createEdge(element.From, this.node);
        }, this);

    }

    Redo() {
        this.node.remove();
    }
}