class PetriNetState {
    constructor(fromState) {
        //from which state/node did it come from?
        this.from = fromState
        this.nextStates = []
        this.activeTransitions = []
        this.id = []

        for (var i = 0; i < $nodes.length; i++) {
            var node = $nodes[i]
            if (node instanceof Transition) {
                if (node.readyCheck(false))
                    this.activeTransitions.push(node)
            }

            else {
                if (node.tokens > 0)
                    this.id.push(node.tokens + "*" + node.name)
            }
        }

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