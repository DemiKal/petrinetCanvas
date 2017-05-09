// abstract class representing nodes, the superclass of places, transitions, etc

class Node {
  constructor () {
    // this.drawObject;
    // this.namePlate;
  }

  get x () { return this.drawObject.x} // { return this.drawObject.x }
  set x (amount) { this.drawObject.x = amount }

  get y () { return this.drawObject.y }
  set y (amount) { this.drawObject.y = amount }

  redraw () { this.drawObject.redraw(); }
  get incomingEdges () { return this.drawObject.incomingEdges; }
  get outgoingEdges () { return this.drawObject.outgoingEdges; }
  get name () { return this.namePlate.text; }
  set name (newname) {
    if (this.namePlate) namePlate.text = newname
    else this.text = newname
  }

  dragAndDrop (option) { this.drawObject.dragAndDrop(option) }
  speak () { console.log('hi!') }
}

// OVERRIDE PER CLASS
function lineOnEdge (node) {
  var adjEdges = node.outgoingEdges.concat(node.incomingEdges)

  adjEdges.forEach(function (currentEdge) {
    var rectWidthFrom = currentEdge.From.width / 2
    var rectWidthTo = currentEdge.To.width / 2

    var subtractionRadius = Math.max(rectWidthFrom, rectWidthTo)

    var v1x = currentEdge.start.x = currentEdge.From.x + rectWidthFrom
    var v1y = currentEdge.start.y = currentEdge.From.y + rectWidthFrom
    var v2x = currentEdge.end.x = currentEdge.To.x + rectWidthTo
    var v2y = currentEdge.end.y = currentEdge.To.y + rectWidthTo

    var triangle = currentEdge.children[0]

    var vector = new Victor(v2x - v1x, v2y - v1y)

    var subvec = vector.clone().normalize().multiply(new Victor(subtractionRadius, subtractionRadius))

    currentEdge.start.x += subvec.x
    currentEdge.start.y += subvec.y
    currentEdge.end.x -= subvec.x
    currentEdge.end.y -= subvec.y

    var vec = Victor(currentEdge.end.x - currentEdge.x, currentEdge.end.y - currentEdge.y)
    var vec3 = new Victor(currentEdge.To.strokeWidth + triangle.radius / 2, currentEdge.To.strokeWidth + triangle.radius / 2)
    var subVec = vec.clone().normalize().multiply(vec3)
    vec.subtract(subVec)

    triangle.rotation = vector.angleDeg()
    triangle.x = vec.x
    triangle.y = vec.y

    currentEdge.end.x = triangle.abs_x
    currentEdge.end.y = triangle.abs_y
  })
}

function AddDragAndDrop (node) {
  node.dragAndDrop({
    start: function () {
      nodeIsMoving = true
    },
    move: function () { lineOnEdge(node); },
    end: function () {
      nodeIsMoving = false
    }
  })
}
