
jQuery(document).ready(function ($) {

    class dog {
        constructor(a, b, c) {
            this.a = a;
            this.b = b;
            this.c = c;
        }
    }

    var dawg = new dog(1,2,3);
    console.log(dawg);
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

    $canvas.contextmenu(function () {
        return false;
    });

    canvas.bind("click tap", function (event) {
        if (!edgePending) {
            selected.current = null;
            selected.children[0].text = "None selected";
            selected.redraw();
        }
        console.log(event)
    });

    canvas.bind("mousemove", function () {
        if (edgePending) {
            edgePending.end = { x: canvas.mouse.x, y: canvas.mouse.y };
            edgePending.redraw();
        }
    });

    canvas.bind("keydown", function (event) {
        if (edgePending) {
            edgePending.remove();
            edgePending = null;
        }
    })

    var nodes = []
    var transitions = []
    var edges = []
    var selected;
    var edgePending = null;

    initMenu();
    var node = createNode(400, 400, 50, "P1", 1)
    var node2 = createNode(600, 200, 50, "P2", 0)
    //  var edge = createEdge(node, node2);
    var t1 = createTransition(700, 400, 75, "T1")
    nodes.push(node, node2);
    edges.push(edge);

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

        line.bind("click", function (event) {
            console.log('clicked line');
            console.log(this);
        });

        var triangle = canvas.display.polygon({
            x: 0,
            y: 0,
            sides: 3,
            radius: 20,
            rotation: 0,
            fill: "#0da"
        });

        line.addChild(triangle);

        lineOnEdge(node);
        lineOnEdge(nodeB);
        canvas.addChild(line);
        line.zIndex = 0;
    }

    function initMenu() {
        var addNode = createButton(10, 10, 100, 50, "Add node");
        addNode.bind("click tap", function () { nodes.push(createNode(canvas.width / 2, canvas.height / 2, 50, "new node", 0)) });

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
            if (selected.current) {
                var line = canvas.display.line({
                    start: { x: selected.current.x, y: selected.current.y },
                    stroke: "11px #0aa",
                    cap: "round"
                }).add();

                edgePending = line;
            }
        })

        selected = createButton(230, 10, 100, 50, "None selected");
        selected.current = null
        var selectionCircle = canvas.display.ellipse({ x: 5, y: 50, radius: 55, stroke: "3px orange", }).add();

        var coords = createButton(10, 70, 100, 50, "x/y");
        canvas.setLoop(function () {
            coords.children[0].text = "X: " + canvas.mouse.x + " \\ " + "Y: " + canvas.mouse.y;;

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
            var triangle = currentEdge.children[0];

            var vx = currentEdge.From.x - currentEdge.To.x;
            var vy = currentEdge.From.y - currentEdge.To.y;
            var vector = new Victor(vx, vy);
            var subVector = vector.clone().normalize().multiply(new Victor(node.radius, node.radius));

            currentEdge.start.x = currentEdge.From.x - subVector.x;
            currentEdge.start.y = currentEdge.From.y - subVector.y;

            var sub2 = vector.clone().normalize().multiply(new Victor(triangle.radius, triangle.radius));
            currentEdge.end.x = currentEdge.To.x + subVector.x + sub2.x;
            currentEdge.end.y = currentEdge.To.y + subVector.y + sub2.y;

            var v2 = new Victor(vy, vx);
            triangle.rotation = 270 - v2.angleDeg();

            var vec = Victor(currentEdge.end.x - currentEdge.x, currentEdge.end.y - currentEdge.y);
            var vec3 = new Victor(currentEdge.To.strokeWidth / 2, currentEdge.To.strokeWidth / 2)
            var subVec = vec.clone().normalize().multiply(vec3);
            vec.subtract(subVec);

            triangle.x = vec.x;
            triangle.y = vec.y;

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

        transition.bind("click tap", function (event) {
            if (edgePending) {
                if (selected.current === transition) {
                    console.log('cant point to self!')
                    return;
                }

                var mapped = transition.incomingEdges.map(function (item) { return item.From; });

                if ($.inArray(selected.current, mapped) != -1) {
                    console.log("edge already exists");
                    return;

                }
                var newEdge = createEdge(selected.current, transition);
                selected.current = null;
                edgePending.remove();
                edgePending = null;


            }

            else {
                selected.children[0].text = "Selected: " + this.name;
                selected.current = this;
                selected.redraw();
                event.stopPropagation();
            }

            console.log(selected.current)
        });

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

        node.bind("click tap", function (event) {
            if (edgePending) {

                if (selected.current.nodeType == node.nodeType) return;

                if (selected.current === node) {
                    console.log('cant point to self!')
                    return;
                }

                var mapped = node.incomingEdges.map(function (item) { return item.From; });

                if ($.inArray(selected.current, mapped) != -1) {
                    console.log("edge already exists");
                    return;

                }

                var newEdge = createEdge(selected.current, node);
                selected.current = null;
                edgePending.remove();
                edgePending = null;
            }

            else {
                selected.children[0].text = "Selected: " + this.name;
                selected.current = this;
                selected.redraw();
                event.stopPropagation();
            }
        });

        node.bind("dblclick ", function (event) { fire(this); });

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

