function initMainMenu() {
    var width = 300;
    var height = 75;
    $mainMenuButtons=[];
    var mainMenuOptions=["Sandbox Mode","Campaign Mode","Community levels","Options"]
    var midScreen = { x: mycanvas.width / 2 - width / 2, y: mycanvas.height / (mainMenuOptions.length+1) };


    // var button1 = new Button(midScreen.x, midScreen.y, width, height, "Sandbox mode");
     

    //  var y = midScreen.y+height*1.25;
    //  var button2 = new Button(midScreen.x, y, width, height, "Campaign Mode");

    //  y = y+height*1.25;
    //  var button3 = new Button(midScreen.x, y, width, height, "Settings");
     
     var redHover = function(){         this.fill="red";         this.redraw();     }; 
     var resetColor = function(){        this.fill = "black";        this.redraw();     };

    //  button1.bindManual("mouseenter", redHover);
    //  button1.bindManual("mouseleave", resetColor);
    //  button2.bindManual("mouseenter", redHover);
    //  button2.bindManual("mouseleave", resetColor);
    //  button3.bindManual("mouseenter", redHover);
    //  button3.bindManual("mouseleave", resetColor);



    y = midScreen.y;
     for (let i = 0; i < mainMenuOptions.length; i++) {
        let j = i+1;
        const text = mainMenuOptions[i];
        let button = new Button(midScreen.x, y, width, height, text);
        //+((i+1)*height*1.25))
        button.bindManual("mouseenter", redHover);
        button.bindManual("mouseleave", resetColor);
        y = y + height*1.125;
        $mainMenuButtons.push(button);
    }

    $mainMenuButtons[0].bindManual("click",startSandboxMode);



}
function startSandboxMode(){
    $mainMenuButtons.forEach(function(elem){        elem.remove();    });
    $mainMenuButtons = [];
    initUI();

}