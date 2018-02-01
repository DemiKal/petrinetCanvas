class ContextMenu {
    constructor(x, y, h, w, objref) {
        this.objref = objref;
        this.children = [];
        this.x = x;
        this.y = y;
        this.height = h;
        this.width = w;
    }
    remove() { this.children.forEach(e => e.remove()); }
    activate(x, y) {
        this.children.forEach(e => e.drawObject.add());
        this.children.forEach(function (e, i) {
            e.x = x;
            e.y = y + i * e.height;
            e.redraw();
        });
    }

    addSubObj(o) { this.children.push(o); }
}