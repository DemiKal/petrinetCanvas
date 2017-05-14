// abstract class representing nodes, the superclass of places, transitions, etc

class Node extends DrawingObject {
  constructor() {
    super();
    this.incomingEdges = [];
    this.outgoingEdges = [];
    this.selectionCircle = null;
  }

  get selected() { return selectionCircle.opacity > 0 }
  set selected(bool) { if (bool == true) selectionCircle.opacity = 1 }

  get edges() { return this.outgoingEdges.concat(this.incomingEdges); }
  get name() { return this.namePlate.text; }
  set name(newname) {
    if (this.namePlate) namePlate.text = newname;
    else this.text = newname;
  }

  lineOnEdge() {
    this.edges.forEach(function (currentEdge) {
      var rectWidthFrom = currentEdge.From.width / 2;
      var rectWidthTo = currentEdge.To.width / 2;

      var subtractionRadius = Math.max(rectWidthFrom, rectWidthTo)

      var v1x = currentEdge.start.x = currentEdge.From.center.x;
      var v1y = currentEdge.start.y = currentEdge.From.center.y;
      var v2x = currentEdge.end.x = currentEdge.To.center.x
      var v2y = currentEdge.end.y = currentEdge.To.center.y

      var triangle = currentEdge.children[0];

      var vector = new Victor(v2x - v1x, v2y - v1y);

      var subvec = vector.clone().normalize().multiply(new Victor(subtractionRadius, subtractionRadius));

      currentEdge.start.x += subvec.x;
      currentEdge.start.y += subvec.y;
      currentEdge.end.x -= subvec.x;
      currentEdge.end.y -= subvec.y;

      var vec = Victor(currentEdge.end.x - currentEdge.x, currentEdge.end.y - currentEdge.y);
      var vec3 = new Victor(currentEdge.To.strokeWidth + triangle.radius / 2, currentEdge.To.strokeWidth + triangle.radius / 2);
      var subVec = vec.clone().normalize().multiply(vec3);
      vec.subtract(subVec);

      triangle.rotation = vector.angleDeg();
      triangle.x = vec.x;
      triangle.y = vec.y;

      currentEdge.end.x = triangle.abs_x;
      currentEdge.end.y = triangle.abs_y;
    })
  }

  // RemoveDragAndDrop() { this.drawObject.dragAndDrop(false) }

  AddDragAndDrop(opt) {
    this.drawObject.dragAndDrop({
      start: function () { nodeIsMoving = true },
      move: function () { this.classPointer.lineOnEdge() },
      end: function () { nodeIsMoving = false }
    })
  }
}
