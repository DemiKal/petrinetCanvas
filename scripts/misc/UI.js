
function initUI() {
    //file input has to be triggered via javascript
    $("#fileinput").change(function (e) { onChange(e); });

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

    $saveLogButton = createButton(670, 10, 100, 50, "Save log file", "press this to save the user's action to a log file.\nThis can be used for analysis and reconstruction");
    $saveLogButton.bind("click tap", function (event) { event.stopPropagation(); saveLog(); });

    $saveGraphButton = createButton(780, 10, 100, 50, "Save graph to file", "Save this graph to a file to open it at another time.");
    $saveGraphButton.bind("click tap", function (event) { event.stopPropagation(); SaveGraph(); });

    $openFileButton = createButton(890, 10, 100, 50, "Open file", "Load a petrinet graph from a file");
    $openFileButton.bind("click tap", function (event) { event.stopPropagation(); $('#fileinput').trigger('click'); });

    $deleteButton = createButton(400, 400, 100, 50, "delete", "delete");
    $deleteButton.bind("click tap", function (event) { event.stopPropagation(); deleteAll(); });

    $buttons.push($addPlaceButton, $addEdgeButton, $selectedButton, $executionButton, $validationButton);

}
function deleteAll() {
    var nodes = $.extend([], $nodes);
    nodes.forEach(function (element) { element.remove(); }, this);
    $nodes = $transitions = $places = $PNstates = [];
}


function OpenFile(evt) {
    var files = evt.target.files;
    var file = files[0];
    var reader = new FileReader();

    reader.onload = function (event) {


        try {
            var newObjects = JSON.parse(event.target.result);
            LoadGraph(newObjects)
        } catch (e) {

            //TODO: THROW A USER ERROR
            ErrorPopup("Can only upload a JSON file!")
            return false;
        }


    }

    reader.readAsText(file)
}



//recreate the nodes from the JSON file
function LoadGraph(graph) {
    var transitions = graph.transitions;
    var places = graph.places;
    var places = graph.transitions;

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
        var newObj = copygeneralObjData(element)
        transitionData.push(newObj)
    });

    places.forEach(function (element) {
        var newObj = copygeneralObjData(element)
        newObj.tokens = element.tokens;
        placeData.push(newObj)
    });
    pnStates.forEach(function (element) {
        var newObj = copygeneralObjData(element);
        newObj.activePlaces = element.activePlaces;
        pnStateData.push(newObj)
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
    rect.bind("mouseenter", function (event) { event.stopPropagation(); this.fill = "orange"; this.redraw(); });
    rect.bind("mouseleave", function (event) { event.stopPropagation(); this.fill = "black"; this.redraw(); });
    return rect;
}

//when file has been uploaded
function onChange(event) { OpenFile(event); }