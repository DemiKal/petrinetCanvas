//abstract class for command
class Command {
    constructor() {
         
    }

    Execute() { 
        //empty redo actions after doing a new action.
        $commandManager.redoActions = [];
    }
    Undo() { }
}