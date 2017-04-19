
jQuery(document).ready(function ($) {
    var nodes = []
    var transitions = []
    var edges = []
    var selected;
    var edgePending = null;

    class Place {
        constructor(x, y, radius, text, tokens) {
            this.drawObject = createNode(x, y, radius, text, tokens)
        }
    }

    class Istate {
        constructor() { }
        canvasClick() { }
        canvasDoubleClick() { }
        placeClick() { }
        transitionClick() { }
        AddnodeClick() { }
        AddEdgeClick() { }
        SelectedButtonUpdate() { }
        keydownEvent() { }
    }


    class DefaultState extends Istate {
        constructor() { super(); }

        canvasClick(node, event) {
            //clicked on empty spot -> deselect
            deselect();
        }
        canvasDoubleClick() { }
        placeClick(node, event) {
            console.log(' clicked on ');
            console.log(node.name);
            console.log(event);

            //set current place as selected
            selected.children[0].text = "Selected: " + node.name;
            selected.current = node;
            selected.redraw();
            event.stopPropagation();
            state.currentState = state.selectionState;
        }

        transitionClick(node, event) {
            selected.children[0].text = "Selected: " + node.name;
            selected.current = node;
            selected.redraw();
            event.stopPropagation();
            state.currentState = state.selectionState;
        }
        AddnodeClick() { }
        AddEdgeClick() {
            console.log("select node first!")
        }
        keydownEvent(event) {

            if (event.which == 84)
                nodes.push(createTransition(300, 300, 100, "cheeki breeki"));
        }
    }

    class SelectionState extends Istate {
        constructor() { super(); }
        canvasDoubleClick() { }
        canvasClick() {
            deselect();
            state.currentState = state.defaultState;
            //console.log(state);
        }

        placeClick(node, event) {
            //    console.log(' del event: ')
            // console.log(event)

            //switch to selected
            selected.children[0].text = "Selected: " + node.name;
            selected.current = node;
            selected.redraw();
            event.stopPropagation();
        }

        transitionClick(node, event) {
            selected.children[0].text = "Selected: " + node.name;
            selected.current = node;
            selected.redraw();


            event.stopPropagation();
        }
        AddnodeClick() { }
        AddEdgeClick() {

            var line = canvas.display.line({
                start: { x: selected.current.x, y: selected.current.y },
                stroke: "11px #0aa",
                cap: "round"
            }).add();

            edgePending = line;

            //switch state
            state.currentState = state.edgePendingState;

        }
        keydownEvent() { }
    }

    class ExecutionState extends Istate {
        constructor() { super(); }
        canvasClick() { }
        placeClick() { }
        transitionClick() { }
        AddnodeClick() { }
        AddEdgeClick() { }
        keydownEvent() { }
    }

    function edgePlacementValidation(node) {
        if (selected.current === node) {
            console.log('cant point to self!')
            return false;
        }
        if (selected.current.nodeType == node.nodeType) {
            console.log("same type!")
            console.log(selected.current);
            console.log(node);
            return false;
        }

        var mapped = node.incomingEdges.map(function (item) { return item.From; });

        if ($.inArray(selected.current, mapped) != -1) {
            console.log("edge already exists");
            return false;
        }

        return true;
    }
    class EdgePendingState extends Istate {
        constructor() { super(); }
        canvasClick() {
            console.log("click on an object")
        }

        placeClick(node, event) {

            if (!edgePlacementValidation(node)) return;

            var newEdge = createEdge(selected.current, node);
            selected.current = null;
            edgePending.remove();
            edgePending = null;

            //switch states
            state.currentState = state.defaultState;
        }

        transitionClick(node, event) {
            if (!edgePlacementValidation(node)) return;

            var newEdge = createEdge(selected.current, node);
            selected.current = null;
            edgePending.remove();
            edgePending = null;

            //switch states
            state.currentState = state.defaultState;

        }

        AddnodeClick() { }
        AddEdgeClick() { }
        keydownEvent(event) {
            edgePending.remove();
            edgePending = null;

            state.currentState = state.selectionState;
        }
    }

    class State {
        constructor() {
            this.defaultState = new DefaultState();
            this.selectionState = new SelectionState();
            this.executionState = new ExecutionState();
            this.edgePendingState = new EdgePendingState();
            this.currentState = this.defaultState;
        }
    }

    mycanvas = document.getElementById("canvas");
    context = mycanvas.getContext("2d");
    mycanvas.width = $(window).width();
    mycanvas.height = $(window).height();;
    var $canvas = $("#canvas");
    var canvasOffset = $canvas.offset();
    var scrollX = $canvas.scrollLeft();
    var scrollY = $canvas.scrollTop();

    var canvas = oCanvas.create({
        canvas: '#canvas',
        background: '#2c3e50',
        fps: 60,
    });

    var state = new State();

    $canvas.contextmenu(function () {
        return false;
    });

    canvas.bind("click tap", function (event) { state.currentState.canvasClick(event); });

    canvas.bind("mousemove", function () {
        if (edgePending) {
            edgePending.end = { x: canvas.mouse.x, y: canvas.mouse.y };
            edgePending.redraw();
        }
    });

    canvas.bind("keydown", function (event) { state.currentState.keydownEvent(event); })


    initMenu();

    //pseudo interface
    function deselect() {
        selected.current = null;
        selected.children[0].text = "None selected";
        selected.redraw();
        console.log("currently selected: ");
        console.log(selected.current)
    }


    function createEdge(nodeA, nodeB) {
        var line = canvas.display.line({
            start: { x: nodeA.x, y: nodeA.y },
            end: { x: nodeB.x, y: nodeB.y },
            stroke: "11px #0aa",
            cap: "butt"
        });

        nodeA.outgoingEdges.push(line);
        nodeB.incomingEdges.push(line);
        line.From = nodeA;
        line.To = nodeB;
        line.redraw();

        var triangle = canvas.display.polygon({
            x: 0,
            y: 0,
            sides: 3,
            radius: 20,
            rotation: 0,
            fill: "#0da"
        });
        line.addChild(triangle);

        lineOnEdge(nodeA);
        lineOnEdge(nodeB);
        canvas.addChild(line);
        line.zIndex = 0;
        triangle.zIndex = 3;    //doesnt work?

    }

    function initMenu() {
        var addNode = createButton(10, 10, 100, 50, "Add node");
        addNode.bind("click tap", function () { nodes.push(createNode(canvas.width / 2, canvas.height / 2, 50, "new node", 1)) });

        addNode.bind("mouseenter", function (event) { this.fill = "orange"; this.redraw() });
        addNode.bind("mouseleave", function (event) { this.fill = "black"; this.redraw() });
        addNode.bind("mousedown", function (event) { this.fill = "blue"; this.redraw() });
        addNode.bind("mouseup", function (event) { this.fill = "orange"; this.redraw() });

        var addEdge = createButton(120, 10, 100, 50, "Add Edge");
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
        var selectionCircle = canvas.display.ellipse({ x: 5, y: 50, radius: 55, stroke: "3px orange", }).add();

        var coords = createButton(10, 70, 100, 50, "x/y");
        canvas.setLoop(function () {
            coords.children[0].text = "X: " + canvas.mouse.x + " \\ " + "Y: " + canvas.mouse.y;;

            //TODO STATE
            if (selected.current) {
                var offset = 0;
                if (selected.current.nodeType == "transition") offset = selected.current.width / 2;
                selectionCircle.x = selected.current.x + offset;
                selectionCircle.y = selected.current.y + offset;
                selectionCircle.opacity = 100;
            }
            else selectionCircle.opacity = 0;
        }).start();

    }

    function createButton(x, y, width, height, text) {
        var button = canvas.display.rectangle({
            x: x,
            y: y,
            width: width,
            height: height,
            fill: "#000"
        }).add();

        var buttonText = canvas.display.text({
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

    function lineOnEdge(node) {
        var adjEdges = node.outgoingEdges.concat(node.incomingEdges);

        adjEdges.forEach(function (currentEdge) {

            var rectWidthFrom = currentEdge.From.width / 2;
            var rectWidthTo = currentEdge.To.width / 2;

            var subtractionRadius = Math.max(rectWidthFrom, rectWidthTo);

            var v1x = currentEdge.start.x = currentEdge.From.x + rectWidthFrom;
            var v1y = currentEdge.start.y = currentEdge.From.y + rectWidthFrom;
            var v2x = currentEdge.end.x = currentEdge.To.x + rectWidthTo;
            var v2y = currentEdge.end.y = currentEdge.To.y + rectWidthTo;

            var triangle = currentEdge.children[0];

            var vector = new Victor(v2x - v1x, v2y - v1y);

            var subvec = vector.clone().normalize().multiply(new Victor(subtractionRadius, subtractionRadius));

            currentEdge.start.x += subvec.x;
            currentEdge.start.y += subvec.y;
            currentEdge.end.x -= subvec.x;
            currentEdge.end.y -= subvec.y;




            // var offsetFromx = 0;
            // var offsetFromy = 0;
            // var offsetTox = 0;
            // var offsetToy = 0;

            // if (currentEdge.From.nodeType == "transition") {
            //     console.log('ADDING OFFSET1')
            //     offsetFromx = currentEdge.From.width / 2;
            //     offsetFromy = currentEdge.From.width / 2;
            //     console.log(offsetFromx);
            // }
            // if (currentEdge.To.nodeType == "transition") {
            //     console.log('ADDING OFFSET2')
            //     offsetTox = currentEdge.To.width / 2;
            //     offsetToy = currentEdge.To.width / 2;
            //     console.log();
            // }

            // var vx = (currentEdge.From.x - offsetFromx) - (currentEdge.To.x + offsetTox);
            // var vy = (currentEdge.From.y - offsetFromy) - (currentEdge.To.y + offsetToy);

            // //   console.log('fromtype: ' + currentEdge.From.nodeType)
            // //   console.log('totype: ' + currentEdge.To.nodeType)

            // var vector = new Victor(vx, vy);
            // var subVector = vector.clone().normalize().multiply(new Victor(node.radius, node.radius));

            // currentEdge.start.x = currentEdge.From.x - subVector.x;
            // currentEdge.start.y = currentEdge.From.y - subVector.y;

            // var sub2 = vector.clone().normalize().multiply(new Victor(triangle.radius, triangle.radius));
            // currentEdge.end.x = currentEdge.To.x + subVector.x + sub2.x;
            // currentEdge.end.y = currentEdge.To.y + subVector.y + sub2.y;

            var v2 = new Victor(v2x - v1x, v2y - v1y);
            triangle.rotation = v2.angleDeg();

            var vec = Victor(currentEdge.end.x - currentEdge.x, currentEdge.end.y - currentEdge.y);
            var vec3 = new Victor(currentEdge.To.strokeWidth + triangle.radius / 2, currentEdge.To.strokeWidth + triangle.radius / 2);
            var subVec = vec.clone().normalize().multiply(vec3);
            vec.subtract(subVec);

            triangle.x = vec.x;
            triangle.y = vec.y;
            currentEdge.end.x = triangle.abs_x;
            currentEdge.end.y = triangle.abs_y;
        });
    }

    function createTransition(x, y, radius, text) {
        var transition = canvas.display.rectangle({
            x: x, y: y,
            width: radius,
            height: radius,
            stroke: "5px red",
            name: text
        });

        var nodeText = canvas.display.text({
            x: radius / 2,
            y: radius,
            origin: { x: "center", y: "top" },
            font: "bold 30px sans-serif",
            text: text,
            fill: "#0ba"
        });

        transition.bind("click tap", function (event) { state.currentState.transitionClick(this, event); });

        transition.bind("dblclick ", function (event) {
            //fire(this);
        });

        transition.dragAndDrop({
            start: function () { },
            move: function () { lineOnEdge(transition); },
            end: function () { }
        });

        transition.addChild(nodeText);
        transition.incomingEdges = []
        transition.outgoingEdges = []
        transition.nodeType = "transition";
        transition.add();

        return transition;
    }

    function createNode(x, y, radius, text, tokens) {
        var node = canvas.display.ellipse({
            x: x, y: y,
            radius: radius,
            stroke: "5px red",
            name: text
        });

        var nodeText = canvas.display.text({
            x: 0,
            y: radius,
            origin: { x: "center", y: "top" },
            font: "bold 30px sans-serif",
            text: text,
            fill: "#0ba"
        });

        var tokenText = canvas.display.text({
            x: 0,
            y: 0,
            origin: { x: "center", y: "center" },
            font: "bold 30px sans-serif",
            text: tokens,
            fill: "#0ba"
        });

        node.bind("click tap", function (event) { state.currentState.placeClick(node, event); });
        node.bind("dblclick ", function (event) {            /*   fire(this);   */ });

        node.dragAndDrop({
            start: function () { },
            move: function () {
                lineOnEdge(node);
            },
            end: function () { }
        });

        node.addChild(nodeText);
        node.addChild(tokenText);
        node.incomingEdges = []
        node.outgoingEdges = []
        node.add();
        node.tokens = tokens;
        node.nodeType = "place";
        return node;
    }

    function fire(node) {
        if (node.tokens <= 0 || node.outgoingEdges.length == 0) return;

        node.tokens -= 1;
        updateTokens(node);

        node.outgoingEdges.forEach(function (element) {
            var adj = element.To;
            adj.tokens++;
            updateTokens(adj);

            var ball = canvas.display.ellipse({
                x: element.start.x, y: element.start.y,
                radius: 20,
                fill: "red",
            }).add();

            //ball.fadeOut("long", "ease-out-quint")

            ball.animate({
                x: element.end.x,
                y: element.end.y,
                opacity: 0
            },
                {
                    duration: "long",
                    easing: "ease-out-quint",
                    //callback: function () { ball.fadeOut("short", "linear") }
                });
        });
    }

    function updateTokens(node) {
        node.children[1].text = node.tokens;
        node.redraw();
    }
});

