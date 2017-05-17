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
    $dragging = false;
    $selectionBox = $canvas.display.rectangle({
        x: 0, y: 0, width: 0, height: 0, fill: "#0aa", opacity: 0
    }).add();

    //right click on canvas override
    $canvasDOM.contextmenu(function () { return false; });

    $canvas.bind("click tap", function (event) { this.currentState.Click(event); });
    $canvas.bind("mouseup", function (event) { this.currentState.MouseUp(event); });
    $canvas.bind("mousemove", function (event) { this.currentState.MouseMove(event); });
    $canvas.bind("mousedown", function (event) { this.currentState.MouseDown(event); });
    $canvas.bind("keydown", function (event) { this.currentState.KeyDown(event); });
    $canvas.bind("keypress", function (event) { this.currentState.KeyPress(event); });
    $canvas.bind("keyup", function (event) { this.currentState.KeyUp(event); });


    initMenu();

    function initMenu() {
        $addPlaceButton = new AddPlaceButton(10, 10, 100, 50, "Add node (A)");
        $addEdgeButton = new AddEdgeButton(120, 10, 100, 50, "Add Edge (E)");

        selected = new Button(230, 10, 100, 50, "None selected");
        selected.current = null
        $executionButton = new ExecutionButton(340, 10, 100, 50, "Execute");

    }



    function edgePlacementValidation(node) {
        if (selected.current === node) { console.log('cant point to self!'); return false; }
        if (selected.current.constructor == node.constructor) { console.log("same type!"); return false; }

        var mapped = node.incomingEdges.map(function (item) { return item.From; });
        if ($.inArray(selected.current, mapped) != -1) { console.log("edge already exists"); return false; }

        return true;
    }

    function deselect() {
        selected.current = null;
        selected.children[0].text = "None selected";
        selected.redraw();
    }

    function createEdge(nodeA, nodeB) {
        var line = $canvas.display.line({
            start: { x: nodeA.x, y: nodeA.y },
            end: { x: nodeB.x, y: nodeB.y },
            stroke: "11px #0aa",
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
            rotation: 0, fill: "#0da"
        });

        line.addChild(triangle);

        // lineOnEdge(nodeA);
        // lineOnEdge(nodeB);
        $canvas.addChild(line);
        line.zIndex = 0;
        triangle.zIndex = 3;    //doesnt work?

        nodeB.lineOnEdge();
        nodeA.lineOnEdge();
    }

    
});



