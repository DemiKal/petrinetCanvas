function reconstruct(graph) {
}

function spawnPendingEdge() {
    var line = $canvas.display.line({
        start: $selected.center,
        end: { x: $canvas.mouse.x, y: $canvas.mouse.y },
        stroke: $colorSettings.edge.stroke,
        cap: "round"
    }).add();

    edgePending = line;

    $stateManager.SwitchToEdgePendingState();
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
    console.log("as");
}

function mousePos() {
    return { x: $canvas.mouse.x, y: $canvas.mouse.y };
}

function ResetAllColors() {
    $nodes.forEach(function (element) {
        element.ResetColors();
    }, this);

}

function AddPlaceRef() {
    var cmd = new AddPlaceCommand;
    cmd.Execute(false, false);
}
function AddTransitionRef() {
    var cmd = new AddTransitionCommand;
    cmd.Execute(false, false);
}

function SpawnTransition(pos, buttonPress) {
    var position = { x: $canvas.width / 2, y: $canvas.height / 2 };
    if (pos) position = pos;
    var width = 100;
    var height = 100;
    var midscreen = { x: position.x - width / 2, y: position.y - height / 2 };
    var trans = new Transition(midscreen.x, midscreen.y, 100, 100);
    var action = "created transition by clicking spawn button";
    if (buttonPress) action = `created by pressing [${String.fromCharCode(buttonPress)}]`;
    logAction(action, trans, `at ${JSON.stringify(pos)}`);

    $nodes.push(trans);
    $transitions.push(trans);
}

function SpawnPNState(pos, buttonPress) {
    position = { x: $canvas.width / 2, y: $canvas.height / 2 };
    if (pos) position = pos;
    var width = 200;
    var height = 100;

    var pnstate = new PetriNetState(position.x - width / 2, position.y - height / 2, width, height);

    var action = "created transition by clicking spawn button";
    if (buttonPress) action = `created by pressing [${String.fromCharCode(buttonPress)}]`;
    logAction(action, pnstate, `at ${JSON.stringify(pos)}`);

    $nodes.push(pnstate);
    $PNstates.push(pnstate);
}

function TryEdge(node) {
    if (!edgePlacementValidation(node)) return;

    //var newEdge = createEdge($selected, node);

    var cmd = new AddEdgeCommand($selected, node);
    cmd.Execute();

    edgePending.remove();
    edgePending = null;

    $stateManager.SwitchToSelectionState();
}

//this can be decomposed to each node to handle their own edge placement validation
function edgePlacementValidation(node) {
    var selectedClass = $selected.constructor;
    var nodeClass = node.constructor;
    if ($selected === node) {
        logAction("tried to point edge to itself", node);
        ErrorPopup("can't point edge to self");
        return false;
    }
    if ($selected.constructor == node.constructor && node.constructor != PetriNetState) {
        logAction("tried to link to same type", $selected);
        ErrorPopup("This node can't point to the same type");
        return false;
    }
    if ($selected.constructor == PetriNetState && node.constructor != PetriNetState) {
        logAction("tried to link petrinetState with another type", $selected);
        ErrorPopup("Can only link to same node type");
        return false;
    }

    if ($selected.constructor != PetriNetState && node.constructor == PetriNetState) {
        logAction("tried to link to a petrinetState", $selected);
        ErrorPopup("This type cannot point to that type");
        return false;
    }

    var mapped = node.incomingEdges.map(function (item) { return item.From; });
    if ($.inArray($selected, mapped) != -1) {
        logAction("edge already exists to", $selected);
        ErrorPopup("Edge already exists");
        return false;
    }

    logAction("edge placed", $selected, ` with ${node.name} of type ${node.constructor.name}`);
    return true;
}

function deselect() {
    $nodes.forEach(function (item) { item.selected = false; });
    //if ($selected) if ($selected.contextMenu) $selected.deactivateContextMenu();
    $selected = null;
    $selectedButton.name = "None selected";
    $selectedButton.redraw();
    $stateManager.SwitchToDefaultState();
}

