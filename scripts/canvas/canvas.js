function AddPlace(pos) {
    var position = { x: $canvas.width / 2, y: $canvas.height / 2 };
    if (pos) position = pos;
    var name = "P" + ($places.length + 1);
    var newPlace = new Place(position.x, position.y, 50, name, 0);
    $nodes.push(newPlace);
    $places.push(newPlace);
}

function SpawnTransition(pos) {
    var position = { x: $canvas.width / 2, y: $canvas.height / 2 };
    if (pos) position = pos;
    var name = "T" + ($transitions.length + 1);
    var width = 100;
    var height = 100;

    var trans = new Transition(pos.x - width / 2, pos.y - height / 2, 100, 100, name);
    $nodes.push(trans);
    $transitions.push(trans);
}

function SpawnPNState(pos) {
    position = { x: $canvas.width / 2, y: $canvas.height / 2 };
    if (pos) position = pos;
    var width = 200;
    var height = 100

    var pnstate = new PetriNetState(pos.x - width / 2, pos.y - height / 2, width, height)
    $nodes.push(pnstate);
    $PNstates.push(pnstate);
}

function TryEdge(node) {
    if (!edgePlacementValidation(node)) return;

    var newEdge = createEdge($selected, node);

    edgePending.remove();
    edgePending = null;

    $stateManager.SwitchToSelectionState();
}

function edgePlacementValidation(node) {
    if ($selected === node) { console.log('cant point to self!'); return false; }
    if ($selected.constructor == node.constructor) { console.log("same type!"); return false; }

    var mapped = node.incomingEdges.map(function (item) { return item.From; });
    if ($.inArray($selected, mapped) != -1) { console.log("edge already exists"); return false; }

    return true;
}

function createEdge(nodeA, nodeB) {
    var line = $canvas.display.line({
        start: { x: nodeA.x, y: nodeA.y },
        end: { x: nodeB.x, y: nodeB.y },
        stroke: "11px #0aa",
        cap: "butt"
    });

    nodeA.outgoingEdges.push(line);
    nodeB.incomingEdges.push(line);

    line.From = null;
    line.From = nodeA;
    line.To = null;
    line.To = nodeB;
    line.redraw();

    var triangle = $canvas.display.polygon({
        x: 0, y: 0, sides: 3, radius: 20,
        rotation: 0, fill: "#0da"
    });

    line.addChild(triangle);

    $canvas.addChild(line);
    line.zIndex = 0;
    triangle.zIndex = 3;    //doesnt work?

    nodeB.lineOnEdge();
    nodeA.lineOnEdge();
}

function deselect() {
    $nodes.forEach(function (item) { item.selected = false; });
    $selected  = null;
    $selectedButton.name = "None selected";
    $selectedButton.redraw();
}