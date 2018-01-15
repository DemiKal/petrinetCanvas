function goToPlayerStats() {
    removeButtons();

    var data = getUserdata();
    var user = data.user;
    var p = 0.1;
    var pi = 1 - p;
    var q = 0.25;
    var qi = 2 * q;
    var rect = $canvas.display.rectangle({
        x: $canvas.width * q,
        y: $canvas.height * p,
        width: $canvas.width * (1 - qi),
        height: $canvas.height * (pi - p),
        fill: "rgb(4, 22, 41)"
    }).add();
    var font = "bold 30px sans-serif";
    var backmenu = new Button(rect.x - 200, rect.y, 200, 100, "Back to main menu", font);

 
    backmenu.bindManual("mouseenter", function () { this.fill = "orange"; this.redraw(); });
    backmenu.bindManual("mouseleave", function () { this.fill = "black"; this.redraw(); });
    backmenu.bindManual("click", function () {
        rect.remove();
        this.remove();
        initMainMenu();
        //$gamemode = "Campaign";
    });


    var text = $username + "\n" +
        "Level: " + user.level + "\n" +
        "XP: " + user.xp + "\n" +
        "Stars collected: " + user.stars + "\n" +
        "Achievement points: " + calcAP(user.achievements) +
        "\n\n\nAchievements:";

    var nametag = $canvas.display.text({
        text: text,
        font: font,
        x: rect.width * 0.1,
        y: rect.width * 0.1,
        origin: { x: "left", y: "top" },
        fill: "#eee"
    });

    // var userdata = getUserdata();
    var imgsize = 200;
    var image = $canvas.display.image({
        x: rect.width * 0.9,
        y: rect.width * 0.1,
        origin: { x: "right", y: "top" },
        image: "img/user_icon.png",
        width: imgsize,
        heigth: imgsize
    });
    var achievRect = $canvas.display.rectangle({
        x: rect.width * 0.1,
        y: rect.height * 0.5,
        width: rect.width * (0.8),
        height: rect.height * 0.5 * 0.8,
        // fill: "red"
    });

    var startx = achievRect.x;
    var starty = achievRect.y;
    var maxCol = 5;
    var maxRow = 2;

    var maxSquares = maxRow * maxCol;
    var bwidth = achievRect.width / maxCol;
    var bheight = achievRect.height / maxRow;

    for (let i = 0; i < Math.min(maxSquares, $achievements.length); i++) {
        var j_idx = Math.floor(i / maxCol);
        var i_idx = i % maxCol;
        var normalstroke = "inside 5px rgba(0, 0, 0, 0.5)";
        var moStroke = "inside 5px #FF8B4C";
        var normalBcolor = "grey";
        var opacity = 0.45;
        var earned = false;
        if ($.inArray(i, user.achievements) != -1) {
            earned = true;
            normalBcolor = "grey";
            // normalstroke = "inside 5px rgba(40, 200, 199, 0.6)";
            opacity = 1;
        }

        var achievButton = $canvas.display.rectangle({
            x: i_idx * bwidth,
            y: j_idx * bheight,
            width: bwidth,
            height: bheight,
            fill: normalBcolor,
            stroke: normalstroke,
            opacity: opacity
        });

        var achievImg = $canvas.display.image({
            x: bwidth / 2,
            y: bheight / 1.75,
            origin: { x: "center", y: "center" },
            image: "img/achievemen_icon.png",
            width: bwidth * 0.66,
            heigth: bheight * 0.66
        });
        var achievTxt = $canvas.display.text({
            x: bwidth * 0.05,
            y: bheight * 0.05,
            origin: { x: "left", y: "top" },
            text: $achievements[i].title,
            fill: "white",
            font: "bold 18px Arial"
        });


        achievButton.addChild(achievImg);
        achievButton.addChild(achievTxt);



        achievButton.bind("mouseenter", function () {
            this.stroke = moStroke;
            this.popup.add();
            this.redraw();
            this.popup.opacity = 0;
            this.popup.add().fadeIn("short", "ease-in-out-cubic");

        });

        achievButton.bind("mouseleave", function (e) {
            console.log("left button");
            this.stroke = normalstroke;

            this.popup.remove();
            this.redraw();
        });

        var popupstr = $achievements[i].description;
        if (!earned) popupstr += "\nNot yet earned!";
        var font2 = "19px sans-serif";
        var popupMessage = CreatePopupMessage({ x: 160, y: 160 }, popupstr, font2);
        popupMessage.opacity = 1;
        achievRect.addChild(achievButton);
        achievButton.addChild(popupMessage);

        // popupMessage.bind("mouseenter", function (e) {
        //     console.log("entered via new bind");
        //     var m = mousePos();
        //     e.stopPropagation();
        // });

        //popupMessage.zIndex = "front";
        achievButton.bind("mousemove", function (e) {
            var m = mousePos();
            // console.log('mousepos\n', m);
            var mypopup = this.popup;
            mypopup.x = m.x + 15;
            mypopup.y = m.y - 15;

            this.popup.redraw();
        });

        achievButton.popup = popupMessage;
        popupMessage.remove();
    }

    rect.addChild(nametag);
    rect.addChild(image);
    rect.addChild(achievRect);
}

function getUserdata() {
    var req = "php/getUserdata.php?";
    var toQstring = "name=" + $username;//jQuery.param(queryObj);
    var full_url = req + toQstring;

    var data = null;
    jQuery.ajax({
        url: full_url,
        success: function (result) {
            var res = JSON.parse(result);
            if (res.status != "OK") ErrorPopup("something went wrong!");
            else {
                //data = createDatabasePortfolio(res);
                data = res;
            }
        },
        error: function (e) {
            console.log("message:\n", e.message);
            ErrorPopup("Something went wrong!");
        },
        async: false
    });
    return data;
}
function calcAP(achvs) {
    var total = 0;
    achvs.forEach(function (e) { total += $achievements[e].score; });
    return total;
}