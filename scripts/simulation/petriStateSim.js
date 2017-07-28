//this is the class that denotes a (simulated) state of a petrinet
class petriStateSim {
    constructor(_places, prevState, transitionName) {
        this.places = _places;
        this.from = {};
        this.to = {};
        if (prevState) {
            this.from[JSON.stringify(prevState.places)] = transitionName;
            if (!dictEq(prevState.places, this.places))
                prevState.to[JSON.stringify(this.places)] = transitionName;
        }
    }
}