class petriStateSim {
    constructor(activePlaces, prevState) {
        this.places = activePlaces;
        this.from = {};
        this.to = {};
        if (prevState) {
            this.from[JSON.stringify(prevState.places)] = 0;
            if (!dictEq(prevState.places, this.places))
                prevState.to[JSON.stringify(this.places)] = 0;
        }

        this.signature = ""
    }
}