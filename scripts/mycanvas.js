
jQuery(document).ready(function ($) {
    //global vars
    $nodes = []
    $transitions = []   //not used yet
    $edges = []         //not used yet

    var selected;
    var edgePending = null;
    var nodeIsMoving = false;
    var petrinetStates = []
    var currentState


    //STATE DESIGN PATTERN
    //TODO: DECOMPOSE INTO RESPECITVE CLASSES! 
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
            $nodes.push(new Place($canvas.width / 2, $canvas.height / 2, 50, "P" + Math.round(Math.random() * 100), Math.round(Math.random() * 10)));
        }
        AddEdgeClick() { console.log("select node first!") }

        keydownEvent(event) {
            if (event.which == 84) //= key T
                $nodes.push(new Transition($canvas.mouse.x - 50, $canvas.mouse.y - 50, 50, "T" + Math.round(Math.random() * 100), Math.round(Math.random() * 10)));//createTransition($canvas.mouse.x - 50, $canvas.mouse.y - 50, 100, "T" + Math.round(Math.random() * 100)));
            if (event.which == 65)  //key A
                $nodes.push(new Place($canvas.mouse.x, $canvas.mouse.y, 50, "P" + Math.round(Math.random() * 100), Math.round(Math.random() * 10)));
        }

        executionClick(button, event) {
            switchToExecState(button);
        }
    }

    function switchToExecState(button) {
        //switch state and button
        state.currentState = state.executionState;
        button.children[0].text = "Execution Mode";
        button.children[0].fill = "red";

        //create new currentStaet in the context of coverability graph. The new state has null as parent

        currentState = new PetriNetState();
        petrinetStates.push(currentState);
        console.log(currentState)
        console.log(currentState.id)

        //disable drag & drop
        $nodes.forEach(function (element) { element.dragAndDrop(false); })

        //check each transition for fire eligibility (green = allowed to Fire())
        $nodes.forEach(function (node) {
            if (node instanceof Transition)
                node.readyCheck();
            else node.originalTokens = node.tokens;  //remember token amount b4 execution
        });
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
            var line = $canvas.display.line({
                start: { x: selected.current.x, y: selected.current.y },
                end: { x: $canvas.mouse.x, y: $canvas.mouse.y },
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
            if (node.classPointer.readyCheck()) {

                //fire the transition and swallow the nodes
                node.classPointer.fire();

                // add the new state then replace the currentstate with the new one
                var newState = new PetriNetState(currentState);
                var idx;
                if ((idx = $.inArray(newState.id, petrinetStates.map(i => i.id))) != -1) { }

                currentState.nextStates.push(newState);
                currentState = newState

                //add the new state in the distinct list of states
                petrinetStates.push(currentState);

                console.log(currentState)
                console.log(currentState.id)
            }
            $nodes.forEach(function (elem) { if (elem instanceof Transition) elem.readyCheck(); /*set color */ })
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

            $nodes.forEach(function (node) {
                AddDragAndDrop(node);
                node.drawObject.stroke = "5px red"; //reset colors

                if (node instanceof Place) {
                    node.tokens = node.originalTokens;
                    // node.tokensPlate.text = node.tokens; //reset token text
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

        if (selected.current.nodeType == node.nodeType) {   //TODO: CHANGE TO INSTANCEOF
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

    var dragging;
    var selectionBox = $canvas.display.rectangle({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        fill: "#0aa",
        opacity: 0
    }).add();

    $canvasDOM.contextmenu(function () {
        console.log(currentState)

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
            console.log(selectionBox.x);
            selectionBox.opacity = 0.5;
            selectionBox.width = $canvas.mouse.x - selectionBox.x;
            selectionBox.height = $canvas.mouse.y - selectionBox.y;
            //   selectionBox.redraw();
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
        line.From = nodeA;
        line.To = nodeB;
        line.redraw();

        var triangle = $canvas.display.polygon({
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
        $canvas.addChild(line);
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

