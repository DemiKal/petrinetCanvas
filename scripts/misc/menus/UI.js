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
function fontToString(obj) {
    var str = "";
    if (obj.style)
        str += "" + obj.style;
    if (obj.size)
        str += " " + obj.size + "px";
    if (obj.type)
        str += " " + obj.type;

    return str;
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
        $places.forEach(t => t.ResetColors());
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
    $uppernavElements = [upperBar, $fileButton, $graphButton, $selectedButton, $addButton, $selectedButton, $coordDisplay];
}

function placeholder() { }
function createCoordLabel(x, y, width, height, text) {
    var label = createLabel(x, y, width, height, text);
    $canvas.setLoop(function () {
        var mousepos = { x: $canvas.mouse.x, y: $canvas.mouse.y };
        label.children[0].text = `X:${mousepos.x}/Y:${mousepos.y}`;
        this.redraw();
    }).start();
    return label;
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

function selectSavedGraphs() {
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var userGraphs = JSON.parse(this.responseText);

        }
    };

    var req = "php/getUserGraphs.php?";
    var param = "q=" + $userName;
    //var toQstring = jQuery.param(queryObj);
    //var full_url = req + toQstring;
    xmlhttp.open("GET", req, true);
    xmlhttp.send();
}

function saveGraphUser() {
    var mygraph = GraphToJSON();
    var mydata = { name: $username, title: "graph" + Math.random() * 100, graph: mygraph };
    if ($nodes.length == 0) return ErrorPopup("Can't save empty graphs!");
    $.ajax({
        type: "POST",
        dataType: "json",
        url: "php/test2.php",
        data: mydata,
        //contentType: "application/json; charset=utf-8",
        success: function (data) {
            console.log("Items added!!!!");
            ErrorPopup("Save succesful!");
        },
        error: function (e) {
            console.log("message:\n", e.message);
            ErrorPopup("Something went wrong!");
        }
    });
}

function openGraphUser() {
    var req = "php/getUserGraphs.php?";
    var toQstring = "name=" + $username;//jQuery.param(queryObj);
    var full_url = req + toQstring;

    var data = null;
    jQuery.ajax({
        url: full_url,
        success: function (result) {
            var res = JSON.parse(result);
            if (res.status != "OK") ErrorPopup("something went wrong!");
            else {
                data = createDatabasePortfolio(res);
            }
        },
        error: function (e) {
            console.log("message:\n", e.message);
            ErrorPopup("Something went wrong!");
        },
        async: false
    });
    return data;
}

