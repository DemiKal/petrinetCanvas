
function initUI() {
    //file input has to be triggered via javascript
    $("#fileinput").change(function (e) { onChange(e); });
    // document.getElementById("fileinput").addEventListener("change", function (e) {
    // 	onChange(e);
    // });
    $currentState = "Default";
    createUpperNavBar();

    // $addPlaceButton = new AddPlaceButton(10, 10, 100, 50, "Add node (A)");
    // $addEdgeButton = new AddEdgeButton(120, 10, 100, 50, "Add Edge (E)");
    // $selectedButton = new Button(230, 10, 100, 50, "None selected");
    // $selected = null;
    // $executionButton = new ExecutionButton(340, 10, 100, 50, "Execute");
    // $validationButton = new Button(450, 10, 100, 50, "Validate");
    // $validationButton.bindManual();
    // $resetColorsButton = new Button(560, 10, 100, 50, "Reset Colors");
    // $resetColorsButton.bindManual();

    // //this should later be implemented in its own class
    // $validationButton.drawObject.bind("click tap", function (event) { event.stopPropagation(); initSimulation(); console.log("Clicked on validation button"); });
    // $validationButton.helpMessage = $validationButton.AddHelpMessage("Click this button to get feedback on\nYour reachability graph.");

    // $resetColorsButton.drawObject.bind("click tap", function (event) { event.stopPropagation(); ResetAllColors(); });
    // $resetColorsButton.helpMessage = $resetColorsButton.AddHelpMessage("Reset colors of your reachability graph");

    // $saveLogButton = createButton(670, 10, 100, 50, "Save log file", "press this to save the user's action to a log file.\nThis can be used for analysis and reconstruction");
    // $saveLogButton.bind("click tap", function (event) { event.stopPropagation(); saveLog(); });

    // $saveGraphButton = createButton(780, 10, 100, 50, "Save graph to file", "Save this graph to a file to open it at another time.");
    // $saveGraphButton.bind("click tap", function (event) { event.stopPropagation(); SaveGraph(); });

    // $openFileButton = createButton(890, 10, 75, 25, "Open file", "Load a petrinet graph from a file");
    // $openFileButton.bind("click tap", function (event) {
    // 	event.stopPropagation();
    // 	$("#fileinput").trigger("click");
    // });

    // $deleteButton = createButton(400, 400, 100, 50, "delete", "delete");
    // $deleteButton.bind("click tap", function (event) { event.stopPropagation(); deleteAll(); });

    // $buttons.push($addPlaceButton, $addEdgeButton, $selectedButton, $executionButton, $validationButton);

}
function triggerOpenFile() {
    $("#fileinput").trigger("click");
}

function readyCheckTransitions() {
    $nodes.forEach(function (node) {
        if (node instanceof Transition)
            node.readyCheck();
        else node.originalTokens = node.tokens;  //remember token amount before execution
    });

    $nodes.forEach(function (element) { element.dragAndDrop(false); });

}

function ExecuteGraph() {
    //TODO: DONT CLICK YET!!!fix!!
    var execButton = $graphButton.children[1];
    if ($currentState != "Execution") {

        execButton.fill = "#ffa468";
        execButton.children[0].text = "Stop Execution";
        execButton.redraw();

        deselect();
        $stateManager.SwitchToExecutionState();
        readyCheckTransitions();
    }

    else {
        deselect();
        console.log("clicked on exec button in exec state");

        $transitions.forEach(t => t.ResetColors());
        $places.forEach(p => p.tokens = p.originalTokens);
        $nodes.forEach(n => n.AddDragAndDrop());

        execButton.fill = "black";
        execButton.children[0].text = "Execute";

        $stateManager.SwitchToDefaultState();
    }

}

function createUpperNavBar() {
    var height = 0.075 * mycanvas.height;
    var upperBar = $canvas.display.rectangle({
        x: 0, y: 0,
        width: mycanvas.width,
        height: height,
        fill: "#99c0ff"
    }).add();

    $fileButton = createFileDropdown();
    $graphButton = createGraphDropdown();
    $addButton = createAddDropdown();
    $selectedButton = new Button((3 * (75 + 5)) + 10, 10, 75, 25, "None selected"); //createSelectionButton((3 * (75 + 5)) + 10, 10, 75, 25, "None selected");
    $selected = null;
    $coordDisplay = createCoordLabel((4 * (75 + 5)) + 10, 10, 75, 25, "X:0/Y:0");
}

