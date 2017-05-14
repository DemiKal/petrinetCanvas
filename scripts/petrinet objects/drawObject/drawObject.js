// Note this is the wrapper class for the ocanvas drawing object.
// The drawObject field is the ocanvas drawing object.

class DrawingObject {
  constructor() {
    this.drawObject = null;
    this.selectionCircle = null;
    this.width = 0;
    this.height = 0;

    this.defaultState = null;
    this.edgePending = null;
    this.selectionState = null;
    this.executionState = null;
    this.currentState = null;
  }

  get x() { return this.drawObject.x }
  set x(amount) { this.drawObject.x = amount; }
  get center() { return { x: this.x, y: this.y } } get y() { return this.drawObject.y }
  set y(amount) { this.drawObject.y = amount; }

  redraw() { this.drawObject.redraw(); }
  dragAndDrop(opt) { this.drawObject.dragAndDrop(opt); }

  Click(classPointer, event) { this.currentState.Click(); }
  DoubleClick(classPointer, event) { this.currentState.DoubleClick(); }
  MouseEnter(classPointer, event) { this.currentState.MouseEnter(); }
  MouseLeave(classPointer, event) { this.currentState.MouseLeave(); }
}