//create selection window
function createDatabasePortfolio(alldata) {
    var data = alldata.graphs;
    var q = 5;
    var start = { x: mycanvas.width / q, y: mycanvas.height / q };
    var end = { x: mycanvas.width * ((q - 1) / q), y: mycanvas.height * ((q - 1) / q) };
    var width = end.x - start.x;
    var height = end.y - start.y;
    var rect = $canvas.display.rectangle({
        x: start.x, y: start.y,
        width: width,
        height: height,
        fill: "black",
        zIndex: "front"
    }).add();
    //var Opentext  = $canvas.display.text
    var openText = $canvas.display.text({
        x: 0,
        y: 0,
        origin: { x: "top", y: "left" },
        font: "bold 20px sans-serif",
        text: "Open a file",
        fill: "#fff",
        zIndex: "front"
    });
    rect.addChild(openText);
    w = 5;
    h = 2;
    var marginW = 0.1 * width;
    var marginH = 0.1 * height;
    var margin = Math.min(marginW, marginH);
    var startW = width / 5;
    var buttonwidth = buttonheight = 200;

    rect.width = margin * 2 + w * buttonwidth * 1.1;
    rect.height = margin * 2 + h * buttonheight * 1.1;
    rect.redraw();

    var xpos = 0.1 * start.x;
    var ypos = 0.1 * start.y;

    var graphButtons = [];

    for (let i = 0; i < data.length; i++) {
        var graph = data[i];
        var j_idx = Math.floor(i / w) % h;
        var i_idx = i % w;
        var graphButton = $canvas.display.rectangle({
            x: margin + i_idx * buttonwidth * 1.1, y: margin + j_idx * buttonheight * 1.1,
            width: buttonwidth,
            height: buttonheight,
            fill: "white",
            zIndex: "front"
        });

        var t = $canvas.display.text({
            x: buttonwidth / 2,
            y: buttonheight / 2,
            origin: { x: "center", y: "center" },
            font: "bold 25px sans-serif",
            text: i,
            fill: "#000",
            zIndex: "front"
        });

        graphButton.addChild(t);
        rect.addChild(graphButton);
        graphButtons.push(graphButton);
        graphButton.graphdata = data[i];


    }
    //selection level;
    $k = 0;
    var hw = h * w;
    graphbuttonselection(graphButtons, hw);

    var goRight = $canvas.display.polygon({
        x: width / 2 * 1.1, y: height * 0.9, sides: 3, radius: 30,
        rotation: 0, fill: "white"
    });
    var goLeft = $canvas.display.polygon({
        x: width / 2 * 0.9, y: height * 0.9, sides: 3, radius: 30,
        rotation: 180, fill: "white"
    });

    goRight.bind("click", function () {
        $k++;
        $k = $k % Math.ceil(data.length / hw);
        graphbuttonselection(graphButtons, hw);
        counter.text = getCounterval();
        counter.redraw();

    });
    var fo = function () { this.fill = "orange"; };
    var fw = function () { this.fill = "white"; };
    var getCounterval = () => "" + ($k + 1) + "/" + (Math.ceil(data.length / hw));
    goRight.bind("mouseenter", fo);
    goRight.bind("mouseleave", fw);
    goLeft.bind("mouseenter", fo);
    goLeft.bind("mouseleave", fw);

    goLeft.bind("click", function () {
        if ($k == 0) return;
        else $k--;
        graphbuttonselection(graphButtons, hw);
        counter.text = getCounterval();
        counter.redraw();
    });

    var counter = $canvas.display.text({
        x: width / 2,
        y: height * 0.9,
        origin: { x: "center", y: "center" },
        font: "bold 25px sans-serif",
        text: getCounterval(),
        fill: "#fff",
        zIndex: "front"
    });

    rect.addChild(goLeft);
    rect.addChild(goRight);
    rect.addChild(counter);
    rect.graphButtons = graphButtons;
    rect.redraw();
    alldata.rect = rect;
    return alldata;
}
function mousewhite(event) { this.fill = "white"; this.redraw(); }
function mouseorange(event) { this.fill = "orange"; console.log("entered", this.children[0].text); this.redraw(); }
function graphButtonClick(event) { LoadGraph(this.graphdata.graph); this.parent.remove(); }

function graphbuttonselection(graphButtons, hw) {
    for (let i = 0; i < graphButtons.length; i++) {
        const element = graphButtons[i];
        if (i < ($k + 1) * hw && i >= $k * hw) {
            element.opacity = 1;
            element.bind("mouseenter", mouseorange);
            element.bind("mouseleave", mousewhite);
            element.zIndex = "front";
            element.bind("click", graphButtonClick);

        }

        else {
            element.opacity = 0;
            element.unbind("mouseenter", mouseorange);
            element.unbind("mouseleave", mousewhite);
            element.zIndex = "back";
            element.unbind("click", graphButtonClick);
        }
        element.redraw();
    }
}
function openOnlineDB() { }
//refer to the commandmanager execution methods!
function createFileDropdown() {
    var submenus = ["New file", "Open offline", "Save offline", "Open online", "Upload graph", "Main menu"];
    var functions = [deleteAll, triggerOpenFile, SaveGraph, openGraphUser, saveGraphUser, enterMainMenu];
    var button = createDropDown(10, 10, 75, 25, "File", submenus, functions);
    $enterMainMenuButton = button.children[6];
    return button;
}

function createGraphDropdown() {
    var submenus = ["Execute", "Reset colors", "Validate"];
    var functions = [ExecuteGraph, ResetAllColors, initSimulation];
    var button = createDropDown((1 * 75 + 5) + 10, 10, 75, 25, "Graph", submenus, functions);
    $validateButton = button.children[3];
    return button;
}

