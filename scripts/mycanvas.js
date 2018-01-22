//this is the entry for js scripts
jQuery(document).ready(function ($) {
    // initColorSettings();
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
    //collection of all clickable popups that should be all deleted at once at will
    $clickablePopups = [];

    //$currentPortfolio = null;   //db portfolio for level selection
    $username = "John";

    //the list of actions that should be written to a (database) file. 
    //Currently a huge string.
    $validateButton = null; //for tutorial purpose
    $achievements = [];
    $actions = "";
    $nodes = [];
    $transitions = [];
    $edges = [];
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
    $CommandManager = new CommandManager();
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
        canvas: "#canvas",
        background: "linear-gradient(#e5efff, white)",
        fps: 60,
    });

    $commandManager = new CommandManager();

    //create simple error message box
    $errorMessage = CreatePopupMessage({ x: 0, y: 0 }, "errormessage");
    $errorMessage.opacity = 0;

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

    //bind the input events to the canvas.
    $canvas.bind("click tap", function (event) { $canvas.currentState.Click(event); });
    $canvas.bind("mouseup", function (event) { $canvas.currentState.MouseUp(event); });
    $canvas.bind("mousemove", function (event) { $canvas.currentState.MouseMove(event); });
    $canvas.bind("mousedown", function (event) { $canvas.currentState.MouseDown(event); });
    $canvas.bind("keydown", function (event) { $canvas.currentState.KeyDown(event); });
    $canvas.bind("keypress", function (event) { $canvas.currentState.KeyPress(event); });
    $canvas.bind("keyup", function (event) { $canvas.currentState.KeyUp(event); });


    createAchievements();
    initMainMenu();
});

function xml(queryObj) {
    if (queryObj == "") {
        //document.getElementById("txtHint").innerHTML = "";
        return;
    }
    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else {  // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            //document.getElementById("txtHint").innerHTML = this.responseText;
            console.log("GET request finished!");
            sss.fill = "hsl(" + Math.random() * 360 + ", 50%, 50%)";
            console.log(this.responseText);
            var obje = JSON.parse(this.responseText);

        }
    };

    var req = "php/test.php?";
    var toQstring = jQuery.param(queryObj);
    var full_url = req + toQstring;
    xmlhttp.open("GET", full_url, true);
    xmlhttp.send();
}







