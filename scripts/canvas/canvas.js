function initMenu() {
    $addPlaceButton = new AddPlaceButton(10, 10, 100, 50, "Add node (A)");
    $addEdgeButton = new AddEdgeButton(120, 10, 100, 50, "Add Edge (E)");
    $selectedButton = new Button(230, 10, 100, 50, "None selected");
    $selected = null;
    $executionButton = new ExecutionButton(340, 10, 100, 50, "Execute");
    $validationButton = new Button(450, 10, 100, 50, "Validate");
    $resetColorsButton = new Button(560, 10, 100, 50, "Reset Colors");

    //this should later be implemented in its own class
    $validationButton.drawObject.bind("click tap", function (event) { event.stopPropagation(); initSimulation(); console.log('Clicked on validation button'); });
    $resetColorsButton.drawObject.bind("click tap", function (event) { event.stopPropagation(); ResetColors(); console.log('Resetting Colors'); });

    $buttons.push($addPlaceButton, $addEdgeButton, $selectedButton, $executionButton, $validationButton);
}

function drawbbox(event) {
    var allnodes = $.extend([], $nodes);
    for (var index = 0; index < allnodes.length; index++) {
        var element = allnodes[index];
        // var bb = element.BoundingBox;
        // element.drawObject.addChild($canvas.display.rectangle({ x: bb.left - element.x , y:  bb.top - element.y, width: bb.right - bb.left, height: bb.bottom - bb.top, fill: "#0aa"}));
    }
}


function ResetColors() {
    $PNstates.forEach(function (element) {
        element.ResetColors();
    }, this);
    
}

function AddPlace(pos) {
    var position = { x: $canvas.width / 2, y: $canvas.height / 2 };
    if (pos) position = pos;
    var name = "P" + ($places.length + 1);
    var newPlace = new Place(position.x, position.y, 50, name, 1);
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

//this can be decomposed to each node to handle their own edge placement validation
function edgePlacementValidation(node) {
    var selectedClass = $selected.constructor;
    var nodeClass = node.constructor;
    if ($selected === node) { console.log('cant point to self!'); return false; }
    if ($selected.constructor == node.constructor && node.constructor != PetriNetState) { console.log("same type!"); return false; }
    if ($selected.constructor == PetriNetState && node.constructor != PetriNetState) { console.log("cant link state to node!"); return false; }
    if ($selected.constructor != PetriNetState && node.constructor == PetriNetState) { console.log("cant link state to node!"); return false; }

    var mapped = node.incomingEdges.map(function (item) { return item.From; });
    if ($.inArray($selected, mapped) != -1) { console.log("edge already exists"); return false; }

    return true;
}

function createEdge(nodeA, nodeB) {
    var line = $canvas.display.line({
        start: { x: nodeA.x, y: nodeA.y },
        end: { x: nodeB.x, y: nodeB.y },
        stroke: $colorSettings.edge.stroke,
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
        rotation: 0, fill: $colorSettings.edge.arrow
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
    $selected = null;
    $selectedButton.name = "None selected";
    $selectedButton.redraw();
}