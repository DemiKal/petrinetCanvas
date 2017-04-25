jQuery(document).ready(function ($) {
    var canvas;
    var state;
    var nodes = []
    var transitions = []
    var edges = []
    var selected;
    var edgePending = null;
    var nodeIsMoving = false;

    ///
    /// CLASSES      
    ///

    // function xState() {
    //     this.Places;
    //     this.Transitions;
    //     this.From;
    //     this.To;
    // }

    class xState {
        constructor(nodes) {
            this.places = this.getNodes("place");
            this.transitions = this.getNodes("transition");
            this.From;
            this.To;
        }

        getNodes(type) {
            var filteredNodes = [];
            nodes.forEach(function (node) {
                if (node.nodeType == type)
                    filteredNodes.push(node);
            });

            return filteredNodes;
        }
    }

    class Node {
        constructor() { }

    }

    class Place extends Node {
        constructor(x, y, radius, text, tokens) {
            super();
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.text = text;
            this.drawObject = createNode(x, y, radius, text, tokens);
            this.drawObject.classPointer = this;
            this.namePlate = this.drawObject.children[0];
            this.tokensPlate = this.drawObject.children[1];
            this.tokenAmount = tokens;
            this.originalTokens = this.tokenAmount;
        }

        get tokens() { return this.tokenAmount };
        set tokens(amount) {
            this.tokenAmount = amount;
            this.tokensPlate.text = amount;
        }

        get incomingEdges() { return drawObject.incomingEdges; }
        get outgoingEdges() { return drawObject.incomingEdges; }

        get name() { return namePlate.text; }

        set name(newname) {
            if (namePlate) namePlate.text = newname;
            else this.text = newname;
        }
        dragAndDrop(option) { this.drawObject.dragAndDrop(option) }
    }

    class Transition extends Node {
        constructor(x, y, radius, text, tokens) {
            super();
            this.drawObject = createTransition(x, y, radius * 2, text, tokens)
            this.drawObject.classPointer = this;

            this.namePlate;
        }
        get incomingEdges() { return drawObject.incomingEdges; }
        get outgoingEdges() { return drawObject.incomingEdges; }
        get name() { return namePlate.text; }

        set name(newname) {
            if (namePlate) namePlate.text = newname;
            else this.text = newname;
        }

        dragAndDrop(option) { this.drawObject.dragAndDrop(option) }

        fire(transition) {

            //consume
            this.incomingEdges.forEach(function (edge) {
                var adj = edge.From;
                adj.tokens -= 1;
                adj.children[1].text = adj.tokens;

                var ball = canvas.display.ellipse({
                    x: edge.start.x, y: edge.start.y,
                    radius: 20,
                    fill: "red",
                }).add();

                ball.animate({
                    x: edge.end.x,
                    y: edge.end.y,
                    opacity: 0
                },
                    {
                        duration: "normal",
                        easing: "ease-out-quint",
                    });
            });

            //produce
            this.outgoingEdges.forEach(function (element) {
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
    }

    //STATE DESIGN PATTERN
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
        executionClick() { }
    }

    class DefaultState extends Istate {
        constructor() { super(); }

        canvasClick(node, event) {
            //clicked on empty spot -> deselect
            deselect();
        }

        canvasDoubleClick() { }
        placeClick(node, event) {
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

        AddnodeClick(button) {
            nodes.push(new Place(canvas.width / 2, canvas.height / 2, 50, "P" + Math.round(Math.random() * 100), Math.round(Math.random() * 10))); //createNode(canvas.width / 2, canvas.height / 2, 50, "P" + Math.round(Math.random() * 100), Math.round(Math.random() * 10)));
        }
        AddEdgeClick() { console.log("select node first!") }

        keydownEvent(event) {
            if (event.which == 84) //= key T
                nodes.push(new Transition(canvas.mouse.x - 50, canvas.mouse.y - 50, 50, "T" + Math.round(Math.random() * 100), Math.round(Math.random() * 10)));//createTransition(canvas.mouse.x - 50, canvas.mouse.y - 50, 100, "T" + Math.round(Math.random() * 100)));
            if (event.which == 65)  //key A
                nodes.push(new Place(canvas.mouse.x, canvas.mouse.y, 50, "P" + Math.round(Math.random() * 100), Math.round(Math.random() * 10)));  //createNode(canvas.mouse.x, canvas.mouse.y, 50, "P" + Math.round(Math.random() * 100), Math.round(Math.random() * 10)));
        }

        executionClick(button, event) {
            switchToExecState(button);
        }
    }

    function switchToExecState(button) {
        state.currentState = state.executionState;
        button.children[0].text = "Execution Mode";
        button.children[0].fill = "red";

        //disable drag & drop
        nodes.forEach(function (element) {
            element.dragAndDrop(false);
        })

        //check each transition for fire eligibility (green = allowed to Fire())
        nodes.forEach(function (node) {
            if (node.nodeType == "transition")
                satedCheck(node);
            else node.originalTokens = node.tokens;  //remember token amount b4 execution
        });
    }

    function satedCheck(node) {
        var sated = true;
        node.incomingEdges.forEach(function (element) { if (element.From.tokens < 1) sated = false; });
        if (sated) node.stroke = "5px green";
        else node.stroke = "5px red";
        return sated;
    }

    class SelectionState extends Istate {
        constructor() { super(); }
        canvasDoubleClick() { }
        canvasClick() {
            deselect();
            state.currentState = state.defaultState;
        }

        placeClick(node, event) {
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
                end: { x: canvas.mouse.x, y: canvas.mouse.y },
                stroke: "11px #0aa",
                cap: "round"
            }).add();

            edgePending = line;

            //switch state
            state.currentState = state.edgePendingState;
        }

        keydownEvent(event) {
            if (event.which == 69) //simulate clicking on adding edge button by pressing E
                state.currentState.AddEdgeClick();
        }

        executionClick(button, event) {
            deselect();
            switchToExecState(button);
        }
    }

    class ExecutionState extends Istate {
        constructor() { super(); }
        canvasClick() { } //nothing
        placeClick() { }

        transitionClick(node, event) {
            if (satedCheck(node))
                node.classPointer.fire();

            nodes.forEach(function (elem) {
                if (elem.nodeType == "transition") satedCheck(elem); //set color
            })
        }

        AddnodeClick(node, event) { }
        AddEdgeClick() { /* do nothing */ }
        keydownEvent() { }
        executionClick(button, event) {
            //go back to default mode;
            button.children[0].text = "Execution";
            button.children[0].fill = "#fff";
            state.currentState = state.defaultState;
            event.stopPropagation();

            nodes.forEach(function (node) {
                AddDragAndDrop(node);
                node.stroke = "5px red"; //reset colors
                console.log(node);
                if (node.nodeType == "place") {
                    console.log('resetting place tokens')
                    console.log('originn: ' + node.originalTokens);
                    console.log('during exec: ' + node.tokens);

                    node.tokens = node.originalTokens;
                    node.children[1].text = node.tokens; //reset token text

                    console.log('after: ' + node.tokens);
                }
                node.redraw();
            });
        }
    }

    function edgePlacementValidation(node) {
        if (selected.current === node) {
            console.log('cant point to self!')
            return false;
        }

        if (selected.current.nodeType == node.nodeType) {
            console.log("same type!")
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
        canvasClick() { console.log("click on an object") }

        placeClick(node, event) {

            if (!edgePlacementValidation(node)) return;

            var newEdge = createEdge(selected.current, node);
            // selected.current = null;
            edgePending.remove();
            edgePending = null;
            event.stopPropagation();
            //switch states
            state.currentState = state.selectionState;
        }

        transitionClick(node, event) {
            if (!edgePlacementValidation(node)) return;

            var newEdge = createEdge(selected.current, node);
            //selected.current = null;
            edgePending.remove();
            edgePending = null;
            event.stopPropagation();
            //switch states
            state.currentState = state.selectionState;
        }

        AddnodeClick() { }
        AddEdgeClick() { }
        keydownEvent(event) {
            edgePending.remove();
            edgePending = null;
            state.currentState = state.selectionState;
        }
    }

    class ReachabilityState extends Istate {
        constructor() { super(); }
        canvasClick() { }
        canvasDoubleClick() { }
        placeClick() { }
        transitionClick() { }
        AddnodeClick() { }
        AddEdgeClick() { }
        SelectedButtonUpdate() { }
        keydownEvent() { }
        executionClick() { }
    }

    class State {
        constructor() {
            this.defaultState = new DefaultState();
            this.selectionState = new SelectionState();
            this.executionState = new ExecutionState();
            this.edgePendingState = new EdgePendingState();
            this.reachabilityState = new ReachabilityState();
            this.currentState = this.defaultState;
        }
    }

    /**
     * END OF CLASSES
     */


    mycanvas = document.getElementById("canvas");
    context = mycanvas.getContext("2d");
    mycanvas.width = $(window).width();
    mycanvas.height = $(window).height();
    var $canvas = $("#canvas");
    var canvasOffset = $canvas.offset();
    var scrollX = $canvas.scrollLeft();
    var scrollY = $canvas.scrollTop();
    state = new State();
    canvas = oCanvas.create({
        canvas: '#canvas',
        background: '#2c3e50',
        fps: 60,
    });


    var dragging;
    var selectionBox = canvas.display.rectangle({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        fill: "#0aa",
        opacity: 0
    }).add();

    $canvas.contextmenu(function () {
        var state1 = new xState();
        console.log(state1);

        return false;
    });

    canvas.bind("click tap", function (event) { state.currentState.canvasClick(event); });

    canvas.bind("mouseup", function () {
        dragging = false;
        selectionBox.opacity = 0;
        selectionBox.x = 0;
        selectionBox.y = 0;
        selectionBox.width = 0;
        selectionBox.height = 0;
    });

    canvas.bind("mousemove", function () {
        if (edgePending) {
            edgePending.end = { x: canvas.mouse.x, y: canvas.mouse.y };
            edgePending.redraw();
        }

        if (dragging && !nodeIsMoving) {
            console.log(selectionBox.x);
            selectionBox.opacity = 0.5;
            selectionBox.width = canvas.mouse.x - selectionBox.x;
            selectionBox.height = canvas.mouse.y - selectionBox.y;
            //   selectionBox.redraw();
        }


    });
    canvas.bind("mousedown", function (event) {
        dragging = true;
        selectionBox.x = canvas.mouse.x;
        selectionBox.y = canvas.mouse.y;
        selectionBox.opacity = 0.5;

    })


    canvas.bind("keydown", function (event) { state.currentState.keydownEvent(event); })


    initMenu();

    //pseudo interface
    function deselect() {
        selected.current = null;
        selected.children[0].text = "None selected";
        selected.redraw();
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
        var addPlace = createButton(10, 10, 100, 50, "Add node (A)");

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
        var selectionCircle = canvas.display.ellipse({ x: 5, y: 50, radius: 55, stroke: "3px orange", }).add();

        var coords = createButton(10, 70, 100, 50, "x/y");
        canvas.setLoop(function () {
            coords.children[0].text = "X: " + canvas.mouse.x + " / Y: " + canvas.mouse.y;;

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

            var vec = Victor(currentEdge.end.x - currentEdge.x, currentEdge.end.y - currentEdge.y);
            var vec3 = new Victor(currentEdge.To.strokeWidth + triangle.radius / 2, currentEdge.To.strokeWidth + triangle.radius / 2);
            var subVec = vec.clone().normalize().multiply(vec3);
            vec.subtract(subVec);

            triangle.rotation = vector.angleDeg();
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
            // console.log('fusing children');
            // nodes[0].addChild(nodes[1]);
            // canvas.redraw();
            // console.log(nodes[0].children);
        });

        AddDragAndDrop(transition);

        transition.addChild(nodeText);
        transition.incomingEdges = []
        transition.outgoingEdges = []
        transition.nodeType = "transition";
        transition.classPointer = null;
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

        AddDragAndDrop(node);
        node.addChild(nodeText);
        node.addChild(tokenText);
        node.incomingEdges = []
        node.outgoingEdges = []
        node.add();
        node.tokens = tokens;
        node.originalTokens = tokens;
        node.nodeType = "place";
        node.classPointer = null;
        console.log(node.children);
        return node;
    }

    function updateTokens(node) {
        node.children[1].text = node.tokens;
        node.redraw();
    }

    function AddDragAndDrop(node) {
        node.dragAndDrop({
            start: function () {
                nodeIsMoving = true;
            },
            move: function () { lineOnEdge(node); },
            end: function () {
                nodeIsMoving = false;
            }
        });
    }
});

