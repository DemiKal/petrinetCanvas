//this module is about logging the user's actions to a file.
//this should be delegated to the back end
function logAction(action, obj, extra) {
    var user = 'user';
    var date = new Date().toJSON();
    var completename = obj.name + ' of type ' + obj.constructor.name;

    var newAction = `${user} | ${date} | ${action} | ${completename}`;
    extra ? newAction += ` ${extra} \n` : newAction += '\n';

    console.log(newAction);
    $actions += newAction;

}

function saveLog() {
    //replace user by the correct username and update in database
    var user = 'user';
    var newAction = user + ' | saved log | ' + new Date().toJSON() + '\n';
    $actions += newAction;
    var newActions = $actions;
    $actions = "";
    var blob = new Blob([newActions], { type: "text/plain;charset=utf-8" });
    saveAs(blob, `userlog of ${user}.txt`);
}