function placeholder() { }
function createCoordLabel(x, y, width, height, text) {
    var label = createLabel(x, y, width, height, text);
    $canvas.setLoop(function () {
        var mousepos = { x: $canvas.mouse.x, y: $canvas.mouse.y };
        label.children[0].text = `X:${mousepos.x}/Y:${mousepos.y}`;
        this.redraw();
    }).start();

}

function createSelectionButton(x, y, width, height, text) {
    var rect = $canvas.display.rectangle({
        x: x,
        y: y,
        width: width,
        height: height,
        fill: "#000"
    }).add();

    var buttonText = $canvas.display.text({
        x: rect.width / 2,
        y: rect.height / 2,
        origin: { x: "center", y: "center" },
        font: "bold 10px sans-serif",
        text: text,
        fill: "#fff"
    });

    rect.addChild(buttonText);
    return rect;
}




function createFileDropdown() {
    var submenus = ["New file", "Open", "Save"];
    var functions = [deleteAll, triggerOpenFile, SaveGraph];
    var button = createDropDown(10, 10, 75, 25, "File", submenus, functions);
    return button;
}

function createGraphDropdown() {
    var submenus = ["Execute", "Reset colors", "Validate"];
    var functions = [ExecuteGraph, ResetAllColors, initSimulation];
    var button = createDropDown((1 * 75 + 5) + 10, 10, 75, 25, "Graph", submenus, functions);
    return button;
}

function createAddDropdown() {
    var submenus = ["+ node", "+ Transition", "+ Petrin. state"];
    var functions = [AddPlace, SpawnTransition, SpawnPNState];
    var button = createDropDown((2 * (75 + 5)) + 10, 10, 75, 25, "Add", submenus, functions);
    return button;
}

function AddplaceViaButton() {
    var midscreen = { x: mycanvas.width / 2, y: mycanvas.height / 2 };
    AddPlace(midscreen, false);
}
function createDropDown(x, y, width, height, text, subs, functions) {
    var mainbutton = $canvas.display.rectangle({
        x: x, y: y,
        width: width,
        height: height,
        fill: "black"
    });

    var buttonText = $canvas.display.text({
        x: mainbutton.width / 2,
        y: mainbutton.height / 2,
        origin: { x: "center", y: "center" },
        font: "bold 10px sans-serif",
        text: text,
        fill: "#fff"
    });
    mainbutton.addChild(buttonText);
    mainbutton.add();



    AddSubButtons(mainbutton, subs, functions);
    mainbutton.bind("mouseenter", function (event) { showSubmenus(this.children, 1); });
    mainbutton.bind("mouseleave", function (event) { showSubmenus(this.children, 0); });

    var subButtons = mainbutton.children.slice(1);


    return mainbutton;

}

function showSubmenus(allChildren, opacity) {
    allChildren.slice(1).forEach(function (elem) {
        elem.opacity = opacity;
        elem.redraw();
    });
}

function AddSubButtons(mainbutton, names, functions) {
    var subButtons = [];
    for (var index = 0; index < names.length; index++) {
        var txt = names[index];

        var sub1 = $canvas.display.rectangle({
            x: 0, y: (mainbutton.height - 1) * (1 + index),
            width: mainbutton.width, height: mainbutton.height,
            fill: "black",
            opacity: 0

        });

        var sub1txt = $canvas.display.text({
            x: sub1.width / 2,
            y: sub1.height / 2,
            origin: { x: "center", y: "center" },
            font: "bold 10px sans-serif",
            text: txt,
            fill: "#fff"
        });

        sub1.bind("click", function (event) {
            event.stopPropagation();
            console.log(`clicked ${this.children[0].text}`);
        });

        mainbutton.addChild(sub1);
        sub1.addChild(sub1txt);
        subButtons.push(sub1);
    }

    //add submenu functions
    subButtons.forEach(function (sub, index) {
        var func = functions[index];
        sub.bind("mouseenter", function (event) { event.stopPropagation(); this.fill = "orange"; this.redraw(); });
        sub.bind("mouseleave", function (event) { event.stopPropagation(); this.fill = "black"; this.redraw(); });
        sub.bind("click", function (event) { event.stopPropagation(); func(); });
    });
}

function deleteAll() {
    var nodes = $.extend([], $nodes);
    nodes.forEach(function (element) { element.remove(); }, this);
    $nodes = [];
    $transitions = [];
    $places = [];
    $PNstates = [];
}


