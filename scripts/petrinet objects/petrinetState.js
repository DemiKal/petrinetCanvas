class PetriNetState extends DrawingObject {
    constructor(fromState) {
        super();
        //from which state/node did it come from?

        this.from = fromState;
        this.nextStates = [];
        this.activeTransitions = [];
        this.id = [];

        for (var i = 0; i < $transitions.length; i++) {
            var trans = $transitions[i];
            if (trans.readyCheck(false))
                this.activeTransitions.push(trans)
        }

        var width = 0;
        var height = 100;
        var activePlaces = 0;
        for (var i = 0; i < $places.length; i++) {
            var place = $places[i];
            //increase width by 100 pixels
            if (place.tokens > 0) {
                width += 100;
                activePlaces++;
                this.id.push(place.tokens + "*" + place.name);
            }
        }



        var pos = { x: $canvas.width / 2, y: $canvas.height / 2 }


        var transition = $canvas.display.rectangle({
            x: pos.x, y: pos.y,
            width: width,
            height: height,
            stroke: "5px red",
            name: this.id
        }).add();

        for (var i = 0; i < $places.length; i++) {
            var place = $places[i];
            //increase width by 100 pixels

            if (place.tokens > 0) {
                var text = place.tokens + "*" + place.name;
                var currentWidth = width / activePlaces * i + 50;
                var text = $canvas.display.text({
                    x: currentWidth,
                    y: height / 2,
                    origin: { x: 'center', y: 'center' },
                    font: 'bold 30px sans-serif', text: text, fill: '#0ba'
                });

                transition.addChild(text);
            }
        }

        if (width == 0) transition.width = 100;
        transition.dragAndDrop();


    }
}


    // class PetriNetState {
    //     constructor(nodes) {
    //         this.places = this.getNodes("place");
    //         this.transitions = this.getNodes("transition");
    //         this.From;
    //         this.To;
    //     }

    //     getNodes(type) {
    //         var filteredNodes = [];
    //         nodes.forEach(function (node) {
    //             if (node.nodeType == type)
    //                 filteredNodes.push(node);
    //         });

    //         return filteredNodes;
    //     }
    // }