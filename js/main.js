let prevX = null;
let prevY = null;
let canvas = new Canvas();
let ctx = canvas.canvas.getContext("2d");


canvas.bindEvent(Canvas.EVENTS.MOUSEMOVE, (e) => {
    //if only AND ONLY the left mouse button is clicked
    if (e.buttons == 1) {

        //basically remember the last position of the cursor
        //draw from that position to the current position
        if (prevX != null && prevY != null) {
            canvas.drawLine(prevX, prevY, e.pageX, e.pageY, undefined, '#' + (Math.random() * 0xFFFFFF << 0).toString(16));
        }

        prevX = e.pageX;
        prevY = e.pageY;
    }
});

canvas.bindEvent(Canvas.EVENTS.MOUSEUP, (e) => {
    prevX = null;
    prevY = null;
});
