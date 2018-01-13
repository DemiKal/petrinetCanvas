jQuery(document).ready(function ($) {
    function initColorSettings() {
        $colorSettings = {
            petrinetState:
                {
                    stroke: "5px #f46e42",
                    correctStroke: "5px green",
                    incorrectStroke: "5px red",
                    selectionCircle: "3px orange"
                },
            place:
                {
                    stroke: "5px red",
                    nameColor: "#0ba",
                    tokenColor: "#0ba",
                    selectionCircle: "3px orange"
                },
            transition:
                {
                    stroke: "5px red",
                    nameColor: "#0ba",
                    readyFireStroke: "5px green",
                    selectionCircle: "3px orange"
                },
            edge:
                {
                    stroke: "11px #0aa",
                    correctStroke: "11px green",
                    incorrectStroke: "11px red",
                    arrow: "#0da",
                    incorrectArrow: "red",
                    correctArrow: "green",
                }
        };


    }
}