class PetriNetState extends Node {
    constructor(x, y, width, height) {
        super();
        //from which state/node did it come from?

        // this.from = fromState;
        this.activeTransitions = [];
        this.activePlaces = {};
        this.drawObject = this.createStateNode(x, y, width, height);
        this.drawObject.classPointer = this;

        this.defaultState = new PS_DefaultState(this);
        this.selectionState = new PS_SelectionState(this);
        this.executionState = new PS_ExecutionState(this);
        this.edgePendingState = new PS_EdgePendingState(this);
        this.currentState = this.defaultState;

        this.selectionCircle = this.createSelectionCircle();

        this.initEventHandlers();
        this.popupMenu = this.CreatePopupAnchor();
        this.placeAnchor = this.CreatePlaceAnchor();
        this.AddDragAndDrop();
        this._name = this.calcName();
    }

    get sameNodes() {
        var states = $.extend([], $PNstates);
        return states;
    }
    get nameAbbreviation() { return "PS"; }

    //get the highest nr in the list. like state1, state2, state3, then make name yours state4
    ResetColors() {
        var drawObj = this.drawObject;
        drawObj.stroke = $colorSettings.petrinetState.stroke;

        this.edges.forEach(function (element) {
            //use the edges'own reset method when it has its own drawobj class
            element.stroke = $colorSettings.edge.stroke;
            element.children[0].fill = $colorSettings.edge.arrow;
            element.redraw();
        }, this);

        this.redraw();
    }

    get isCorrect() {
        return this.drawObject.stroke == $colorSettings.petrinetState.stroke;
    }

    set isCorrect(val) {
        val ? this.drawObject.stroke = $colorSettings.petrinetState.correctStroke : this.drawObject.stroke = $colorSettings.petrinetState.incorrectStroke;

        if (!val) {
            //TODO FIGURE OUT WHICH ACTIVE PLACES INSIDE THIS STATE ARE INCORRECT
            var txt = "this state is incorrect";
            CreateClickablePopup(this.position, txt, this);

            this.outgoingEdges.forEach(function (element) {
                var arrow = element.children[0];
                arrow.fill = $colorSettings.edge.incorrectArrow;
                element.stroke = $colorSettings.edge.incorrectStroke;
                txt = "this edge is wrong since the original state is wrong";
                CreateClickablePopup({ x: element.x, y: element.y }, txt, element);
            }, this);
        }

        this.redraw();
    }

    get nextStates() {
        var result = [];
        this.outgoingEdges.forEach(function (element) {
            var obj = element.To;
            var id = obj.id;
            result.push(id);
        }, this);
        return result;
    }

    //override line on edge
    lineOnEdge() {
        super.lineOnEdge();

        var recurringedges = [];
        //find recurring edge
        for (let i = 0; i < this.outgoingEdges.length; i++) {
            let edge = this.outgoingEdges[i];
            let neighbour = edge.To;
            for (let j = 0; j < neighbour.outgoingEdges.length; j++) {
                let pointingToMe = neighbour.outgoingEdges[j];
                if (pointingToMe.To === this) {
                    /*recurringedges.push(pointingToMe.From);*/


                    //vector from other towards me
                    let v = {
                        x: pointingToMe.To.center.x - pointingToMe.From.center.x,
                        y: pointingToMe.To.center.y - pointingToMe.From.center.y
                    }

                    let fromCenter = new Victor.fromObject(pointingToMe.From.center)
                    let toCenter = new Victor.fromObject(pointingToMe.To.center)

                    let vec = new Victor.fromObject(v);
                    let normalDir = new Victor(-v.y, v.x).normalize();
                    let delta = 0.33 * pointingToMe.From.height;
                    let scalar = new Victor(-delta, -delta);
                    let scalar2 = new Victor(delta, delta);

                    let p1 = normalDir.clone().multiply(scalar).add(toCenter);
                    let p2 = normalDir.clone().multiply(scalar2).add(toCenter);

                    let p3 = normalDir.clone().multiply(scalar).add(fromCenter);
                    let p4 = normalDir.clone().multiply(scalar2).add(fromCenter);

                    edge.start = p1.toObject();
                    edge.end = p3.toObject()
                    pointingToMe.start = p4.toObject();
                    pointingToMe.end = p2.toObject();

                    //intersect against the sides of the rect and set start/end points of edge
                    let mySides = this.sides;
                    let otherSides = neighbour.sides;

                    let i1;
                    let i2;
                    let i3;
                    let i4;
                
                    //intersect my outgoing edge with my edge and neighbours'
                    mySides.forEach(function (side) {
                        let intersection = segment_intersection(edge.start, edge.end, side.start, side.end);
                        if (intersection != false) edge.start = intersection;
                    }, this);
                   
                    //bug?
                    otherSides.forEach(function (side) {
                        let intersection = segment_intersection(edge.start, edge.end, side.start, side.end);
                        if (intersection != false) edge.end = intersection;
                    }, this);
                    
                    //intesrect the edge pointing towards me  against the sides of both rects
                    mySides.forEach(function (side) {
                        let intersection = segment_intersection(pointingToMe.start, pointingToMe.end, side.start, side.end);
                        if (intersection != false) pointingToMe.end  = intersection;
                    }, this);

                    otherSides.forEach(function (side) {
                        let intersection = segment_intersection(pointingToMe.start, pointingToMe.end, side.start, side.end);
                        if (intersection != false) pointingToMe.start = intersection;
                    }, this);

                    //causes crash, fixed above
                    // edge.start = i1;
                    // edge.end = i2;
                    // pointingToMe.start = i4;
                    // pointingToMe.end = i3;

                }

            }
        }
 


    }

