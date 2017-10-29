//abstract class for command
class Command {
    constructor() {

    }

    Execute() {
        $commandManager.executed.push(this);
        
        //empty redo actions after doing a new action.
        $commandManager.redoActions = [];
    }
    Undo() { }
    Redo() { }
}