class canvasDefaultState{
    constructor(){ }

    Click(event) {
        /// /set current place as selected
        console.log('clicked canvas in default state');

    }
    DoubleClick(event){ console.log('DOUBLEclicked canvas') }

    MouseDown(event){
        console.log('mousedown canvas');

    }

    MouseUp(event){

    }

    MouseMove(event) { }
    KeyDown(event) {

        var pos = { x: $canvas.mouse.x, y: $canvas.mouse.y };
        // key T
        if (event.which === 84) AddTransition(pos);

        //key A
        if (event.which === 65) AddPlace(pos); }
    KeyPress(event) { }
    KeyUp(event) { }
}