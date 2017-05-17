jQuery(document).ready(function ($) {



    //global vars
    $nodes = [];
    $transitions = [];   //not used yet
    $edges = [];      //not used yet
    $places = [];
    selected = null;
    edgePending = null;
    nodeIsMoving = false;
    petrinetStates = [];
    currentState = null;
    $selectedNodes = [];
    $stateManager = new StateManager();

    mycanvas = document.getElementById("canvas");
    context = mycanvas.getContext("2d");
    mycanvas.width = $(window).width();
    mycanvas.height = $(window).height();
    var $canvasDOM = $("#canvas");
    var canvasOffset = $canvasDOM.offset();
    var scrollX = $canvasDOM.scrollLeft();
    var scrollY = $canvasDOM.scrollTop();
    state = new State();
    $canvas = oCanvas.create({
        canvas: '#canvas',
        background: '#2c3e50',
        fps: 60,
    });

    $canvas.defaultState = new canvasDefaultState();
    $canvas.selectionState = new canvasSelectionState;
    $canvas.executionState = new canvasExecutionState;
    $canvas.currentState = $canvas.defaultState;

    //bool for selection box display
    var dragging;
    var selectionBox = $canvas.display.rectangle({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        fill: "#0aa",
        opacity: 0
    }).add();

    //right click on canvas override
    $canvasDOM.contextmenu(function () { return false; });

    $canvas.bind("click tap", function (event) {        this.currentState.Click(event);    });
    $canvas.bind("mouseup", function (event) {
        this.currentState.MouseUp(event);

        // dragging = false;
        // selectionBox.opacity = 0;
        // selectionBox.x = 0;
        // selectionBox.y = 0;
        // selectionBox.width = 0;
        // selectionBox.height = 0;
    });

    $canvas.bind("mousemove", function (event) {
        this.currentState.MouseMove(event);


        // if (edgePending) {
        //     edgePending.end = { x: $canvas.mouse.x, y: $canvas.mouse.y };
        //     edgePending.redraw();
        // }
        //
        // if (dragging && !nodeIsMoving) {
        //     selectionBox.opacity = 0.5;
        //     selectionBox.width = $canvas.mouse.x - selectionBox.x;
        //     selectionBox.height = $canvas.mouse.y - selectionBox.y;
        // }
    });

    $canvas.bind("mousedown", function (event) {this.currentState.MouseDown(event);});
    $canvas.bind("keydown", function (event) { this.currentState.KeyDown(event); });
    $canvas.bind("keypress", function (event) { this.currentState.KeyPress(event); });
    $canvas.bind("keyup", function (event) { this.currentState.KeyUp(event); });


    initMenu();

    function initMenu() {
        var addPlace = createButton(10, 10, 100, 50, "Add node (A)");
        var sa = 12;

        addPlace.bind("click tap", function () {
            state.currentState.AddnodeClick(addPlace);
        });

        addPlace.bind("mouseenter", function (event) { this.fill = "orange"; this.redraw() });
        addPlace.bind("mouseleave", function (event) { this.fill = "black"; this.redraw() });
        addPlace.bind("mousedown", function (event) { this.fill = "blue"; this.redraw() });
        addPlace.bind("mouseup", function (event) { this.fill = "orange"; this.redraw() });

        var addEdge = createButton(120, 10, 100, 50, "Add Edge (E)");
        addEdge.bind("mouseenter", function (event) { this.fill = "orange"; this.redraw() });
        addEdge.bind("mouseleave", function (event) { this.fill = "black"; this.redraw() });
        addEdge.bind("mousedown", function (event) { this.fill = "blue"; this.redraw() });
        addEdge.bind("mouseup", function (event) { this.fill = "orange"; this.redraw() });

        addEdge.bind("click", function (event) {
            state.currentState.AddEdgeClick();
            event.stopPropagation();
        })

        selected = createButton(230, 10, 100, 50, "None selected");
        selected.current = null

        var executionButton = createButton(340, 10, 100, 50, "Execute");
        executionButton.bind("mouseenter", function (event) { this.fill = "orange"; this.redraw() });
        executionButton.bind("mouseleave", function (event) { this.fill = "black"; this.redraw() });
        executionButton.bind("mousedown", function (event) { this.fill = "blue"; this.redraw() });
        executionButton.bind("mouseup", function (event) { this.fill = "orange"; this.redraw() });
        executionButton.bind("click tap", function (event) {
            event.stopPropagation();
            state.currentState.executionClick(this, event);
        });
    }

    function createButton(x, y, width, height, text) {
        var button = $canvas.display.rectangle({
            x: x,
            y: y,
            width: width,
            height: height,
            fill: "#000"
        }).add();

        var buttonText = $canvas.display.text({
            x: button.width / 2,
            y: button.height / 2,
            origin: { x: "center", y: "center" },
            font: "bold 10px sans-serif",
            text: text,
            fill: "#fff"
        });

        button.addChild(buttonText);

        return button;
    }

    
});

function AddTransition(pos) {
        var position = { x: $canvas.width / 2, y: $canvas.height / 2 };
        if (pos) position = pos;
        var name = "T" + ($transitions.length + 1);
        var width = 100;
        var height = 100;

        var trans = new Transition(pos.x - width / 2, pos.y - height / 2, 100, 100, name);
        $nodes.push(trans);
        $transitions.push(trans);
    }

    function AddPlace(pos) {
        var position = { x: $canvas.width / 2, y: $canvas.height / 2 };
        if (pos) position = pos;
        var name = "P" + ($places.length + 1);
        var newPlace = new Place(position.x, position.y, 50, name, 0);
        $nodes.push(newPlace);
        $places.push(newPlace);
    }