function OpenNewGraph(evt) {
    var files = evt.target.files;
    var file = files[0];
    var reader = new FileReader();

    reader.onload = function (event) {
        var newObjects;
        try {
            newObjects = JSON.parse(event.target.result);
            console.log("reading done");
        } catch (e) {

            //TODO: THROW A USER ERROR
            ErrorPopup("Can only upload a JSON file!");
            return false;
        }

        LoadGraph(newObjects);
    };

    reader.readAsText(file);
}



//recreate the nodes from the JSON file
function LoadGraph(graph) {
    deleteAll();
    var newNodes = [];
    var transitions = graph.transitions;
    var places = graph.places;
    var PNstates = graph.PNstates;
    var edges = graph.edges;
    var newTransitions = [];
    var newPlaces = [];
    var newPNstates = [];

    transitions.forEach(function (t) {
        var x = new Transition(t.x, t.y, t.width, t.height);
        newTransitions.push(x);
    });
    newNodes = newNodes.concat(newTransitions);

    places.forEach(function (t) {
        var x = new Place(t.x, t.y, t.radius, t.name, t.tokens);
        newPlaces.push(x);
    });
    newNodes = newNodes.concat(newPlaces);

    PNstates.forEach(function (t) {
        var x = new PetriNetState(t.x, t.y, t.width, t.height);
        x.activePlaces = t.activePlaces;
        x.name = t.name;
        newPNstates.push(x);
    });
    newNodes = newNodes.concat(newPNstates);

    edges.forEach(function (e) {
        var from = findNode(newNodes, e.from);
        var to = findNode(newNodes, e.to);
        createEdge(from, to);
    });

    $nodes = newNodes;
    $places = newPlaces;
    $transitions = newTransitions;
    $PNstates = newPNstates;
    $nodes.forEach(x => x.redraw());
    $("#fileinput").val("");

}

function findNode(array, name) {
    for (var index = 0; index < array.length; index++) {
        var element = array[index];
        if (element.name == name)
            return element;
    }
}

function SaveGraph() {
    var allnodes = $.extend([], $nodes);
    var transitions = $.extend([], $transitions);
    var places = $.extend([], $places);
    var pnStates = $.extend([], $PNstates);

    var transitionData = [];
    var placeData = [];
    var pnStateData = [];
    var edgeData = [];

    var saveObject = {};

    transitions.forEach(function (element) {
        var newObj = copygeneralObjData(element);
        transitionData.push(newObj);
    });

    places.forEach(function (element) {
        var newObj = copygeneralObjData(element);
        newObj.tokens = element.tokens;
        newObj.radius = element.radius;
        placeData.push(newObj);
    });

    pnStates.forEach(function (element) {
        var newObj = copygeneralObjData(element);
        newObj.activePlaces = element.activePlaces;
        pnStateData.push(newObj);
    });

    //get edges
    allnodes.forEach(function (element) {
        var newObj = {};
        newObj.name = element.name;

        //only consider outgoing edges per node otherwise there'll be duplication
        element.outgoingEdges.forEach(function (edge) {
            var edgeObj = {};
            edgeObj.from = edge.From.name;
            edgeObj.to = edge.To.name;
            edgeData.push(edgeObj);
        });
    }, this);

    saveObject.transitions = transitionData;
    saveObject.places = placeData;
    saveObject.PNstates = pnStateData;
    saveObject.edges = edgeData;
    var objString = JSON.stringify(saveObject);
    var blob = new Blob([objString], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "save file of user.json");
}

function copygeneralObjData(original) {
    var newObj = {};
    newObj.name = original.name;
    newObj.x = original.x;
    newObj.y = original.y;
    newObj.width = original.width;
    newObj.height = original.height;
    newObj.type = original.constructor.name;
    return newObj;

}

//this is an alternative method to buttons since the orignal is bugged and has to be fixed.
function createButton(x, y, width, height, text, helpmessage) {
    var rect = createLabel(x, y, width, height, text, helpmessage);
    rect.bind("mouseenter", function (event) { event.stopPropagation(); this.fill = "orange"; this.redraw(); });
    rect.bind("mouseleave", function (event) { event.stopPropagation(); this.fill = "black"; this.redraw(); });
    return rect;
}

function createLabel(x, y, width, height, text) {
    var rect = $canvas.display.rectangle({
        x: x,
        y: y,
        width: width,
        height: height,
        fill: "#000"
    }).add();

    var buttonText = $canvas.display.text({
        x: rect.width / 2,
        y: rect.height / 2,
        origin: { x: "center", y: "center" },
        font: "bold 10px sans-serif",
        text: text,
        fill: "#fff"
    });

    rect.addChild(buttonText);
    return rect;
}


//when file has been uploaded
function onChange(event) {

    OpenNewGraph(event);
}