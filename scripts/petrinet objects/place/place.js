class Place extends Node {
    constructor(x, y, radius, tokens) {
        super();
        var text = this.calcName();
        this.radius = radius;
        this.text = text;
        this.drawObject = this.createNode(x, y, radius, text, tokens);
        this.drawObject.classPointer = this;
        this.namePlate = this.drawObject.children[0];
        this.tokensPlate = this.drawObject.children[1];
        this.tokenAmount = tokens;
        this.originalTokens = this.tokenAmount;
        this.AddDragAndDrop();
        this.extraButtons();
        this.selectionCircle = this.createSelectionCircle();

        this.defaultState = new placeDefaultState(this);
        this.edgePendingState = new placeEdgePendingState(this);
        this.selectionState = new placeSelectionState(this);
        this.executionState = new placeExecutionState(this);
        this.currentState = this.defaultState;
        this.contextMenu = this.createContextMenu();

        this.initEventHandlers();
    }
    get sameNodes() { return $.extend([], $places); }
    get nameAbbreviation() { return "P"; }

    //override since the centerpoint is in the middle and not in the topleft like most objects
    get BoundingBox() {
        var rect = {
            left: this.x - this.width,
            top: this.y - this.height,
            right: this.x + this.width,
            bottom: this.y + this.height
        };

        return rect;
    }

    get width() { return this.radius; }
    set width(val) { this.drawObject.radius = val; }

    get height() { return this.radius; }
    set height(val) { this.drawObject.radius = val; }

    get center() { return { x: this.x, y: this.y }; }
    get tokens() { return this.tokenAmount; }
    set tokens(amount) {
        if (amount < 0) return;
        this.tokenAmount = amount;
        this.tokensPlate.text = amount;
        this.redraw();
    }

    incrementTokens() { this.tokens++; }
    decrementTokens() { this.tokens--; }

    ResetColors() {
        this.tokensPlate.fill = "#0ba";
    }
    removePointers() {
        super.removePointers();
        $places = $places.filter(x => x !== this);
    }

    Readd() {
        super.Readd();
        $places.push(this);
    }

    createSelectionCircle() {
        var selectionCircle = $canvas.display.ellipse(
            {
                x: 0, y: 0,
                radius: this.radius * 1.1,
                stroke: $colorSettings.place.selectionCircle,
                opacity: 0
            });
        this.drawObject.addChild(selectionCircle);
        return selectionCircle;
    }

    createNode(x, y, radius, text, tokens) {
        var place = $canvas.display.ellipse({
            x: x, y: y, radius: radius,
            stroke: $colorSettings.place.stroke,
            name: text,
            shadow: "3 6 6px #aaa",

        });
        var nodeText = $canvas.display.text({
            x: 0, y: radius, origin: { x: "center", y: "top" },
            font: "bold 30px sans-serif", text: text, fill: $colorSettings.place.nameColor

        });


        var tokenText = $canvas.display.text({
            x: 0, y: 0, origin: { x: "center", y: "center" },
            font: "bold 30px sans-serif", text: tokens, fill: $colorSettings.place.tokenColor
        });

        place.addChild(nodeText);
        place.addChild(tokenText);
        place.add();
        place.zIndex = "back";
        //remove!
        place.tokens = tokens;
        place.originalTokens = tokens;
        place.nodeType = "place";

        place.classPointer = this;

        return place;
    }
    edgePosition(endPos) {
        var from = Victor.fromObject(this.center);
        var to = Victor.fromObject(endPos);
        var dir = to.subtract(from).normalize();
        dir.multiply(new Victor(this.radius, this.radius));
        var newPos = from.clone().add(dir);

        return newPos;
    }

    extraButtons() {
        //set plus sign
        var stroke = "4px yellow";
        var length = 10;
        var line = $canvas.display.line({
            start: { x: this.drawObject.radius * 1.2, y: 0 },
            end: { x: this.drawObject.radius * 1.2 + length, y: 0 },
            stroke: stroke,
            cap: "round",
            opacity: 0
        });

        var line2 = $canvas.display.line({
            start: { x: 0, y: - length / 2 },
            end: { x: 0, y: length / 2 },
            stroke: stroke,
            cap: "round"
        });

        line.addChild(line2);
        this.drawObject.addChild(line); //child  index 2

        //TODO: MAKE OWN CLASS WITH STATE
        line.bind("click tap", function (event) { this.parent.classPointer.tokens++; });
    }
        createContextMenu() {
        var height = 25;
        var width = 100;
        var newMenu = new ContextMenu(0, 0, height, width, this);
        var actions = ["Remove", "Create edge", "+1 token", "-1 token", "Change tokens", "Rename", "Clone"];

        for (let i = 0; i < actions.length; i++) {
            const act = actions[i];
            const button = new Button(0, i * height, width, height, act);
            button.remove();
            newMenu.addSubObj(button);
            newMenu.height += height;

            button.bindManual("mouseenter", function () { this.fill = "orange"; });
            button.bindManual("mouseleave", function () { this.fill = "black"; });
            button.placeref = this;
        }

        //remove button
        newMenu.children[0].drawObject.bind("click", function (event) {
            var cmd = new DeleteNodeCommand(newMenu.objref);
            cmd.Execute();
            newMenu.remove();
            event.stopPropagation();
        });

        newMenu.children[1].drawObject.bind("click", function (event) {
            spawnPendingEdge();
            newMenu.remove();
            event.stopPropagation();
        });

        newMenu.children[2].drawObject.bind("click", function (event) {
            newMenu.objref.incrementTokens();
            event.stopPropagation();
        });

        newMenu.children[3].drawObject.bind("click", function (event) {
            newMenu.objref.decrementTokens();
            event.stopPropagation();
        });

        newMenu.children[4].drawObject.bind("click", function (event) {
            //craete popup!
            event.stopPropagation();
        });

        newMenu.children[5].drawObject.bind("click", function (event) {
            //rename token popup!
            event.stopPropagation();
        });

        newMenu.children[6].drawObject.bind("click", function (event) {
            // add new place
            event.stopPropagation();
        });

        return newMenu;
    }


}


