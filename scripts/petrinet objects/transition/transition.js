class Transition extends Node {
	constructor(x, y, width, height) {
		super();
		var name = this.calcName();
		this.drawObject = this.createTransition(x, y, width, height, name); //make width/heigth independent
		this.drawObject.classPointer = this;
		this.namePlate = this.drawObject.children[0];
		this.width = width;
		this.height = height;
		this.AddDragAndDrop();

		this.defaultState = new TransitionDefaultState(this);
		this.edgePendingState = new TransitionEdgePendingState(this);
		this.selectionState = new TransitionSelectionState(this);
		this.executionState = new TransitionExecutionState(this);
		this.currentState = this.defaultState;

		this.selectionCircle = this.createSelectionCircle();
		this.initEventHandlers();
	}


	get sameNodes() { return $.extend([], $transitions); }
	get nameAbbreviation() { return "T"; }

	get center() { return { x: this.x + this.width / 2, y: this.y + this.height / 2 }; }

	removePointers() {
		super.removePointers();
		$transitions = $transitions.filter(x => x !== this);
	}

	ResetColors() {
		this.drawObject.stroke = $colorSettings.transition.stroke;
		this.redraw();
	}

	createSelectionCircle() {
		var selectionCircle = $canvas.display.rectangle({
			x: -0.05 * this.width,
			y: -0.05 * this.height,
			width: this.width * 1.1,
			height: this.height * 1.1,
			stroke: $colorSettings.transition.selectionCircle,
			opacity: 0
		});

		this.drawObject.addChild(selectionCircle);
		return selectionCircle;
	}

	//check if all incoming edges have > 0 tokens
	readyCheck(colorIndicator = true) {
		var isSated = true;
		this.incomingEdges.forEach(function (element) { if (element.From.tokens < 1) isSated = false; });

		if (!colorIndicator) return isSated;

		if (isSated) this.drawObject.stroke = $colorSettings.transition.readyFireStroke;
		else this.drawObject.stroke = $colorSettings.transition.stroke;
		this.redraw();
		return isSated;
	}
	Readd() {
		super.Readd();
		$transitions.push(this);
	}
	
	//consume a token from incoming edges, then distribute
	fire() {
		//consume
		this.incomingEdges.forEach(function (edge) {
			var adj = edge.From;
			adj.tokens -= 1;
			//adj.children[1].text = adj.tokens;

			var ball = $canvas.display.ellipse({
				x: edge.start.x, y: edge.start.y,
				radius: 20, fill: "red",
			}).add();

			ball.animate({ x: edge.end.x, y: edge.end.y, opacity: 0 },
				{ duration: "normal", easing: "ease-out-quint", });
		});

		//produce
		this.outgoingEdges.forEach(function (element) {
			var adj = element.To;
			adj.tokens++;
			var ball = $canvas.display.ellipse({ x: element.start.x, y: element.start.y, radius: 20, fill: "red", }).add();

			ball.animate({
				x: element.end.x,
				y: element.end.y,
				opacity: 0
			},
				{
					duration: "long",
					easing: "ease-out-quint",
				});
		});
	}

	createTransition(x, y, width, height, text) {
		var transition = $canvas.display.rectangle({
			x: x, y: y,
			width: width,
			height: height,
			stroke: $colorSettings.transition.stroke,
			name: text
		});
         
		var nodeText = $canvas.display.text({
			x: width / 2,
			y: height/2,
			origin: { x: "center", y: "center" },
			font: "bold 30px sans-serif",
			text: text,
			fill: $colorSettings.place.nameColor
		});

		transition.addChild(nodeText);
		transition.classPointer = null;
		transition.add();

		return transition;
	}
}