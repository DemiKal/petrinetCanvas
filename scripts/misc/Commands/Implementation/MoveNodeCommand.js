class MoveNodeCommand extends Command {
    constructor(obj, oldPos, newPos) {
        super();
        this.node = obj;
        this.prevPos = oldPos;
        this.newPos = newPos;
    }

    Execute(){
        super.Execute();
    }

    Undo(){
         this.node.position = this.prevPos;         
    }

    Redo(){
        this.node.position = this.newPos;
    }
}