function AddPlace(pos) {
    var position = { x: $canvas.width / 2, y: $canvas.height / 2 };
    if (pos) position = pos;
    var name = "P" + ($places.length + 1);
    var newPlace = new Place(position.x, position.y, 50, name, 0);
    $nodes.push(newPlace);
    $places.push(newPlace);
}
function AddTransition(pos) {
    var position = { x: $canvas.width / 2, y: $canvas.height / 2 };
    if (pos) position = pos;
    var name = "T" + ($transitions.length + 1);
    var width = 100;
    var height = 100;

    var trans = new Transition(pos.x - width / 2, pos.y - height / 2, 100, 100, name);
    $nodes.push(trans);
    $transitions.push(trans);
}