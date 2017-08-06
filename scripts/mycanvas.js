jQuery(document).ready(function ($) {
    //these are the original global color setting. 
    $colorSettings = {
        petrinetState:
        {
            stroke: "5px #f46e42",
            correctStroke: "5px green",
            incorrectStroke: "5px red",
            selectionCircle: "3px orange"
        },
        place:
        {
            stroke: "5px red",
            nameColor: "#0ba",
            tokenColor: "#0ba",
            selectionCircle: "3px orange"
        },
        transition:
        {
            stroke: "5px red",
            nameColor: "#0ba",
            readyFireStroke: "5px green",
            selectionCircle: "3px orange"
        },
        edge:
        {
            stroke: "11px #0aa",
            correctStroke: "11px green",
            incorrectStroke: "11px red",
            arrow: "#0da",
            incorrectArrow: "red",
            correctArrow: "green",
        }
    };

    //global vars
    $nodes = [];
    $transitions = [];   //not used yet
    $edges = [];      //not used yet
    $PNstates = [];
    $simulationStates = [];
    $places = [];
    $selected = null;
    $selectedButton = null;
    edgePending = null;
    nodeIsMoving = false;
    petrinetStates = [];
    currentState = null;
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
    $selectionBox = $canvas.display.rectangle({ x: 0, y: 0, width: 0, height: 0, fill: "#0aa", opacity: 0 }).add();

    //right click on canvas override
    $canvasDOM.contextmenu(function () { return false; });

    $canvas.bind("click tap", function (event) { $canvas.currentState.Click(event); if (event.which == 2) console.log('states', $PNstates) });
    $canvas.bind("mouseup", function (event) { $canvas.currentState.MouseUp(event); });
    $canvas.bind("mousemove", function (event) { $canvas.currentState.MouseMove(event); });
    $canvas.bind("mousedown", function (event) { $canvas.currentState.MouseDown(event); });
    $canvas.bind("keydown", function (event) { $canvas.currentState.KeyDown(event); });
    $canvas.bind("keypress", function (event) { $canvas.currentState.KeyPress(event); });
    $canvas.bind("keyup", function (event) { $canvas.currentState.KeyUp(event); drawbbox(event); });

    initMenu();


});



