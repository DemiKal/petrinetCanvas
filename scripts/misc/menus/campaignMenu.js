function initCampaignUI() {
    var data = getCampaignlvls();
    graphButtons = data.rect.graphButtons;
    data.user.completedLvls.forEach(function (j) {
        var gb = graphButtons[j];
        var rad = 25;
        var completed = $canvas.display.text({
            x: gb.width * 0.05,
            y: gb.width * 0.05,
            origin: { x: "left", y: "top" },
            font: "bold 17px sans-serif",
            text: "Completed!",
            fill: "#42b9f4"
        });

        gb.addChild(completed);
    });

    var str1 = "Hello World!";
    var result = str1.fontsize(7);

    var p = 0.01;
    var font = { style: "bold", size: 30, type: "sans-serif" };
    var backmenu = new Button(p * $canvas.width, p * $canvas.height, 200, 100, "Back to main menu", font);
    backmenu.bindManual("click", initMainMenu);
    backmenu.bindManual("click", function () {
        data.rect.remove();
        this.remove();
        $gamemode = "Campaign";
    });
    graphButtons.forEach(o => o.bind("click", function () {
        initUI();
        backmenu.remove(); 
    }));
}

function getCampaignlvls() {
    var req = "php/getCampaignlvls.php?";
    var toQstring = "name=" + $username;//jQuery.param(queryObj);
    var full_url = req + toQstring;

    var data = null;
    jQuery.ajax({
        url: full_url,
        success: function (result) {
            var res = JSON.parse(result);
            if (res.status != "OK") ErrorPopup("something went wrong!");
            else {
                data = createDatabasePortfolio(res);
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