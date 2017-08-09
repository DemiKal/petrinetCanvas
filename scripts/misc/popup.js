function CreatePopupMessage(pos, text) {
    //TODO: get font from general variable
    var font = "13px sans-serif";
    //if there is a style like bold or italic in front of NRpx, then index is 1.  
    var pxIndex = isDigitCode(font[0]) ? 0 : 1
    var fontpx = 1.1 * font.split(' ')[pxIndex].split('px')[0];
    var textlines = text.split('\n');
    var width = measureStringWidth(textlines, font);
    var height = fontpx * textlines.length;
    var rect = $canvas.display.rectangle({
        x: pos.x, y: pos.y,
        width: width * 1.05,
        height: height,
        stroke: "2px orange",
        zIndex: "front",
        opacity: 0
    }).add();


    var nodeText = $canvas.display.text({
        x: rect.width / 2, y: 0, origin: { x: 'center', y: 'top' },
        font: font, text: text, fill: $colorSettings.place.nameColor
    });

    rect.addChild(nodeText);
    rect.add();
    return rect;
}

function ErrorPopup(errorMessage) {
    var pos = mousePos();
    var font = "16px sans-serif";
    var pxIndex = isDigitCode(font[0]) ? 0 : 1
    var fontpx = 1.1 * font.split(' ')[pxIndex].split('px')[0];
    var textlines = errorMessage.split('\n');
    var width = measureStringWidth(textlines, font);
    
    $errorMessage.width = width;
    $errorMessage.height = 1.1 * font.split(' ')[pxIndex].split('px')[0];;
    $errorMessage.x = pos.x;
    $errorMessage.y = pos.y;

    $errorMessage.children[0].text = errorMessage;
    $errorMessage.children[0].x = $errorMessage.width / 2;
    $errorMessage.children[0].redraw();


    $errorMessage.finish();

    $errorMessage.fadeIn(100, "linear", function () { $errorMessage.fadeOut("long", "ease-in-cubic") });
}

function CreateClickablePopup(pos, text, obj) {
    var rect = CreatePopupMessage(pos, text);
    rect.opacity = 1;
    //make a clickable box to remove the message
    var boxSize = 25;//fontpx < 25 ? fontpx : 25;
    var xButton = $canvas.display.rectangle({
        x: rect.width, y: 0,
        width: boxSize,
        height: boxSize,
        stroke: "2px orange",
    });

    var ul = { x: 0, y: 0 };
    var ur = { x: xButton.width, y: 0 };
    var lr = { x: xButton.width, y: xButton.height };
    var ll = { x: 0, y: xButton.height };

    var line1 = $canvas.display.line({
        start: ul,
        end: lr,
        stroke: "2px red",
        cap: "square"
    });
    var line2 = line1.clone({ start: ll, end: ur });

    xButton.addChild(line1);
    xButton.addChild(line2);
    xButton.bind("click tap", function (event) {
        rect.opacity = 0;
        $canvas.redraw();
    });
    rect.addChild(xButton);
    rect.dragAndDrop();

    //if there is an object to draw a line to
    if (obj != null || obj != undefined) {
        var lineToEdge = $canvas.display.line({
            start: { x: 0, y: 0 },
            //end: { x: rect.x, y: rect.y },
            end: { x: obj.x - rect.x, y: obj.y - rect.y },
            stroke: "2px 0ba",
            cap: "square"
        });
        rect.addChild(lineToEdge);
        rect.dragAndDrop(false);
        rect.dragAndDrop({
            start: function () { },
            move: function () {
                // lineToEdge.end.x = obj.x;
                // lineToEdge.end.y = obj.y;
                console.log('rdargg')
                lineToEdge.end.x = obj.x - rect.x;
                lineToEdge.end.y = obj.y - rect.y;
            },
            end: function () { }
        });
    }
    return rect;
}


function CreateFadingMessage(pos, text, obj) {
    var rect = CreatePopupMessage(pos, text);
    rect.opacity = 0;
    obj.hoverTime = 0;
    obj.drawObject.bind("mouseenter", function () {
        $canvas.setLoop(function () {
            if (rect.opacity > 0) return;
            var sec = 1;
            if (obj.hoverTime > sec * $canvas.settings.fps) {
                obj.hoverTime = 0;
                var mousepos = mousePos();
                rect.x = mousepos.x;
                rect.y = mousepos.y;

                rect.fadeIn("short", "ease-out-cubic", function () { $canvas.timeline.stop(); });
            }
            else {
                obj.hoverTime += 1;
            }

        }).start();
    });

    obj.drawObject.bind("mouseleave", function () {
        rect.fadeOut("long", "ease-out-cubic", function () { });
        $canvas.timeline.stop();
        var s = obj.hoverTime;
        console.log('exiting button after ' + obj.hoverTime + " sec");
        obj.hoverTime = 0;
    });
    return rect;
}

function isDigitCode(n) {
    return !isNaN(parseInt(n));
}

//of the given textlines, get the widest for the border around it.
function measureStringWidth(textlines, font) {
    var ctx = mycanvas.getContext("2d");
    ctx.font = font;
    var list = textlines.map(function (element) { return ctx.measureText(element).width; });
    return Math.max.apply(null, list);

}