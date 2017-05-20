class PetriNetState extends Node {
    constructor(x, y, width, height) {
        super();
        //from which state/node did it come from?

        // this.from = fromState;
        this.nextStates = [];
        this.activeTransitions = [];
        this.activePlaces = [];
        this.id = this.CreateId();
        this.drawObject = this.createStateNode(x, y, width, height);
        this.drawObject.classPointer = this;

        this.defaultState = new PS_DefaultState(this);
        this.selectionState = new PS_EdgePendingState(this);
        this.executionState = new PS_ExecutionState(this);
        this.currentState = new PS_SelectionState(this);
        this.currentState = this.defaultState;

        this.width = width;
        this.height = height;

        this.selectionCircle = this.createSelectionCircle()

        console.log($nodes)

        this.initEventHandlers();
        this.popupMenu = this.CreatePopupAnchor();
        // this.CreatePopupMenu();

    }
    CreatePopupAnchor() {
        var anchor = $canvas.display.rectangle({
            x: this.width + this.drawObject.strokeWidth,
            y: 0,
            width: 0,
            height: 0,
            opacity: 1,

        });

        this.drawObject.addChild(anchor);
        return anchor;
    }
    CreatePopupMenu() {
        for (var index = 0; index < $places.length; index++) {
            var element = $places[index];
            var name = element.name;

            var popup = $canvas.display.rectangle({
                x: 0,
                y: 50 * index,
                width: 50,
                height: 50,
                stroke: "3px red",
                opacity: 1
            });

            var nodeText = $canvas.display.text({
                x: popup.width / 2,
                y: popup.height / 2,
                origin: { x: "center", y: "center" },
                font: "15px sans-serif",
                text: name,
                fill: "#0ba"
            });

            popup.bind("click tap", function (event, classPointer) {
                console.log('adding ' + this.children[0].text + ' to this state');
                event.stopPropagation();
            });

            popup.addChild(nodeText);
            this.popupMenu.addChild(popup);
        }

    }

    createSelectionCircle() {
        var ratio = this.height / this.width;
        var margin = 0.1;

        var sc = $canvas.display.rectangle({
            x: (- (margin * ratio) / 2) * this.width,
            y: -margin / 2 * this.height,
            width: this.width * (1 + margin * ratio),
            height: this.height * (1 + margin),
            stroke: "3px red",
            opacity: 0
        });

        this.drawObject.addChild(sc);
        return sc;

    }

    get selected() { return this.selectionCircle.opacity > 0 }
    set selected(bool) {
        if (bool) {
            this.selectionCircle.opacity = 1;
            this.CreatePopupMenu();
        }
        else {
            this.selectionCircle.opacity = 0;
            this.popupMenu.remove();
            this.popupMenu = this.CreatePopupAnchor();
        }
    }

    get center() { return { x: this.x + this.width / 2, y: this.y + this.height / 2 } }
    get name() { return "petrinet state" + $PNstates.length; }
    //old code
    readyTransitions() {
        for (var i = 0; i < $transitions.length; i++) {
            var trans = $transitions[i];
            if (trans.readyCheck(false)) this.activeTransitions.push(trans)
        }
    }

    CreateId() {
        var id = [];
        for (var i = 0; i < $places.length; i++) {
            var place = $places[i];
            if (place.tokens > 0) {
                id.push(place.tokens + "*" + place.name);
                this.activePlaces.push(place);
            }
        }

        return id;
    }

    createStateNode(x, y, width, height) {
        var obj = $canvas.display.rectangle({
            x: x, y: y,
            width: width,
            height: height,
            stroke: "5px #f46e42",
            name: this.id
        }).add();
        obj.dragAndDrop();

        return obj;

    }


    // old code
    createStateNodeOLD() {
        var widthPixels = 100;
        var spacingPixels = 50;
        var width = this.activePlaces.length * widthPixels;
        var height = 100;

        var pos = { x: $canvas.width / 2, y: $canvas.height / 2 }

        var transition = $canvas.display.rectangle({
            x: pos.x, y: pos.y,
            width: width,
            height: height,
            stroke: "5px orange",
            name: this.id
        }).add();

        for (var i = 0; i < $places.length; i++) {
            var place = $places[i];

            //increase width by 100 pixels
            if (place.tokens > 0) {
                var text = place.tokens + "*" + place.name;
                var currentWidth = width / this.activePlaces.length * i + spacingPixels;
                var text = $canvas.display.text({
                    x: currentWidth,
                    y: height / 2,
                    origin: { x: 'center', y: 'center' },
                    font: 'bold 30px sans-serif', text: text, fill: '#0ba'
                });

                transition.addChild(text);
            }
        }

        if (width == 0) transition.width = 100;
        transition.dragAndDrop();

        return transition;
    }

    //old code
    createTransitionObject() {
        var pos = { x: $canvas.width / 2, y: $canvas.height / 2 }
        var pixelWidth = 100;
        var pixelHeight = 100;

        var rect = $canvas.display.rectangle({
            x: pos.x, y: pos.y,
            width: pixelWidth,
            height: pixelHeight,
            stroke: "5px red",
            name: this.id
        }).add();

        var text = $canvas.display.text({
            x: pixelWidth / 2, y: pixelWidth / 2, origin: { x: 'center', y: 'center' },
            font: 'bold 30px sans-serif', text: "Add places", fill: '#0ba'
        });

        rect.addChild(text);
        return rect;

    }

}


    // class PetriNetState {
    //     constructor(nodes) {
    //         this.places = this.getNodes("place");
    //         this.transitions = this.getNodes("transition");
    //         this.From;
    //         this.To;
    //     }

    //     getNodes(type) {
    //         var filteredNodes = [];
    //         nodes.forEach(function (node) {
    //             if (node.nodeType == type)
    //                 filteredNodes.push(node);
    //         });

    //         return filteredNodes;
    //     }
    // }