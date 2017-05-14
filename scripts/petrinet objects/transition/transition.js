class Transition extends Node {
    constructor(x, y, width, height, text) {
        super();
        this.drawObject = this.createTransition(x, y, width, height, text) //make width/heigth independent
        this.drawObject.classPointer = this;
        this.namePlate = this.drawObject.children[0];
        this.width = width;
        this.height = height;
        this.AddDragAndDrop();

        this.defaultState = new TransitionDefaultState(this);
        this.edgePendingState = new TransitionEdgePendingState(this);
        this.selectionState = new TransitionSelectionState(this);
        this.executionState = new TransitionExecutionState(this);
        this.currentState = this.defaultState;

    }
    get center() { return { x: this.x + this.width / 2, y: this.y + this.height / 2 } }

    //check if all incoming edges have > 0 tokens
    readyCheck(colorIndicator = true) {
        var isSated = true;
        this.incomingEdges.forEach(function (element) { if (element.From.tokens < 1) isSated = false; });

        if (!colorIndicator) return isSated

        if (isSated) this.drawObject.stroke = "5px green";
        else this.drawObject.stroke = "5px red";
        return isSated;
    }

    //consume a token from incoming edges, then distribute
    fire() {
        //consume
        this.incomingEdges.forEach(function (edge) {
            var adj = edge.From;
            adj.tokens -= 1;
            //adj.children[1].text = adj.tokens;

            var ball = $canvas.display.ellipse({
                x: edge.start.x, y: edge.start.y,
                radius: 20, fill: "red",
            }).add();

            ball.animate({ x: edge.end.x, y: edge.end.y, opacity: 0 },
                { duration: "normal", easing: "ease-out-quint", });
        });

        //produce
        this.outgoingEdges.forEach(function (element) {
            var adj = element.To;
            adj.tokens++;
            // updateTokens(adj);

            var ball = $canvas.display.ellipse({
                x: element.start.x, y: element.start.y,
                radius: 20,
                fill: "red",
            }).add();

            ball.animate({
                x: element.end.x,
                y: element.end.y,
                opacity: 0
            },
                {
                    duration: "long",
                    easing: "ease-out-quint",
                });
        });
    }

    createTransition(x, y, width, height, text) {
        var transition = $canvas.display.rectangle({
            x: x, y: y,
            width: width,
            height: height,
            stroke: "5px red",
            name: text
        });

        var nodeText = $canvas.display.text({
            x: width / 2,
            y: height,
            origin: { x: "center", y: "top" },
            font: "bold 30px sans-serif",
            text: text,
            fill: "#0ba"
        });

        // place.bind('click tap', function (event) { place.classPointer.currentState.Click(place.classPointer, event); });
        // place.bind('dblclick', function (event) { /*   fire(this);   */ });
        // place.bind('mouseenter', function (event) { place.classPointer.currentState.MouseEnter(place.classPointer, event) });
        // place.bind('mouseleave', function (event) { place.classPointer.currentState.MouseLeave(place.classPointer, event) });

        transition.bind("click tap", function (event) { transition.classPointer.currentState.Click(this.classPointer, event); });
        transition.bind("dblclick", function (event) { transition.classPointer.currentState.DoubleClick(this.classPointer, event); });
        transition.bind("mouseenter", function (event) { transition.classPointer.currentState.MouseEnter(this.classPointer, event); });
        transition.bind("mouseleave", function (event) { transition.classPointer.currentState.MouseLeave(this.classPointer, event); });

        transition.addChild(nodeText);
        transition.classPointer = null;
        transition.add();

        return transition;
    }
}