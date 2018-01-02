// abstract class representing nodes, the superclass of places, transitions, etc

class Node extends DrawingObject {
    constructor() {
        super();
        this.incomingEdges = [];
        this.outgoingEdges = [];
        this.selectionCircle = null;
    }
    get sameNodes() {

    }
    //only works with rect
    get sides() {
        // let sides = [];
        // let top = {
        //     start: { x: this.x, y: this.y },
        //     end: { x: this.x + this.width, y: this.y + this.height }
        // };
        // let right = {
        //     start: { x: this.x + this.width, y: this.y + this.height },
        //     end: { x: this.x, y: this.y + this.height }
        // };
        // let down = {
        //     start: { x: this.x, y: this.y + this.height },
        //     end: { x: this.x + this.width, y: this.y + this.height }
        // };
        // let left = {
        //     start: { x: this.x, y: this.y },
        //     end: { x: this.x, y: this.y + this.height }
        // };
        var upperLeft = { x: this.center.x - this.width / 2, y: this.center.y - this.height / 2 };
        var upperRight = { x: this.center.x + this.width / 2, y: this.center.y - this.height / 2 };
        var lowerRight = { x: this.center.x + this.width / 2, y: this.center.y + this.height / 2 };
        var lowerLeft = { x: this.center.x - this.width / 2, y: this.center.y + this.height / 2 };

        var up = { start: upperLeft, end: upperRight };
        var right = { start: upperRight, end: lowerRight };
        var down = { start: lowerLeft, end: lowerRight };
        var left = { start: lowerLeft, end: upperLeft };
        var lines = [up, right, down, left];
        //sides.push(top,right,down,left);
        return lines;
    }

    remove() {
        //remove the drawObjects for each edge
        this.edges.forEach(x => x.remove());

        this.incomingEdges.forEach(function (edge) {
            var neighbour = edge.From;
            neighbour.outgoingEdges = neighbour.outgoingEdges.filter(e => e !== edge);
        });

        this.outgoingEdges.forEach(function (edge) {
            var neighbour = edge.To;
            neighbour.incomingEdges = neighbour.incomingEdges.filter(e => e !== edge);
        });

        this.incomingEdges = [];
        this.outgoingEdges = [];
        this.drawObject.remove();

        this.removePointers();
        deselect();
    }

    Readd() {
        this.drawObject.add();
        $nodes.push(this);
    }

    removePointers() {
        $nodes = $nodes.filter(x => x !== this);
    }

    calcName() {
        var myNodes = this.sameNodes;
        var names = myNodes.map(x => x.name);

        //currently only works when you don't name them yourself. Be wary.
        var nrs = $.extend([0], names.map(x => parseInt(x.split(/(\d+)/)[1])));

        var highest = Math.max.apply(null, nrs);
        highest += 1;
        var newName = `${this.nameAbbreviation}` + highest;
        return newName;
    }

    Select() {
        $selectedButton.name = "Selected: " + this.name;
        if ($selected) { $selected.selected = false; }

        $selected = this;
        this.selected = true;

        $stateManager.SwitchToSelectionState();
    }

    get selected() { return this.selectionCircle.opacity > 0; }
    set selected(bool) { bool ? this.selectionCircle.opacity = 1 : this.selectionCircle.opacity = 0; this.redraw(); }

    get edges() { return this.outgoingEdges.concat(this.incomingEdges); }

    get name() { return this.namePlate.text; }
    set name(newname) {
        if (this.namePlate) namePlate.text = newname;
        else this.text = newname;
    }