    CreatePlaceAnchor() {
        var anchor = $canvas.display.rectangle({
            x: 0, y: 0, width: 0,
            height: 0, opacity: 1,
        });

        anchor.name = "place anchor";
        this.drawObject.addChild(anchor);
        return anchor;
    }

    CreatePopupAnchor() {
        var anchor = $canvas.display.rectangle({
            x: 0,
            y: this.height + this.drawObject.strokeWidth,
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

        //var nonActivePlaces = [];
        // for (var i = 0; i < $places.length; i++) {
        //     var element = $places[i];
        //     var name = element.name;

        //    // if (!(name in this.activePlaces)) nonActivePlaces.push(element);
        // }

        for (var index = 0; index < $places.length; index++) {
            var element = $places[index];
            var name = element.name;

            //if (name in this.activePlaces) { index--; continue; }

            var anchorX = this.width;
            var popup = $canvas.display.rectangle({
                x: 50 * index,
                y: 0,
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
        if ((placename in this.activePlaces)) {
            this.activePlaces[placename] += 1;
            this.redraw();
        }
        else {
            this.activePlaces[placename] = 1;
            this.redraw();
        }
        //this.CreatePopupMenu();
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
        if (!this.selected) return;
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

        var text = value + "*" + key;
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
            stroke: $colorSettings.petrinetState.selectionCircle,
            opacity: 0
        });

        this.drawObject.addChild(sc);
        return sc;

    }
    Readd() {
        super.Readd();
        $PNstates.push(this);

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

    get width() { return this.drawObject.width; }
    get ratio() { return this.drawObject.height / this.drawObject.width; }

    get selected() { return this.selectionCircle.opacity > 0; }
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

    get center() { return { x: this.x + this.width / 2, y: this.y + this.height / 2 }; }
    get name() {
        return this._name;
    }
    set name(val) { this._name = val; }

    get id() { return Signature(this); }

    removePointers() {
        super.removePointers();
        $PNstates = $PNstates.filter(x => x !== this);
    }

    //old code
    readyTransitions() {
        for (var i = 0; i < $transitions.length; i++) {
            var trans = $transitions[i];
            if (trans.readyCheck(false)) this.activeTransitions.push(trans);
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

    //this is the rectangle that is the main drawObject
    createStateNode(x, y, width, height) {
        var obj = $canvas.display.rectangle({
            x: x, y: y,
            width: width,
            height: height,
            stroke: $colorSettings.petrinetState.stroke

        }).add();

        return obj;
    }

    // old code
    createStateNodeOLD() {
        var widthPixels = 100;
        var spacingPixels = 50;
        var width = this.activePlaces.length * widthPixels;
        var height = 100;

        var pos = { x: $canvas.width / 2, y: $canvas.height / 2 };

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
                    origin: { x: "center", y: "center" },
                    font: "bold 30px sans-serif", text: text, fill: "#0ba"
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
        var pos = { x: $canvas.width / 2, y: $canvas.height / 2 };
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
            x: pixelWidth / 2, y: pixelWidth / 2, origin: { x: "center", y: "center" },
            font: "bold 30px sans-serif", text: "Add places", fill: "#0ba"
        });

        rect.addChild(text);
        return rect;

    }

}