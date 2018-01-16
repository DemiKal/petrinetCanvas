class Transition extends Node {
    constructor(x, y, width, height) {
        super();
        var name = this.calcName();
        this.drawObject = this.createTransition(x, y, width, height, name); //make width/heigth independent
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

        this.selectionCircle = this.createSelectionCircle();
        this.initEventHandlers();
    }


    get sameNodes() { return $.extend([], $transitions); }
    get nameAbbreviation() { return "T"; }

    get center() { return { x: this.x + this.width / 2, y: this.y + this.height / 2 }; }

    removePointers() {
        super.removePointers();
        $transitions = $transitions.filter(x => x !== this);
    }

    ResetColors() {
        this.drawObject.stroke = $colorSettings.transition.stroke;
        this.redraw();
    }

    createSelectionCircle() {
        var selectionCircle = $canvas.display.rectangle({
            x: -0.05 * this.width,
            y: -0.05 * this.height,
            width: this.width * 1.1,
            height: this.height * 1.1,
            stroke: $colorSettings.transition.selectionCircle,
            opacity: 0
        });

        this.drawObject.addChild(selectionCircle);
        return selectionCircle;
    }

    //check if all incoming edges have > 0 tokens
    readyCheck(colorIndicator = true) {
        var isSated = true;
        this.incomingEdges.forEach(function (element) { if (element.From.tokens < 1) isSated = false; });

        if (!colorIndicator) return isSated;

        if (isSated) this.drawObject.stroke = $colorSettings.transition.readyFireStroke;
        else this.drawObject.stroke = $colorSettings.transition.stroke;
        this.redraw();
        return isSated;
    }
    Readd() {
        super.Readd();
        $transitions.push(this);
    }

    //consume a token from incoming edges, then distribute
    fire() {
        //consume
        var duration = 450;
        this.incomingEdges.forEach(function (edge) {
            var adj = edge.From;
            adj.tokens -= 1;
            //adj.color = "red";
            adj.tokensPlate.fill = "red";

            var ball = $canvas.display.ellipse({
                x: edge.start.x, y: edge.start.y,
                radius: 18, fill: "red",
                //stroke: "3px red"
            }).add();

            ball.animate({
                x: edge.end.x,
                y: edge.end.y,
                opacity: 1
            }, {
                    duration: duration,
                    easing: "linear",
                    callback: function () {
                        ball.remove();
                    }
                });
        });

        //produce
        this.outgoingEdges.forEach(function (element) {
            var adj = element.To;


            var ball = $canvas.display.ellipse({
                opacity: 0,
                x: element.start.x,
                y: element.start.y,
                radius: 18,
                fill: "red"
                //stroke: "3px red"
            }).add();

            ball.animate({ x: ball.x }, {
                duration: duration, easing: "linear", callback: function () { ball.opacity = 1; }
            });

            ball.animate({
                x: element.end.x,
                y: element.end.y,
            },
                {
                    duration: duration,
                    easing: "linear",
                    callback: function () {
                        ball.remove();
                        //update token
                        adj.tokens++;
                        adj.tokensPlate.fill = "#5fd80f";
                        var a = adj.drawObject;
                        var c = $canvas.display.ellipse({ x: a.x, y: a.y, radius: a.radius, stroke: a.stroke }).add();
                        c.animate({ radius: c.radius * 1.4, opacity: 0 }, {
                            duration: "short",
                            easing: "ease-out-quad",
                            callback: function () { c.remove(); }
                        });
                    }
                });
        });
    }

    createTransition(x, y, width, height, text) {
        var transition = $canvas.display.rectangle({
            x: x, y: y,
            width: width,
            height: height,
            stroke: $colorSettings.transition.stroke,
            name: text
        });

        var nodeText = $canvas.display.text({
            x: width / 2,
            y: height / 2,
            origin: { x: "center", y: "center" },
            font: "bold 30px sans-serif",
            text: text,
            fill: $colorSettings.place.nameColor
        });

        transition.addChild(nodeText);
        transition.classPointer = null;
        transition.add();

        return transition;
    }
}