class PetriNetState extends Node {
    constructor(x, y, width, height) {
        super();
        //from which state/node did it come from?

        // this.from = fromState;
        this.nextStates = [];
        this.activeTransitions = [];
        this.activePlaces = {};
        this.id = this.CreateId();
        this.drawObject = this.createStateNode(x, y, width, height);
        this.drawObject.classPointer = this;
        //this.AddDragAndDrop();

        this.defaultState = new PS_DefaultState(this);
        this.selectionState = new PS_SelectionState(this);
        this.executionState = new PS_ExecutionState(this);
        this.edgePendingState = new PS_EdgePendingState(this);
        this.currentState = this.defaultState;

        this.selectionCircle = this.createSelectionCircle()

        console.log($nodes)

        this.initEventHandlers();
        this.popupMenu = this.CreatePopupAnchor();
        this.placeAnchor = this.CreatePlaceAnchor();
        this.AddDragAndDrop();
    }

    CreatePlaceAnchor() {
        var anchor = $canvas.display.rectangle({
            x: 0, y: 0,
            width: 0, height: 0,
            opacity: 1,
        });

        anchor.name = "place anchor";
        this.drawObject.addChild(anchor);
        return anchor;
    }

    CreatePopupAnchor() {
        var anchor = $canvas.display.rectangle({
            x: this.width + this.drawObject.strokeWidth,
            y: 0,
            width: 0,
            height: 0,
            opacity: 1,

        });
        //use name to access easier
        anchor.name = "popup anchor";
        this.drawObject.addChild(anchor);
        return anchor;
    }

    CreatePopupMenu() {
        this.popupMenu.remove();
        this.popupMenu = null;
        this.popupMenu = this.CreatePopupAnchor();

        var nonActivePlaces = []
        for (var i = 0; i < $places.length; i++) {
            var element = $places[i];
            var name = element.name;

            if (!(name in this.activePlaces)) nonActivePlaces.push(element);
        }

        for (var index = 0; index < nonActivePlaces.length; index++) {
            var element = nonActivePlaces[index];
            var name = element.name;

            if (name in this.activePlaces) { index--; continue; }

            var anchorX = this.width;
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

            popup.classPointer = this;
            popup.bind("click tap", function (event) {
                this.classPointer.addPlaceToState(event, this);
                event.stopPropagation();

            });

            popup.addChild(nodeText);
            this.popupMenu.addChild(popup);
        }
    }

    addPlaceToState(event, button) {

        var placename = button.children[0].text;

        //if it already is an active place to the state, then dont add.
        if (!(placename in this.activePlaces)) {
            this.activePlaces[placename] = 1;
            this.redraw();
        }
        this.CreatePopupMenu();
    }

    redraw() {
        var parent = this;
        this.placeAnchor.remove();
        this.placeAnchor = null;
        this.placeAnchor = this.CreatePlaceAnchor();

        var i = 0;
        $.each(this.activePlaces, function (key, value) {
            var obj = parent.createPlaceBoard(i, key, value);
            parent.placeAnchor.addChild(obj);
            i++;
        });

        var width = 50 * i + this.drawObject.strokeWidth * 2;
        if (width < 200) this.width = 200;
        else this.width = width;

        this.CreatePopupMenu();
    }

    createPlaceBoard(i, key, value) {
        var h = this.height / 2 - this.height / 4;
        var parent = this;
        var obj = $canvas.display.rectangle({
            x: 50 * i + this.drawObject.strokeWidth,
            y: h,
            width: 50,
            height: 50,
            stroke: "2px blue",
            opacity: 1
        });
        var text = value + '*' + key;
        var objText = $canvas.display.text({
            x: obj.width / 2,
            y: obj.height / 2,
            origin: { x: "center", y: "center" },
            font: "15px sans-serif",
            text: text,
            fill: "#0ba"
        });

        obj.addChild(objText);
        obj.zIndex = "front";
        obj.name = text;
        obj.bind("click tap", function (event) {
            if (!this.parent.parent.classPointer.selected)
                return;
            var val = 0;
            event.stopPropagation();

            if (event.which === 1)
                val = 1;
            else if (event.which === 2)
                val = -1;

            else if (val === 0)
                return;

            var split = this.name.split("*");
            var value = split[0];
            var key = split[1];

            value = parseInt(value) + val;
            var newval = value + "*" + key;
            this.name = newval;
            this.children[0].text = newval;
            this.children[0].redraw();
            parent.activePlaces[key] = value;

            if (value <= 0) {
                delete parent.activePlaces[key];
                parent.redraw();
            }
        }); return obj;

    }

    createSelectionCircle() {
        this.margin = 0.1;

        var sc = $canvas.display.rectangle({
            x: (- (this.margin * this.ratio) / 2) * this.width,
            y: -this.margin / 2 * this.height,
            width: this.width * (1 + this.margin * this.ratio),
            height: this.height * (1 + this.margin),
            stroke: "3px red",
            opacity: 0
        });

        this.drawObject.addChild(sc);
        return sc;

    }

    set width(val) {
        this.drawObject.width = val;
        this.popupMenu.width = val;
        this.selectionCircle.width = this.drawObject.width * (1 + this.margin * this.ratio);


        for (var i = 0; i < this.popupMenu.children.length; i++) {
            this.popupMenu.children[i].x = 0;
            this.popupMenu.children[i].redraw();
        }

        this.popupMenu.redraw();
        this.drawObject.redraw();
        this.selectionCircle.redraw();
    }

    get signature() {
        var keys = [];
        $.each(this.activePlaces, function (key, value) { keys.push(key); });

        keys.sort();

        var result = "";
        keys.forEach(function (key) {
            var value = this.activePlaces[key];
            result += value + "*" + key + " ";
        }, this);
        result = result.slice(0, -1);

        return result;
    }

    get width() { return this.drawObject.width; }
    get ratio() { return this.drawObject.height / this.drawObject.width; }

    get selected() { return this.selectionCircle.opacity > 0 }
    set selected(bool) {
        if (bool) {
            this.selectionCircle.opacity = 1;
            this.selectionCircle.redraw();
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
                //this.activePlaces[place.name] = place.tokens;

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