function createEdge(nodeA, nodeB, addTransbutton) {
    var line = $canvas.display.line({
        start: { x: nodeA.x, y: nodeA.y },
        end: { x: nodeB.x, y: nodeB.y },
        stroke: $colorSettings.edge.stroke,
        cap: "butt", opacity: 0
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
    line.opacity = 1;

    //add an extra button to select transition if its between petrinetstates
    if (addTransbutton) CreateTransButton(line);
}

//TODO: move to petrinetstate.js
function CreateTransButton(line) {
    var width = 50;
    var Trans = $canvas.display.rectangle({
        x: -width / 2, y: -width / 2,
        height: width, width: width, fill: "#f45c42"
    });

    var transText = $canvas.display.text({
        x: width / 2,
        y: width / 2,
        origin: { x: "center", y: "center" },
        font: "bold 30px sans-serif",
        text: "",
        fill: "#fff"
    });

    Trans.addChild(transText);
    line.addChild(Trans);
    Trans.clicked = false;
    Trans.lineref = line;
    var anchor = $canvas.display.rectangle({
        x: 0, y: 0,
        height: $transitions.length * width, width: width * 2
    });
    anchor.isAnchor = true;

    // Trans.addChild(anchor);
    anchor.TransButtons = [];
    anchor.bind("mouseleave", function () {
        // var asds = anchor.TransButton.some(function (element, index, array) { return element.MouseHovered; });
        console.log("hasleft!");
        var hasEntered = false;
        for (var j = 0; j < anchor.TransButtons.length; j++) { if (anchor.TransButtons.mouseHover) hasEntered = true; }

        if (hasEntered) return;
        if (anchorHoverMouse(anchor)) { return; }

        for (var i = 0; i < anchor.TransButtons.length; i++) { anchor.TransButtons[i].remove(); }

        anchor.TransButtons = [];
        Trans.redraw();
        this.remove();
    });

    Trans.bind("mouseenter", function () {
        console.log("trans enter");
        if ($transitions.length == 0) return;
        var hasEntered = false;
        for (var j = 0; j < anchor.TransButtons.length; j++) {
            if (anchor.TransButtons.mouseHover)
                hasEntered = true;
        }
        if (hasEntered) return;
        //else if (anchorHoverMouse(anchor)) return;

        var alreadyHasAnchor = false;
        for (var v = 0; v < Trans.children.length; v++) {
            if (Trans.children[v].isAnchor == true)
                alreadyHasAnchor = true;
        }
        if (alreadyHasAnchor) return;
        anchor.height = $transitions.length * width; //update height
        Trans.addChild(anchor);


        for (var i = 0; i < $transitions.length; i++) {
            var transition = $transitions[i];
            var tButton = $canvas.display.rectangle({
                x: width + anchor.abs_x + width * 0.165, y: width * 0.165 + anchor.abs_y + i * width,
                height: width * 0.66, width: width * 0.66, stroke: "2px red"
            });


            tButton.Tname = "" + transition.name;
            tButton.Transref = Trans;
            tButton.mouseHover = false;
            var ttext = $canvas.display.text({
                x: tButton.width / 2, y: tButton.width / 2,
                origin: { x: "center", y: "center" },
                font: "bold 25px sans-serif",
                text: transition.name,
                fill: "#fff"
            });

            tButton.addChild(ttext);
            tButton.add();
            tButton.bind("mouseenter", function () {
                console.log("entered " + this.Tname);
                this.mouseHover = true;
                this.children[0].fill = "green";
                var s = this.Transref.lineref;
                if (!s.added) {
                    this.remove();
                }
            });
            tButton.bind("mouseleave", function () {
                tButton.mouseHover = false;
                this.children[0].fill = "#fff";

            });
            tButton.bind("click", function () {
                transText.text = this.Tname;

                transText.redraw();
            });
            anchor.TransButtons.push(tButton);
        }
    });
}

function anchorHoverMouse(anchor) {
    var aRect = {
        left: anchor.abs_x, bottom: anchor.abs_y + anchor.height,
        top: anchor.abs_y, right: anchor.abs_x + anchor.width
    };

    var mp = mousePos();

    return ((aRect.left <= mp.x &&
        mp.x <= aRect.right &&
        aRect.top <= mp.y &&
        mp.y <= aRect.bottom));
}

function isEmpty(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}