function initMainMenu() {
    $gamemode = "Main menu";
    var width = 300;
    var height = 75;
    $mainMenuButtons = [];
    var mainMenuOptions = ["Sandbox Mode", "Campaign Mode", "Player Stats", "Tutorial"];
    var midScreen = { x: mycanvas.width / 2 - width / 2, y: mycanvas.height / (mainMenuOptions.length + 1) };

    var redHover = function () { this.fill = "orange"; this.redraw(); };
    var resetColor = function () { this.fill = "black"; this.redraw(); };

    y = midScreen.y;
    for (let i = 0; i < mainMenuOptions.length; i++) {
        let j = i + 1;
        const text = mainMenuOptions[i];
        let button = new Button(midScreen.x, y, width, height, text, "bold 40px sans-serif");
        //+((i+1)*height*1.25))
        button.bindManual("mouseenter", redHover);
        button.bindManual("mouseleave", resetColor);
        y = y + height * 1.125;
        $mainMenuButtons.push(button);
    }

    $mainMenuButtons[0].bindManual("click", startSandboxMode);
    $mainMenuButtons[1].bindManual("click", goToCampaignMenu);
    // $mainMenuButtons[2].bindManual("click", goToCommunityMenu);
    $mainMenuButtons[2].bindManual("click", goToPlayerStats);
    $mainMenuButtons[3].bindManual("click", goToTutorial);

    var x = $mainMenuButtons[3].x;
    var y = $mainMenuButtons[3].y * 1.1 + $mainMenuButtons[3].height;

    var inputBox = createInputTextbox(x, y);

}
function createInputTextbox(x, y) {
    var rect = $canvas.display.rectangle({
        x: x, y: y, width: 200, height: 50, stroke: "outer 2px black", zIndex: "front"
    }).add();

    var text = $canvas.display.text({
        text: "input text here", y: 0, x: rect.height * 0.1,
        anchor: { x: "left", y: "top" }, opacity: 0.5,
        font: "19px sans-serif", fill: "black",
    });
    rect.addChild(text);
    rect.width = text.width * 1.1;
    rect.height = text.height;
    rect.originalWidth = rect.width;
    rect.text = text;
    rect.resize = function () {
        if (rect.text.width *1.1<= rect.originalWidth) rect.width = rect.originalWidth;
        else rect.width = rect.text.width*1.1;
    };

    rect.bind("click", function (event) {
        text.text = "";
        text.opacity = 1;
        rect.redraw();
        $inputPopup = rect;

    });
}
function goToTutorial() {
    removeButtons();
    $gamemode = "Sandbox";
    $canvas.redraw();
    initUI();
    initTutorial();
}

function goToCommunityMenu() {

}
function startSandboxMode() {
    removeButtons();
    $gamemode = "Sandbox";
    $canvas.redraw();
    initUI();

}

function goToCampaignMenu() {
    removeButtons();
    initCampaignUI();
}

function goToArcadeMode() {
    $gamemode = "Arcade";
    //TODO implement arcade mode!
    //initArcadeUI();
}



function removeButtons() {
    $mainMenuButtons.forEach(function (elem) { elem.remove(); });
    $mainMenuButtons = [];
}