function createAddDropdown() {
    var submenus = ["+ node", "+ Transition", "+ Petrin. state"];
    var functions = [AddPlaceRef, AddTransitionRef, SpawnPNState];
    var button = createDropDown((2 * (75 + 5)) + 10, 10, 75, 25, "Add", submenus, functions);
    return button;
}

//execution of an obj's function cant be referenced directly in  'strint mode'


function AddplaceViaButton() {
    var midscreen = { x: mycanvas.width / 2, y: mycanvas.height / 2 };
    // AddPlace(midscreen, false);
    $commandManager.AddPlace.execute();
}
function createDropDown(x, y, width, height, text, subs, functions) {
    var mainbutton = $canvas.display.rectangle({
        x: x, y: y,
        width: width,
        height: height,
        fill: "black",
        zIndex: "front"
    });

    var buttonText = $canvas.display.text({
        x: mainbutton.width / 2,
        y: mainbutton.height / 2,
        origin: { x: "center", y: "center" },
        font: "bold 10px sans-serif",
        text: text,
        fill: "#fff",
        zIndex: "front"
    });

    mainbutton.addChild(buttonText);
    mainbutton.add();
    mainbutton.zIndex = "front";
    AddSubButtons(mainbutton, subs, functions);
    mainbutton.bind("mouseenter", function (event) { showSubmenus(this.children, 1); });
    mainbutton.bind("mouseleave", function (event) { showSubmenus(this.children, 0); });
    var subButtons = mainbutton.children.slice(1);
    return mainbutton;

}

function showSubmenus(allChildren, opacity) {
    allChildren.slice(1).forEach(function (elem) {
        elem.opacity = opacity;
        //elem.redraw();
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
        sub.bind("click", function (event) {
            event.stopPropagation();
            func();
        });
    });
}

function deleteAll() {
    $nodes.forEach(function (e) {
        var cmd = new DeleteNodeCommand(e);
        cmd.Execute();
    });
    $clickablePopups.forEach(o => o.remove());
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

//TODO: prompt to save
function enterMainMenu() {
    deleteAll();
    deleteUppernavBar();
    initMainMenu();

}

function deleteUppernavBar() {
    $uppernavElements.forEach(e => e.remove());
}

//recreate the nodes from the JSON file
function LoadGraph(graph) {
    deleteAll();
    if (graph.transitions)
        graph.transitions.forEach(function (t) {
            var cmd = new AddTransitionCommand();
            cmd.Execute(false, false);
            cmd.node.x = parseInt(t.x);
            cmd.node.y = parseInt(t.y);
            cmd.node.name = t.name;

        });

    if (graph.places)
        graph.places.forEach(function (t) {
            var cmd = new AddPlaceCommand();
            cmd.Execute(false, false);
            cmd.node.x = parseInt(t.x);
            cmd.node.y = parseInt(t.y);
            cmd.node.tokens = parseInt(t.tokens);

        });
    if (graph.PNstates)//) != undefined /*|| PNstates.length > 0*/)
        graph.PNstates.forEach(function (t) {
            var cmd = new AddPNStateCommand();
            cmd.Execute(false, false);
            cmd.node.x = parseInt(t.x);
            cmd.node.y = parseInt(t.y);
            cmd.node.width = parseInt(t.width);
            cmd.node.activePlaces = parseInt(t.activePlaces);
            cmd.node.name = t.name;

        });

    if (graph.edges)
        graph.edges.forEach(function (e) {
            var from = findNode(e.from);
            var to = findNode(e.to);
            //createEdge(from, to);
            var cmd = new AddEdgeCommand(from, to);
            cmd.Execute();
        });

    $nodes.forEach(x => x.redraw());
    $("#fileinput").val("");    //fix??

}

function findNode(name) {
    for (var index = 0; index < $nodes.length; index++) {
        var element = $nodes[index];
        if (element.name == name)
            return element;
    }
}

function SaveGraph() {
    var saveObject = GraphToJSON();
    var objString = JSON.stringify(saveObject);
    var blob = new Blob([objString], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "save file of user.json");
}

function GraphToJSON() {
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
    return saveObject;
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