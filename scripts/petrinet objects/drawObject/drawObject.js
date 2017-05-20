// Note this is the wrapper class for the ocanvas drawing object.
// The drawObject field is the ocanvas drawing object.

class DrawingObject {
  constructor() {
    this.drawObject = null;
    this.selectionCircle = null;
    this.width = 0;
    this.height = 0;
    this.namePlate = null;
    this.defaultState = null;
    this.selectionState = null;
    this.executionState = null;
    this.currentState = null;

    //refer in drawobject to this?
  }

  get x() { return this.drawObject.x }
  set x(amount) { this.drawObject.x = amount; }
  get center() { return { x: this.x, y: this.y } } get y() { return this.drawObject.y }
  set y(amount) { this.drawObject.y = amount; }

  redraw() { this.drawObject.redraw(); }
  dragAndDrop(opt) { this.drawObject.dragAndDrop(opt); }

  initEventHandlers() {
    this.drawObject.bind("click tap", function (event, classPointer) { this.classPointer.currentState.Click(event); });
    this.drawObject.bind("dblclick", function (event, classPointer) { this.classPointer.currentState.DoubleClick(event); });
    this.drawObject.bind("mouseenter", function (event, classPointer) { this.classPointer.currentState.MouseEnter(event); });
    this.drawObject.bind("mouseleave", function (event, classPointer) { this.classPointer.currentState.MouseLeave(event); });
  }
  // Click(classPointer, event) { this.currentState.Click(); }
  // DoubleClick(classPointer, event) { this.currentState.DoubleClick(); }
  // MouseEnter(classPointer, event) { this.currentState.MouseEnter(); }
  // MouseLeave(classPointer, event) { this.currentState.MouseLeave(); }
}
