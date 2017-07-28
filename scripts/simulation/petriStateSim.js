class petriStateSim {
    constructor(activePlaces, prevState, transitionName) {
        this.places = activePlaces;
        this.from = {};
        this.to = {};
        if (prevState) {
            this.from[JSON.stringify(prevState.places)] = transitionName;
            if (!dictEq(prevState.places, this.places))
                prevState.to[JSON.stringify(this.places)] = transitionName;
        }
    }
}