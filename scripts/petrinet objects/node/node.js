// abstract class representing nodes, the superclass of places, transitions, etc

class Node extends DrawingObject {
  constructor() {
    super();
    this.incomingEdges = [];
    this.outgoingEdges = [];
    this.selectionCircle = null;
  }

  Select() {
    $selectedButton.name = "Selected: " + this.name;
    if ($selected) { $selected.selected = false; }

    $selected = this;
    this.selected = true;
  }

  get selected() { return this.selectionCircle.opacity > 0 }
  set selected(bool) { bool ? this.selectionCircle.opacity = 1 : this.selectionCircle.opacity = 0; this.redraw(); }


  get edges() { return this.outgoingEdges.concat(this.incomingEdges); }
  get name() { return this.namePlate.text; }
  set name(newname) {
    if (this.namePlate) namePlate.text = newname;
    else this.text = newname;
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
    alert('INTERSECTION ERROR!')
    return false;
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
    //   var edge = this.outgoingEdges[index];
    //   var targetCenter = Victor.fromObject(edge.To.center)


    //   var from = this.edgePosition(targetCenter); //diff
    //   var to = edge.To.edgePosition(center);      //diff

    //   edge.end = to;
    //   edge.start = from;

    //   var direction = targetCenter.clone().subtract(center);  //diff
    //   var triangle = edge.children[0];
    //   var edgepos = Victor.fromObject({ x: edge.x, y: edge.y });
    //   var triangleAnchor = edgepos.clone().subtract(Victor.fromObject(from));

    //   triangle.rotation = direction.angleDeg();
    //   triangle.x = triangleAnchor.x;
    //   triangle.y = triangleAnchor.y;
    // }

    // for (var index = 0; index < this.incomingEdges.length; index++) {
    //   var edge = this.incomingEdges[index];
    //   var targetCenter = Victor.fromObject(edge.To.center)
    //   var from = edge.From.edgePosition(targetCenter);
    //   var to = edge.To.edgePosition(from);

    //   edge.end = to;
    //   edge.start = from;

    //   var direction = targetCenter.clone().subtract(from);  //diff
    //   var triangle = edge.children[0];
    //   var edgepos = Victor.fromObject({ x: edge.x, y: edge.y });
    //   var triangleAnchor = edgepos.clone().subtract(Victor.fromObject(from));

    //   triangle.rotation = direction.angleDeg();
    //   triangle.x = triangleAnchor.x;
    //   triangle.y = triangleAnchor.y;

    // }
    // this.edges.forEach(function (currentEdge) {
    //   var midpoint = center + currentEdge.To.center / 2;
    //   var to = currentEdge.To.edgePosition(center);
    //   var from = originalNode.edgePosition(currentEdge.to.center);
    //   currentEdge.end.x = to.x;
    //   currentEdge.end.y = to.y;
    //   currentEdge.start.x = from.x;
    //   currentEdge.start.y = from.y;


    // });
  }


  // lineOnEdge() {
  //   this.edges.forEach(function (currentEdge) {
  //     var rectWidthFrom = currentEdge.From.width / 2;
  //     var rectWidthTo = currentEdge.To.width / 2;

  //     var subtractionRadius = Math.max(rectWidthFrom, rectWidthTo)

  //     var v1x = currentEdge.start.x = currentEdge.From.center.x;
  //     var v1y = currentEdge.start.y = currentEdge.From.center.y;
  //     var v2x = currentEdge.end.x = currentEdge.To.center.x
  //     var v2y = currentEdge.end.y = currentEdge.To.center.y

  //     var triangle = currentEdge.children[0];

  //     var vector = new Victor(v2x - v1x, v2y - v1y);

  //     var subvec = vector.clone().normalize().multiply(new Victor(subtractionRadius, subtractionRadius));

  //     currentEdge.start.x += subvec.x;
  //     currentEdge.start.y += subvec.y;
  //     currentEdge.end.x -= subvec.x;
  //     currentEdge.end.y -= subvec.y;

  //     var vec = Victor(currentEdge.end.x - currentEdge.x, currentEdge.end.y - currentEdge.y);
  //     var vec3 = new Victor(currentEdge.To.strokeWidth + triangle.radius / 2, currentEdge.To.strokeWidth + triangle.radius / 2);
  //     var subVec = vec.clone().normalize().multiply(vec3);
  //     vec.subtract(subVec);

  //     triangle.rotation = vector.angleDeg();
  //     triangle.x = vec.x;
  //     triangle.y = vec.y;

  //     currentEdge.end.x = triangle.abs_x;
  //     currentEdge.end.y = triangle.abs_y;
  //   })
  // }

  // RemoveDragAndDrop() { this.drawObject.dragAndDrop(false) }

  AddDragAndDrop(opt) {
    this.drawObject.dragAndDrop({
      start: function () { nodeIsMoving = true },
      move: function () {
        console.log('dragging');
        this.classPointer.lineOnEdge()
      },
      end: function () { nodeIsMoving = false }
    })
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