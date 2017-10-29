//this class should register all the commands and take care of undoing and redoing.

class CommandManager {
    constructor() {
        this.executed = [];
        this.redoActions = [];
        this.AddPlace = new AddPlaceCommand();
    }

    //regular ctrl-z esque command to undo last operation.
    Undo() {
        var lastAction = this.executed.pop();
        if (lastAction != undefined) {
            this.redoActions.push(lastAction);
            lastAction.Undo();
            console.log(lastAction);
        }
    }

    Redo() {
        //pop last undone command (ctrl-y) and redo it. 
        //This will push it back to the executed stack/list
        var lastUndoneAction = this.redoActions.pop();
        if (lastUndoneAction != undefined) {
            //this.redoActions.push(lastUndoneAction);
            this.executed.push(lastUndoneAction);
            lastUndoneAction.Redo();
            console.log(lastUndoneAction);
        }

    }
}