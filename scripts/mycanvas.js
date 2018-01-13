jQuery(document).ready(function ($) {

    //these are the original global color setting. 
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

    //global vars
    //the list of actions that should be written to a (database) file. 
    //Currently a huge string.
    $actions = "";
    $nodes = [];
    $transitions = [];
    $edges = [];
    $PNstates = [];
    $simulationStates = [];
    $places = [];
    $selected = null;
    $selectedButton = null;
    edgePending = null;
    nodeIsMoving = false;
    petrinetStates = [];
    currentState = null;
    $stateManager = new StateManager();
    $CommandManager = new CommandManager();
    $buttons = [];
    mycanvas = document.getElementById("canvas");
    context = mycanvas.getContext("2d");
    mycanvas.width = $(window).width();
    mycanvas.height = $(window).height();
    var $canvasDOM = $("#canvas");
    var canvasOffset = $canvasDOM.offset();
    var scrollX = $canvasDOM.scrollLeft();
    var scrollY = $canvasDOM.scrollTop();

    $canvas = oCanvas.create({
        canvas: "#canvas",
        background: "#2c3e50",
        fps: 60,
    });

    $commandManager = new CommandManager();

    //create simple error message box
    $errorMessage = CreatePopupMessage({ x: 0, y: 0 }, "errormessage");
    $errorMessage.opacity = 0;

    $canvas.defaultState = new canvasDefaultState();
    $canvas.selectionState = new canvasSelectionState();
    $canvas.executionState = new canvasExecutionState();
    $canvas.edgePendingState = new canvasEdgePendingState();
    $canvas.currentState = $canvas.defaultState;

    //bool for selection box display. NYI
    $dragging = false;
    $selectionBox = $canvas.display.rectangle({ x: 0, y: 0, width: 0, height: 0, fill: "#0aa", opacity: 0 }).add();

    //right click on canvas override
    $canvasDOM.contextmenu(function () { return false; });

    //bind the input events to the canvas.
    $canvas.bind("click tap", function (event) { $canvas.currentState.Click(event); });
    $canvas.bind("mouseup", function (event) { $canvas.currentState.MouseUp(event); });
    $canvas.bind("mousemove", function (event) { $canvas.currentState.MouseMove(event); });
    $canvas.bind("mousedown", function (event) { $canvas.currentState.MouseDown(event); });
    $canvas.bind("keydown", function (event) { $canvas.currentState.KeyDown(event); });
    $canvas.bind("keypress", function (event) { $canvas.currentState.KeyPress(event); });
    $canvas.bind("keyup", function (event) { testf(); $canvas.currentState.KeyUp(event); });

    // let cmd = new AddPNStateCommand();
    // cmd.Execute({x: 200, y: 500}, false);
    // let cmd2 = new AddPNStateCommand();
    // cmd2.Execute({x: 800, y: 500}, false);  

    initUI();

    // var sss = $canvas.display.rectangle({ x: 400, y: 400, width: 100, height: 100, fill: "#0bs", opacity: 1 }).add();
    // sss.bind("mouseup", function (event) {
    //     xml("hello");

    // });



    // function xml(str) {
    //     if (str == "") {
    //         //document.getElementById("txtHint").innerHTML = "";
    //         return;
    //     }
    //     if (window.XMLHttpRequest) {
    //         // code for IE7+, Firefox, Chrome, Opera, Safari
    //         xmlhttp = new XMLHttpRequest();
    //     } else {  // code for IE6, IE5
    //         xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    //     }

    //     xmlhttp.onreadystatechange = function () {
    //         if (this.readyState == 4 && this.status == 200) {
    //             //document.getElementById("txtHint").innerHTML = this.responseText;
    //             console.log("GET request finished!");
    //             sss.fill = "hsl(" + Math.random() * 360 + ", 50%, 50%)";
    //             console.log(this.responseText);
    //             var obje = JSON.parse(this.responseText);
    //         }
    //     };

    //     xmlhttp.open("GET", "php/test.php?q=" + str, true);
    //     xmlhttp.send();
    // }
    
});

function testf(){
        // Get the Long type
        var Long = BSON.Long;
        // Create a bson parser instance
        var bson = new BSON();
    
        // Serialize document
       // var doc = { long: Long.fromNumber(100), es: Long.fromNumber(2) };
        
       var doc =       `object(MongoDB\Model\CollectionInfo)[30]
  public 'name' => string 'empcollection' (length=13)
  public 'type' => string 'collection' (length=10)
  public 'options' => 
    array (size=0)
      empty
  public 'info' => 
    array (size=2)
      'readOnly' => boolean false
      'uuid' => 
        object(MongoDB\BSON\Binary)[27]
          public 'data' => string '��Rp�Fg���Y�Z.�' (length=16)
          public 'type' => int 4
  public 'idIndex' => 
    array (size=4)
      'v' => int 2
      'key' => 
        array (size=1)
          '_id' => int 1
      'name' => string '_id_' (length=4)
      'ns' => string 'companydb.empcollection' (length=23)
      `;
      
        // Serialize a document
        //var data = bson.serialize(doc);
        // De serialize it again
        var doc_2 = bson.deserialize(doc);
}





