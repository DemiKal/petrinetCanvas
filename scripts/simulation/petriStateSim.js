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
        this.activePlaces = {};
        var active_places = {};
        //sort the keys
        Object.keys(_places).sort().forEach(function (key) {
            if (_places[key] > 0) active_places[key] = _places[key];
        }, this);
        this.activePlaces = $.extend({}, active_places);

    }

    get outgoingEdges() {
        var outgoingEdges = [];
        //var toDict = JSON.parse(this.to);
        for (var key in this.to) {
            var parsedKey = JSON.parse(key);
            var filteredState = {};

            //key2 could break, watch out
            for (var key2 in parsedKey) {
                if (parsedKey[key2] > 0)
                    filteredState[key2] = parsedKey[key2];
            }

            var obj = Object();
            var obj2 = Object();
            obj2.activePlaces = filteredState;
            obj.To = obj2;
            outgoingEdges.push(obj);
        }

        return outgoingEdges;

    }
}