function CreatePopup(pos, text, fade, obj) {
    //TODO: get font from general variable
    var font = "17px sans-serif";
    var fontsplitted = font.split(' ');
    //if there is a style like bold or italic in front of NRpx, then index is 1.  
    var pxIndex = isDigitCode(font[0]) ? 0 : 1
    var fontpx = 1.1 * font.split(' ')[pxIndex].split('px')[0];

    var ctx = mycanvas.getContext("2d");
    ctx.font = font;
    var width = ctx.measureText(text).width
    var rect = $canvas.display.rectangle({
        x: pos.x, y: pos.y,
        width: width * 1.05,
        height: fontpx,
        stroke: "2px orange",
        opacity: 0
    }).add();

    var nodeText = $canvas.display.text({
        x: rect.width / 2, y: 0, origin: { x: 'center', y: 'top' },
        font: font, text: text, fill: $colorSettings.place.nameColor
    });

    if (fade == undefined || fade == false) {
        var boxSize = fontpx < 25 ? fontpx : 25;
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
    }

    else {
        obj.drawObject.bind("mouseenter", function () {
            $canvas.setLoop(function () {
                console.log("entering button at " + obj.hoverTime);
                if (rect.opacity > 0) return;
                if (obj.hoverTime > 1) {
                    obj.hoverTime = 0;
                    rect.fadeIn("short", "ease-out-cubic", function () { $canvas.timeline.stop() });
                }
                else {
                    var add = 1 / $canvas.settings.fps;
                    obj.hoverTime += add
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
    }

    rect.hoverTime = 0;
    rect.addChild(nodeText);
    rect.add();


    return rect;

}

function isDigitCode(n) {
    return !isNaN(parseInt(n));
}