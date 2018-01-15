function initMainMenu() {
    createAchievements();
    var width = 300;
    var height = 75;
    $mainMenuButtons = [];
    var mainMenuOptions = ["Sandbox Mode", "Campaign Mode", "Community levels", "Player Stats"];
    var midScreen = { x: mycanvas.width / 2 - width / 2, y: mycanvas.height / (mainMenuOptions.length + 1) };

    var redHover = function () { this.fill = "orange"; this.redraw(); };
    var resetColor = function () { this.fill = "black"; this.redraw(); };

    y = midScreen.y;
    for (let i = 0; i < mainMenuOptions.length; i++) {
        let j = i + 1;
        const text = mainMenuOptions[i];
        let button = new Button(midScreen.x, y, width, height, text);
        //+((i+1)*height*1.25))
        button.bindManual("mouseenter", redHover);
        button.bindManual("mouseleave", resetColor);
        y = y + height * 1.125;
        $mainMenuButtons.push(button);
    }

    $mainMenuButtons[0].bindManual("click", startSandboxMode);
    $mainMenuButtons[1].bindManual("click", goToCampaignMenu);
    //$mainMenuButtons[2].bindManual("click", goToCampaignMenu);
    $mainMenuButtons[3].bindManual("click", goToPlayerStats);
}

function startSandboxMode() {
    removeButtons();
    $gamemode = "Sandbox";
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
