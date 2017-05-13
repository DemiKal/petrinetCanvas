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
  }

  get center() { return { x: this.x, y: this.y } }
  get tokens() { return this.tokenAmount; }
  set tokens(amount) {
    this.tokenAmount = amount;
    this.tokensPlate.text = amount;
  }
}

function createNode(x, y, radius, text, tokens) {
  var node = $canvas.display.ellipse({ x: x, y: y, radius: radius, stroke: '5px red', name: text });
  var nodeText = $canvas.display.text({
    x: 0, y: radius, origin: { x: 'center', y: 'top' },
    font: 'bold 30px sans-serif', text: text, fill: '#0ba'
  });

  var tokenText = $canvas.display.text({
    x: 0, y: 0, origin: { x: 'center', y: 'center' },
    font: 'bold 30px sans-serif', text: tokens, fill: '#0ba'
  });

  //refer to state!
  node.bind('click tap', function (event) { state.currentState.placeClick(node.classPointer, event); });
  node.bind('dblclick ', function (event) { /*   fire(this);   */ });

  node.addChild(nodeText);
  node.addChild(tokenText);
  node.add();
  //remove!
  node.tokens = tokens;
  node.originalTokens = tokens;
  node.nodeType = 'place';

  node.classPointer = null;

  return node;
}
