function initTutorial() {
    $gamemode = "Tutorial";
    var text = "Welcome to the Petri net Canvas tutorial!\n" +
        "First, let's begin by adding a Place. " +
        "Press [P] on your keyboad\nThe Place will be added at your mouse cursor.";
    var pos = { x: $canvas.width / 3, y: $canvas.height / 2 };
    var tutmsg = CreateTutorialMessage(text);
}
function updateTxt(rect, text) {
    var t = rect.children[0];
    c = t.clone({ text: text });


    t.fadeOut(100, "linear", function () {
        t.text = text;
      t.fadeIn(100, "linear");

    });
    rect.animate({
        width: c.width * 1.1,
        height: c.height * 1.2,
    }, {
            duration: 200,
            easing: "sinusiodal"
        });


        c.remove();
    
}

function CreateTutorialMessage(text) {
    var font = "25px Arial";
    var rect = $canvas.display.rectangle({
        x: $canvas.width / 2,
        y: $canvas.height / 2,
        fill: "rgba(0, 0, 0, 0.8)",
        stroke: "outside 2px grey",
        origin: { x: "center", y: "center" }
    }).add();

    var txt = $canvas.display.text({
        x: 0, y: 0,
        fill: "#fff",
        origin: { x: "center", y: "center" },
        text: text
    });

    rect.width = txt.width * 1.1;
    rect.height = txt.height * 1.2;
    rect.addChild(txt);

    $canvas.bind("keyup", function tut1(event) {
        if ($gamemode != "Tutorial") {
            $canvas.unbind("click", tut1);
            return;
        }
        else if ("P" == String.fromCharCode(event.which)) {
            Tutorial2(rect);
            $canvas.unbind("keyup", tut1);
        }
    });

    return rect;
}
function Tutorial2(rect) {
    var txt = "Good!\nNow press [T] to create a Transition";
    updateTxt(rect, txt);

    $canvas.bind("keyup", function tut2(event) {
        if ($gamemode != "Tutorial") $canvas.unbind("keyup", tut2);
        else if ("T" == String.fromCharCode(event.which)) {
            Tutorial3(rect);
            $canvas.unbind("keyup", tut2);
        }
    });
}

function Tutorial3(rect) {
    var txt = "Excellent!\nNow select the place \"P1\",\nthen press [E] to create an edge.\n" +
        "then click on \"T1\"";
    updateTxt(rect, txt);

    var t = $transitions[0];
    $canvas.bind("keyup", canvastut3(event));

    t.bindManual("click", function tut3p2() {
        if (t.incomingEdges.length > 0)
            if (t.incomingEdges[0].From.name == "P1") {
                Tutorial4(rect);
                t.drawObject.unbind("click", tut3p2);
                $canvas.unbind("keyup", canvastut3);
            }
    });
}

function canvastut3(event) {
    if ($gamemode != "Tutorial") $canvas.unbind("keyup", tut3);
    else if ("E" == String.fromCharCode(event.which)) {
        if ($selected)
            if ($selected.constructor == Place) {
                CreatePopupMessage(mousePos(), "Now click on T1");
                // $canvas.unbind("keyup", tut3);
            }
    }
}

function Tutorial4(rect) {
    var txt = "Now create 2 Petri net states.\nPress [Q] on your keyboard";
    updateTxt(rect, txt);
    $canvas.bind("keyup", function tut4(event) {
        if ($gamemode != "Tutorial") $canvas.unbind("keyup", tut4);
        if ($PNstates.length == 2) {
            Tutorial5(rect);
            $canvas.unbind("keyup", tut4);
        }
        else if ("Q" == String.fromCharCode(event.which)) {
            if ($PNstates.length != 2) return;
            Tutorial5(rect);
            $canvas.unbind("keyup", tut4);
        }
    });
}

function Tutorial5(rect) {
    var txt = "Now give the first state [1*P1]\nand leave the second state empty.\nThen connect [1*P1] to the empty one";
    updateTxt(rect, txt);

    for (let i = 0; i < $PNstates.length; i++) {
        const element = $PNstates[i];
        element.drawObject.bind("click", tut5, element.drawObject);
        element.drawObject.rect = rect;
    }
}
function tut5(event) {
    var co = this.classPointer;
    if (co.id == "")
        if (co.incomingEdges.length > 0) {

            if ("1*P1" === co.incomingEdges[0].From.id) {
                Tutorial6(this.rect);
                $PNstates.forEach(o => o.drawObject.unbind("click", tut5));
            }


        }
    if (co.id == "1*P1")
        if (co.outgoingEdges.length > 0) {
            if ("" === co.outgoingEdges[0].To.id);

            Tutorial6(this.rect);
            $PNstates.forEach(o => o.drawObject.unbind("click", tut5));
        }
}

function Tutorial6(rect) {
    var txt = "Nice!\nnow the last st ep, click on \"validate\" in the graph menu.";

    updateTxt(rect, txt);
    $validateButton.opacity = 1;
    $validateButton.stroke = "outside 2px green";
    $validateButton.bind("click", function e(event) {
        //     var s = $clickablePopups.map(o => o.children[0].tag);
        // var i = $.inArray("Summary", s);
        // if(i!=-1)
        // {

        // }
        if ($summaryPopup) {
            if ($summaryPopup.totalRating != 100) {
                txt = "Hmm.. something went wrong\n" +
                    "Remember, one state should have [1*P1]\n" +
                    + "and the other should be empty";
            }
            else {
                txt = "Congratulations!\nYou have finished the tutorial! You have earned an achievement!" +
                    "\nYou can go back to the main menu through the left-most menu";
                $validateButton.unbind("click", e);
                $enterMainMenuButton.stroke = "outside 2px green";

                $enterMainMenuButton.bind("click", function ee(event) {
                    rect.remove();
                    if ($summaryPopup) $summaryPopup.remove();
                    $gamemode = "Main menu";
                });
            }
            updateTxt(rect, txt);
        }


    });

}

