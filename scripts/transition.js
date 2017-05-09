class Transition extends Node {
    constructor(x, y, radius, text, tokens) {
        super();
        this.drawObject = this.createTransition(x, y, radius * 2, text, tokens)
        this.drawObject.classPointer = this;
        this.namePlate = this.drawObject.children[1];;
    }

    //check if all incoming edges have > 0 tokens
    readyCheck(colorIndicator = true) {
        var isSated = true;
        this.incomingEdges.forEach(function (element) { if (element.From.classPointer.tokens < 1) isSated = false; });

        if (!colorIndicator) return isSated

        if (isSated) this.drawObject.stroke = "5px green";
        else this.drawObject.stroke = "5px red";
        return isSated;
    }
    speak() { console.log('hi from transition') }
    //consume a token from incoming edges, then distribute
    fire() {
        //consume
        this.incomingEdges.forEach(function (edge) {
            var adj = edge.From.classPointer;
            adj.tokens -= 1;
            //adj.children[1].text = adj.tokens;

            var ball = $canvas.display.ellipse({
                x: edge.start.x, y: edge.start.y,
                radius: 20,
                fill: "red",
            }).add();

            ball.animate({ x: edge.end.x, y: edge.end.y, opacity: 0 },
                { duration: "normal", easing: "ease-out-quint", });
        });

        //produce
        this.outgoingEdges.forEach(function (element) {
            var adj = element.To.classPointer;
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

    createTransition(x, y, radius, text) {
        var transition = $canvas.display.rectangle({
            x: x, y: y,
            width: radius,
            height: radius,
            stroke: "5px red",
            name: text
        });

        var nodeText = $canvas.display.text({
            x: radius / 2,
            y: radius,
            origin: { x: "center", y: "top" },
            font: "bold 30px sans-serif",
            text: text,
            fill: "#0ba"
        });

        transition.bind("click tap", function (event) { state.currentState.transitionClick(this, event); });

        transition.bind("dblclick ", function (event) { });

        AddDragAndDrop(transition);

        transition.addChild(nodeText);
        transition.incomingEdges = []
        transition.outgoingEdges = []
        transition.nodeType = "transition";
        transition.classPointer = null;
        transition.add();

        return transition;
    }
}