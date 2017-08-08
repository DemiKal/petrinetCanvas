function initMenu() {
    $addPlaceButton = new AddPlaceButton(10, 10, 100, 50, "Add node (A)");
    $addEdgeButton = new AddEdgeButton(120, 10, 100, 50, "Add Edge (E)");
    $selectedButton = new Button(230, 10, 100, 50, "None selected");
    $selected = null;
    $executionButton = new ExecutionButton(340, 10, 100, 50, "Execute");
    $validationButton = new Button(450, 10, 100, 50, "Validate");
    $validationButton.bindManual();
    $resetColorsButton = new Button(560, 10, 100, 50, "Reset Colors");
    $resetColorsButton.bindManual();
    //this should later be implemented in its own class
    $validationButton.drawObject.bind("click tap", function (event) { event.stopPropagation(); initSimulation(); console.log('Clicked on validation button'); });
    $validationButton.helpMessage = $validationButton.AddHelpMessage("Click this button to get feedback on\nYour reachability graph.");

    $resetColorsButton.drawObject.bind("click tap", function (event) { event.stopPropagation(); ResetAllColors(); });
    $resetColorsButton.helpMessage = $resetColorsButton.AddHelpMessage("Reset colors of your reachability graph");

    $saveLogButton = $canvas.display.rectangle({
        x: 670,
        y: 10,
        width: 100,
        height: 50,
        fill: "#000"
    }).add();

    var buttonText = $canvas.display.text({
        x: $saveLogButton.width / 2,
        y: $saveLogButton.height / 2,
        origin: { x: "center", y: "center" },
        font: "bold 10px sans-serif",
        text: "save log file",
        fill: "#fff"
    });
    $saveLogButton.addChild(buttonText);
    $saveLogButton.bind("click tap", function (event) { event.stopPropagation(); saveLog(); });
    $saveLogButton.bind("mouseenter", function (event) { event.stopPropagation(); this.fill = "orange"; this.redraw(); });
    $saveLogButton.bind("mouseleave", function (event) { event.stopPropagation(); this.fill = "black"; this.redraw(); });

    $buttons.push($addPlaceButton, $addEdgeButton, $selectedButton, $executionButton, $validationButton);
}

function comparePosition(a, b) {
    return (a.x == b.x && a.y == b.y);
}
function drawbbox(event) {
    var allnodes = $.extend([], $nodes);
    for (var index = 0; index < allnodes.length; index++) {
        var element = allnodes[index];
        // var bb = element.BoundingBox;
        // element.drawObject.addChild($canvas.display.rectangle({ x: bb.left - element.x , y:  bb.top - element.y, width: bb.right - bb.left, height: bb.bottom - bb.top, fill: "#0aa"}));
    }

}

function mousePos() {
    return { x: $canvas.mouse.x, y: $canvas.mouse.y }
}
function ResetAllColors() {
    $nodes.forEach(function (element) {
        element.ResetColors();
    }, this);

}

function AddPlace(pos, buttonPress) {
    var position = { x: $canvas.width / 2, y: $canvas.height / 2 };
    if (pos) position = pos;
    var name = "P" + ($places.length + 1);
    var newPlace = new Place(position.x, position.y, 50, name, 1);

    var action = "created place by clicking spawn button"
    if (buttonPress) action = `created by pressing [${String.fromCharCode(buttonPress)}]`;

    $nodes.push(newPlace);
    $places.push(newPlace);
    logAction(action, newPlace, `at ${JSON.stringify(pos)}`)
}

function SpawnTransition(pos, buttonPress) {
    var position = { x: $canvas.width / 2, y: $canvas.height / 2 };
    if (pos) position = pos;
    var name = "T" + ($transitions.length + 1);
    var width = 100;
    var height = 100;

    var trans = new Transition(pos.x - width / 2, pos.y - height / 2, 100, 100, name);
    var action = "created transition by clicking spawn button"
    if (buttonPress) action = `created by pressing [${String.fromCharCode(buttonPress)}]`;
    logAction(action, trans, `at ${JSON.stringify(pos)}`)

    $nodes.push(trans);
    $transitions.push(trans);
}

function SpawnPNState(pos, buttonPress) {
    position = { x: $canvas.width / 2, y: $canvas.height / 2 };
    if (pos) position = pos;
    var width = 200;
    var height = 100

    var pnstate = new PetriNetState(pos.x - width / 2, pos.y - height / 2, width, height)

    var action = "created transition by clicking spawn button"
    if (buttonPress) action = `created by pressing [${String.fromCharCode(buttonPress)}]`;
    logAction(action, pnstate, `at ${JSON.stringify(pos)}`)

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
    if ($selected === node) {
        logAction('tried to point edge to itself', node);
        ErrorPopup("can't point edge to self");
        return false;
    }
    if ($selected.constructor == node.constructor && node.constructor != PetriNetState) {
        logAction('tried to link to same type', $selected);
        ErrorPopup("This node can't point to the same type");
        return false;
    }
    if ($selected.constructor == PetriNetState && node.constructor != PetriNetState) {
        logAction('tried to link petrinetState with another type', $selected);
        ErrorPopup("Can only link to same node type");
        return false;
    }

    if ($selected.constructor != PetriNetState && node.constructor == PetriNetState) {
        logAction('tried to link to a petrinetState', $selected);
        ErrorPopup("This type cannot point to that type");
        return false;
    }

    var mapped = node.incomingEdges.map(function (item) { return item.From; });
    if ($.inArray($selected, mapped) != -1) {
        logAction('edge already exists to', $selected);
        ErrorPopup("Edge already exists");
        return false;
    }

    logAction('edge placed', $selected, ` with ${node.name} of type ${node.constructor.name}`);
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