    ResetColors() {

    }
    createBoundingBox() {
        var boundingBox = new Rectangle(Victor.fromObject(this.center).subtract(new Victor(this.width, this.height)));

    }
    //assuming rectangular shape. override if not the case
    edgePosition(endPos) {
        var upperLeft = { x: this.center.x - this.width / 2, y: this.center.y - this.height / 2 };
        var upperRight = { x: this.center.x + this.width / 2, y: this.center.y - this.height / 2 };
        var lowerRight = { x: this.center.x + this.width / 2, y: this.center.y + this.height / 2 };
        var lowerLeft = { x: this.center.x - this.width / 2, y: this.center.y + this.height / 2 };

        var up = { from: upperLeft, to: upperRight };
        var right = { from: upperRight, to: lowerRight };
        var down = { from: lowerLeft, to: lowerRight };
        var left = { from: lowerLeft, to: upperLeft };
        var lines = [up, right, down, left];

        var start = { x: this.center.x, y: this.center.y };
        var end = { x: endPos.x, y: endPos.y };

        //intersect each side
        for (var index = 0; index < lines.length; index++) {
            var element = lines[index];
            var intersect = segment_intersection(element.from, element.to, start, end);
            if (intersect) {
                return intersect;
            }
        }

        //this shouldnt happen, NODES SHOULD NOT OVERLAP!
        //alert('INTERSECTION ERROR!')
        return endPos;
    }



    alignEdge(edge, from, to, direction) {
        edge.start = from;
        edge.end = to;

        var triangle = edge.children[0];
        var edgepos = Victor.fromObject({ x: edge.x, y: edge.y });
        var triangleAnchor = edgepos.clone().subtract(Victor.fromObject(from));

        triangle.rotation = direction.angleDeg();
        triangle.x = triangleAnchor.x;
        triangle.y = triangleAnchor.y;
    }

    lineOnEdge() {
        //take into account petrinet states
        var center = Victor.fromObject(this.center);
        for (var index = 0; index < this.outgoingEdges.length; index++) {
            var edge = this.outgoingEdges[index];
            var targetCenter = Victor.fromObject(edge.To.center);
            var from = this.edgePosition(targetCenter); //diff
            var to = edge.To.edgePosition(center);
            var direction = targetCenter.clone().subtract(center);
            this.alignEdge(edge, from, to, direction);
        }

        for (var index = 0; index < this.incomingEdges.length; index++) {
            var edge = this.incomingEdges[index];
            var targetCenter = Victor.fromObject(edge.To.center);
            var from = edge.From.edgePosition(targetCenter);
            var to = edge.To.edgePosition(from);
            var direction = targetCenter.clone().subtract(from);
            this.alignEdge(edge, from, to, direction);
        }
    }

    AddDragAndDrop() {
        this.drawObject.dragAndDrop({
            start: function () {
                nodeIsMoving = true;
                this.classPointer.prevPosition = this.classPointer.position;
            },

            move: function () {
                this.classPointer.lineOnEdge();

            },
            end: function () {
                nodeIsMoving = false;
                if (!comparePosition(this.classPointer.prevPosition, this.classPointer.position)) {
                    var prevpos = this.classPointer.prevPosition;
                    var pos = this.classPointer.position;
                    var cmd = new MoveNodeCommand(this.classPointer, prevpos, pos);
                    cmd.Execute();
                    //logAction("stopped dragging", this.classPointer, "from " + prevpos + " to " + pos);
                }
            }
        });
    }
}

// Adapted from http://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect/1968345#1968345
var eps = 0.0000001;
function between(a, b, c) {
    return a - eps <= b && b <= c + eps;
}
//segment_intersection(x1,y1,x2,y2, x3,y3,x4,y4)
function segment_intersection(edgeStart, edgeEnd, lineStart, lineEnd) {
    var x1 = edgeStart.x;
    var y1 = edgeStart.y;
    var x2 = edgeEnd.x;
    var y2 = edgeEnd.y;
    var x3 = lineStart.x;
    var y3 = lineStart.y;
    var x4 = lineEnd.x;
    var y4 = lineEnd.y;

    var x = ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) /
        ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
    var y = ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) /
        ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
    if (isNaN(x) || isNaN(y)) {
        return false;
    } else {
        if (x1 >= x2) {
            if (!between(x2, x, x1)) { return false; }
        } else {
            if (!between(x1, x, x2)) { return false; }
        }
        if (y1 >= y2) {
            if (!between(y2, y, y1)) { return false; }
        } else {
            if (!between(y1, y, y2)) { return false; }
        }
        if (x3 >= x4) {
            if (!between(x4, x, x3)) { return false; }
        } else {
            if (!between(x3, x, x4)) { return false; }
        }
        if (y3 >= y4) {
            if (!between(y4, y, y3)) { return false; }
        } else {
            if (!between(y3, y, y4)) { return false; }
        }
    }
    return { x: x, y: y };
}