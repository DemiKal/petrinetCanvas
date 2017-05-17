class Place extends Node {
  constructor(x, y, radius, text, tokens) {
    super();
    this.radius = radius;
    this.text = text;
    this.drawObject = createNode(x, y, radius, text, tokens);
    this.drawObject.classPointer = this;
    this.namePlate = this.drawObject.children[0];
    this.tokensPlate = this.drawObject.children[1];
    this.width = radius;
    this.height = radius;
    this.tokenAmount = tokens;
    this.originalTokens = this.tokenAmount;
    this.AddDragAndDrop();
    this.extraButtons();

    this.defaultState = new placeDefaultState(this);
    this.edgePending = new placeEdgePendingState(this);
    this.selectionState = new placeSelectionState(this);
    this.executionState = new placeExecutionState(this);
    this.currentState = this.defaultState;

    this.selectionCircle = $canvas.display.ellipse({ x: 0, y: 0, radius: this.radius * 1.1, stroke: "3px orange", opacity: 0});
    this.drawObject.addChild(this.selectionCircle);

      // this.selectionCircle = $canvas.display.ellipse({ x: 0, y: 0, radius: 55, stroke: "3px orange", opacity: 1});
    //this.drawObject.add(this.selectionCircle)
  }

  get center() { return { x: this.x, y: this.y } }
  get tokens() { return this.tokenAmount; }
  set tokens(amount) {
    this.tokenAmount = amount;
    this.tokensPlate.text = amount;
  }


  extraButtons() {
    //set plus sign
    var stroke = "4px yellow";
    var length = 10;
    var line = $canvas.display.line({
      start: { x: this.drawObject.radius * 1.2, y: 0 },
      end: { x: this.drawObject.radius * 1.2 + length, y: 0 },
      stroke: stroke,
      cap: "round",
      opacity: 0
    })

    var line2 = $canvas.display.line({
      start: { x: 0, y: - length / 2 },
      end: { x: 0, y: length / 2 },
      stroke: stroke,
      cap: "round"
    });

    line.addChild(line2);
    this.drawObject.addChild(line) //child  index 2
   

    //TODO MAKE OWN CLASS WITH STATE
    line.bind('click tap', function (event) { this.parent.classPointer.tokens++ });
  }


}

function createNode(x, y, radius, text, tokens) {
  var place = $canvas.display.ellipse({ x: x, y: y, radius: radius, stroke: '5px red', name: text });
  var nodeText = $canvas.display.text({
    x: 0, y: radius, origin: { x: 'center', y: 'top' },
    font: 'bold 30px sans-serif', text: text, fill: '#0ba'
  });

  var tokenText = $canvas.display.text({
    x: 0, y: 0, origin: { x: 'center', y: 'center' },
    font: 'bold 30px sans-serif', text: tokens, fill: '#0ba'
  });

  place.addChild(nodeText);
  place.addChild(tokenText);
  place.add();
  //remove!
  place.tokens = tokens;
  place.originalTokens = tokens;
  place.nodeType = 'place';

  place.classPointer = null;

  //refer to state!
  place.bind('click tap', function (event) { place.classPointer.currentState.Click(event); });
  place.bind('dblclick', function (event) { /*   fire(this);   */ });
  place.bind('mouseenter', function (event) { place.classPointer.currentState.MouseEnter(event) });
  place.bind('mouseleave', function (event) { place.classPointer.currentState.MouseLeave(event) });

  var selectionCircleColor = "3px orange"
  selectionCircle = $canvas.display.ellipse({ x: 0, y: 0, radius: radius * 1.1, stroke: selectionCircleColor, opacity: 0 });

  place.addChild(selectionCircle);



  return place;
}
