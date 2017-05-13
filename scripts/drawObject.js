// Note this is the wrapper class for the ocanvas drawing object.
// The drawObject field is the ocanvas drawing object.

class IstateA {
  constructor() { }
  Click(event) { }
  DoubleClick(event) { }
  Keydown(event) { }
}

class DefaultStateA extends IstateA {
  constructor() { super(); }
}

class ExecutionStateA extends IstateA {
  constructor() { super(); }
}

class SelectionStateA extends IstateA {
  constructor() {
    super();
  }
}

class DrawingObject {
  constructor() {
    this.drawObject = null;
    this.initEventHandler();
    this.DefaulState.parent = this;
    this.SelectionState.parent = this;
    this.ExecutionState.parent = this;
    this.currentState.parent = this;
  }

  get x() { return this.drawObject.x }
  set x(amount) { this.drawObject.x = amount }
 // get center() { return { x: this.x + this.width, y: this.y + this.width } }
  get y() { return this.drawObject.y }
  set y(amount) { this.drawObject.y = amount }
  // Click = event => this.currentState.Click(event);
  // DoubleClick = event => this.currentState(event);
  // Keydown = event => this.currentState.Keydown(event);
  redraw() { this.drawObject.redraw(); }
  initEventHandler() {
    this.DefaulState = new DefaultStateA();
    this.SelectionState = new SelectionStateA();
    this.ExecutionState = new ExecutionStateA();
    this.currentState = this.DefaulState;
  }
}
