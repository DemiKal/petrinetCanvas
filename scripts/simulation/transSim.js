//this is the simulated transition class
class TransSim {
    constructor(transition) {
        var incomingEdges = {};
        var outgoingEdges = {};
        $.each(transition.incomingEdges, function (index, value) {
            var idx = value.From.name;
            incomingEdges[idx] = 1; //consumption amount, should be variable!
        });

        $.each(transition.outgoingEdges, function (index, value) {
            outgoingEdges[value.To.name] = 1; //consumption amount, should be variable!
        });
        this.incomingEdges = incomingEdges;
        this.outgoingEdges = outgoingEdges;
        this.name = transition.name;
    }
}