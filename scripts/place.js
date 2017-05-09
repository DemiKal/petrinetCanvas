class Place extends Node {
  constructor (x, y, radius, text, tokens) {
    super()

    this.radius = radius
    this.text = text
    this.drawObject = createNode(x, y, radius, text, tokens)
    this.drawObject.classPointer = this
    this.namePlate = this.drawObject.children[0]
    this.tokensPlate = this.drawObject.children[1]
    this.tokenAmount = tokens
    this.originalTokens = this.tokenAmount
  }

  speak () { console.log('hi from place') }
  get tokens () { return this.tokenAmount }
  set tokens (amount) {
    this.tokenAmount = amount
    this.tokensPlate.text = amount
  }
}

function createNode (x, y, radius, text, tokens) {
  var node = $canvas.display.ellipse({
    x: x, y: y,
    radius: radius,
    stroke: '5px red',
    name: text
  })

  var nodeText = $canvas.display.text({
    x: 0,
    y: radius,
    origin: { x: 'center', y: 'top' },
    font: 'bold 30px sans-serif',
    text: text,
    fill: '#0ba'
  })

  var tokenText = $canvas.display.text({
    x: 0,
    y: 0,
    origin: { x: 'center', y: 'center' },
    font: 'bold 30px sans-serif',
    text: tokens,
    fill: '#0ba'
  })

  node.bind('click tap', function (event) { state.currentState.placeClick(node, event); })
  node.bind('dblclick ', function (event) { /*   fire(this);   */ })

  AddDragAndDrop(node)
  node.addChild(nodeText)
  node.addChild(tokenText)
  node.incomingEdges = []
  node.outgoingEdges = []
  node.add()
  node.tokens = tokens
  node.originalTokens = tokens
  node.nodeType = 'place'
  node.classPointer = null
  console.log(node.children)
  return node
}
