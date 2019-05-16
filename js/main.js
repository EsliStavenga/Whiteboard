let prevX = null;
let prevY = null;
let canvas = new Canvas();
let ctx = canvas.canvas.getContext("2d");
canvas.appendTo("body");
canvas.loop();

let c = new ColorPicker(300, 300);
c.appendTo(".colorpicker-wrapper");

c.colorChanged.add((e) => {
    canvas.setFillstyle(e);
})

//TODO beautify this
document.getElementsByClassName("button")[0].onclick = (e) => {
    c.toggleDisplay();
}

canvas.bindEvent(Canvas.EVENTS.MOUSEMOVE, (e) => {
    //if only AND ONLY the left mouse button is clicked
    if (e.buttons == 1) {
        //basically remember the last position of the cursor
        //draw from that position to the current position

        //ctx.globalCompositeOperation = 'destination-out-out';

        if (prevX != null && prevY != null) {
            //canvas.setFillstyle('#' + (Math.random() * 0xFFFFFF << 0).toString(16));
            canvas.drawLine(prevX, prevY, e.pageX, e.pageY);
        }

        prevX = e.pageX;
        prevY = e.pageY;
    }
});

canvas.bindEvent(Canvas.EVENTS.MOUSEUP, (e) => {
    prevX = null;
    prevY = null;
});
