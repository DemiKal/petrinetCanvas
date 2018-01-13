class Button extends DrawingObject {
    constructor(x, y, width, height, text) {
        super(x, y);
        this.drawObject = this.createButton(x, y, width, height, text);
        this.drawObject.classPointer = this;
    }

    get name() { return this.namePlate.text; }

    set name(newname) {
        if (this.namePlate) this.namePlate.text = newname;
        else this.text = newname;
    }
    bindManual(eventType, func) {
        this.drawObject.bind(eventType, func);
    }
    remove(){
        this.drawObject.remove();
    }

    fillColor(color) {
        this.drawObject.fill = color;
        this.redraw();
    }

    AddHelpMessage(text) {
        var pos = mousePos();
        var popupMessage = CreateFadingMessage(pos, text, this);
        popupMessage.opacity = 0;
        this.drawObject.addChild(popupMessage);
        popupMessage.zIndex = "front";
        return popupMessage;
    }

    createButton(x, y, width, height, text) {
        var button = $canvas.display.rectangle({
            x: x,
            y: y,
            width: width,
            height: height,
            fill: "#000"
        }).add();

        var buttonText = $canvas.display.text({
            x: button.width / 2,
            y: button.height / 2,
            origin: { x: "center", y: "center" },
            font: "bold 10px sans-serif",
            text: text,
            fill: "#fff"
        });

        this.namePlate = buttonText;
        button.addChild(buttonText);
        button.classPointer = null;
        button.classPointer = this;

        return button;
    }

}