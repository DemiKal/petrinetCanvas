jQuery(document).ready(function ($) {
    //global vars
    $nodes = []
    $transitions = []   //not used yet
    $edges = []         //not used yet

    selected = null;
    edgePending = null;
    nodeIsMoving = false;
    petrinetStates = [];
    currentState = null;

    var aa = new DrawingObject();

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
    $canvasDOM.contextmenu(function () {
        return false;
    });

    $canvas.bind("click tap", function (event) { state.currentState.canvasClick(event); });

    $canvas.bind("mouseup", function () {
        dragging = false;
        selectionBox.opacity = 0;
        selectionBox.x = 0;
        selectionBox.y = 0;
        selectionBox.width = 0;
        selectionBox.height = 0;
    });

    $canvas.bind("mousemove", function () {
        if (edgePending) {
            edgePending.end = { x: $canvas.mouse.x, y: $canvas.mouse.y };
            edgePending.redraw();
        }

        if (dragging && !nodeIsMoving) {
            selectionBox.opacity = 0.5;
            selectionBox.width = $canvas.mouse.x - selectionBox.x;
            selectionBox.height = $canvas.mouse.y - selectionBox.y;
        }
    });

    $canvas.bind("mousedown", function (event) {
        dragging = true;
        selectionBox.x = $canvas.mouse.x;
        selectionBox.y = $canvas.mouse.y;
        selectionBox.opacity = 0.5;
    })

    $canvas.bind("keydown", function (event) { console.log(state.currentState); state.currentState.keydownEvent(event); })

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
        var selectionCircle = $canvas.display.ellipse({ x: 5, y: 50, radius: 55, stroke: "3px orange", }).add();

        var coords = createButton(10, 70, 100, 50, "x/y");
        $canvas.setLoop(function () {
            coords.children[0].text = "X: " + $canvas.mouse.x + " / Y: " + $canvas.mouse.y;;

            //TODO STATE
            if (selected.current) {
                var offset = 0;
                if (selected.current.nodeType == "transition") offset = selected.current.width / 2; //todo: turn into instanceOf instead of string

                selectionCircle.x = selected.current.x + offset;
                selectionCircle.y = selected.current.y + offset;
                selectionCircle.opacity = 100;
            }
            else selectionCircle.opacity = 0;
        }).start();

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

