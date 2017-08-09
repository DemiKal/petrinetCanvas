class Place extends Node {
  constructor(x, y, radius, text, tokens) {
    super();
    this.radius = radius;
    this.text = text;
    this.drawObject = this.createNode(x, y, radius, text, tokens);
    this.drawObject.classPointer = this;
    this.namePlate = this.drawObject.children[0];
    this.tokensPlate = this.drawObject.children[1];
    this.tokenAmount = tokens;
    this.originalTokens = this.tokenAmount;
    this.AddDragAndDrop();
    this.extraButtons();
    this.selectionCircle = this.createSelectionCircle();

    this.defaultState = new placeDefaultState(this);
    this.edgePendingState = new placeEdgePendingState(this);
    this.selectionState = new placeSelectionState(this);
    this.executionState = new placeExecutionState(this);
    this.currentState = this.defaultState;



    this.initEventHandlers();
  }
  get getSameNodes() { return $.extend([], $places); }
  get nameAbbreviation() { return 'P'; }

  //override since the centerpoint is in the middle and not in the topleft like most objects
  get BoundingBox() {
    var rect = {
      left: this.x - this.width,
      top: this.y - this.height,
      right: this.x + this.width,
      bottom: this.y + this.height
    };

    return rect;
  }

  get width() { return this.radius; }
  set width(val) { this.drawObject.radius = val; }

  get height() { return this.radius; }
  set height(val) { this.drawObject.radius = val; }

  get center() { return { x: this.x, y: this.y } }
  get tokens() { return this.tokenAmount; }
  set tokens(amount) {
    this.tokenAmount = amount;
    this.tokensPlate.text = amount;
    this.redraw();
  }
  createSelectionCircle() {
    var selectionCircle = $canvas.display.ellipse({ x: 0, y: 0, radius: this.radius * 1.1, stroke: $colorSettings.place.selectionCircle, opacity: 0 });
    this.drawObject.addChild(selectionCircle);
    return selectionCircle;
  }

  createNode(x, y, radius, text, tokens) {
    var place = $canvas.display.ellipse({ x: x, y: y, radius: radius, stroke: $colorSettings.place.stroke, name: text });
    var nodeText = $canvas.display.text({
      x: 0, y: radius, origin: { x: 'center', y: 'top' },
      font: 'bold 30px sans-serif', text: text, fill: $colorSettings.place.nameColor
    });


    var tokenText = $canvas.display.text({
      x: 0, y: 0, origin: { x: 'center', y: 'center' },
      font: 'bold 30px sans-serif', text: tokens, fill: $colorSettings.place.tokenColor
    });

    place.addChild(nodeText);
    place.addChild(tokenText);
    place.add();
    //remove!
    place.tokens = tokens;
    place.originalTokens = tokens;
    place.nodeType = 'place';

    place.classPointer = this;

    return place;
  }
  edgePosition(endPos) {
    var from = Victor.fromObject(this.center);
    var to = Victor.fromObject(endPos);
    var dir = to.subtract(from).normalize();
    dir.multiply(new Victor(this.radius, this.radius));
    var newPos = from.clone().add(dir);

    return newPos;
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

    //TODO: MAKE OWN CLASS WITH STATE
    line.bind('click tap', function (event) { this.parent.classPointer.tokens++ });
  }

}


