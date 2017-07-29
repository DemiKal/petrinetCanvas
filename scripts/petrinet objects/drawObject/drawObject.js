// Note this is the wrapper class for the ocanvas drawing object.
// The drawObject field is the ocanvas drawing object.

class DrawingObject {
  constructor() {
    this.drawObject = null;
    this.selectionCircle = null;
    this.namePlate = null;
    this.defaultState = null;
    this.selectionState = null;
    this.executionState = null;
    this.currentState = null;
  }

  //check collisions with adjacent nodes.
  //not necessary, may omit if buggy or performance issues
  checkCollision(otherNodes) {
    for (var index = 0; index < otherNodes.length; index++) {
      var otherNode = otherNodes[index].To.name == this.name ? otherNode = otherNodes[index].From : otherNode = otherNodes[index].To;
      var otherBB = otherNode.BoundingBox;
      var collision = this.intersect(otherBB);

      if (collision) {
        console.log('collison!!', collision);
        this.drawObject.dragging = false;
        var vec = Victor.fromObject(otherNode.center).subtract(Victor.fromObject(this.center)).normalize();
        this.x -= 13 * vec.x;
        this.y -= 13 * vec.y;
      }
    }
  }

  get BoundingBox() {
    var rect = {
      left: this.x,
      top: this.y,
      right: this.x + this.width,
      bottom: this.y + this.height
    };

    return rect;
  }

  intersect(b) {
    var a = this.BoundingBox;
    return (a.left <= b.right &&
      b.left <= a.right &&
      a.top <= b.bottom &&
      b.top <= a.bottom)
  }

  get dragging() { return this.drawObject.dragging; }
  set dragging(val) { this.drawObject.dragging = val; }

  get width() { return this.drawObject.width; }
  set width(val) { this.drawObject.width = val; }

  get height() { return this.drawObject.height; }
  set height(val) { this.drawObject.height = val; }

  get x() { return this.drawObject.x }
  set x(amount) { this.drawObject.x = amount; }
  get y() { return this.drawObject.y }
  set y(amount) { this.drawObject.y = amount; }

  get center() { return { x: this.x, y: this.y } }


  redraw() { this.drawObject.redraw(); }
  dragAndDrop(opt) { this.drawObject.dragAndDrop(opt); }

  initEventHandlers() {
    this.drawObject.bind("click tap", function (event, classPointer) {
      this.classPointer.currentState.Click(event);
      event.stopPropagation();
    });
    this.drawObject.bind("dblclick", function (event, classPointer) {
      this.classPointer.currentState.DoubleClick(event); event.stopPropagation();
    });
    this.drawObject.bind("mouseenter", function (event, classPointer) {
      this.classPointer.currentState.MouseEnter(event); event.stopPropagation();
    });
    this.drawObject.bind("mouseleave", function (event, classPointer) {
      this.classPointer.currentState.MouseLeave(event); event.stopPropagation();
    });
  }

  // Click(classPointer, event) { this.currentState.Click(); }
  // DoubleClick(classPointer, event) { this.currentState.DoubleClick(); }
  // MouseEnter(classPointer, event) { this.currentState.MouseEnter(); }
  // MouseLeave(classPointer, event) { this.currentState.MouseLeave(); }
}
