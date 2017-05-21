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

    //refer in drawobject to this?
  }
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
