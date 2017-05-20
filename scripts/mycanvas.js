jQuery(document).ready(function ($) {

    //global vars
    $nodes = [];
    $transitions = [];   //not used yet
    $edges = [];      //not used yet
    $PNstates = [];
    $places = [];
    selected = null;
    edgePending = null;
    nodeIsMoving = false;
    petrinetStates = [];
    currentState = null;
    $selectedNodes = [];
    $stateManager = new StateManager();
    $buttons = [];

    mycanvas = document.getElementById("canvas");
    context = mycanvas.getContext("2d");
    mycanvas.width = $(window).width();
    mycanvas.height = $(window).height();
    var $canvasDOM = $("#canvas");
    var canvasOffset = $canvasDOM.offset();
    var scrollX = $canvasDOM.scrollLeft();
    var scrollY = $canvasDOM.scrollTop();

    $canvas = oCanvas.create({
        canvas: '#canvas',
        background: '#2c3e50',
        fps: 60,
    });

    $canvas.defaultState = new canvasDefaultState();
    $canvas.selectionState = new canvasSelectionState();
    $canvas.executionState = new canvasExecutionState();
    $canvas.edgePendingState = new canvasEdgePendingState();
    $canvas.currentState = $canvas.defaultState;

    //bool for selection box display. NYI
    $dragging = false;
    $selectionBox = $canvas.display.rectangle({
        x: 0, y: 0, width: 0, height: 0, fill: "#0aa", opacity: 0
    }).add();

    //right click on canvas override
    $canvasDOM.contextmenu(function () { return false; });

    $canvas.bind("click tap", function (event) { $canvas.currentState.Click(event); });
    $canvas.bind("mouseup", function (event) { $canvas.currentState.MouseUp(event); });
    $canvas.bind("mousemove", function (event) { $canvas.currentState.MouseMove(event); });
    $canvas.bind("mousedown", function (event) { $canvas.currentState.MouseDown(event); });
    $canvas.bind("keydown", function (event) { $canvas.currentState.KeyDown(event); });
    $canvas.bind("keypress", function (event) { $canvas.currentState.KeyPress(event); });
    $canvas.bind("keyup", function (event) { $canvas.currentState.KeyUp(event); });

    initMenu();

    function initMenu() {
        $addPlaceButton = new AddPlaceButton(10, 10, 100, 50, "Add node (A)");
        $addEdgeButton = new AddEdgeButton(120, 10, 100, 50, "Add Edge (E)");
        selected = new Button(230, 10, 100, 50, "None selected");
        selected.current = null
        $executionButton = new ExecutionButton(340, 10, 100, 50, "Execute");
        $buttons.push($addPlaceButton, $addEdgeButton, selected, $executionButton);
    }



});



