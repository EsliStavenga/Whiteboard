let canvas;
let clickEvents = [];
let dragEvents = [];

window.onresize = () => { setCanvasSize() };

/**
 * Listen for a click event to fire
 * 
 * @param {function} callback The method to call on a click event
 */
function addCanvasClickListener(callback) {
    clickEvents.push(callback);
}

function addCanvasDragListener(callback) {
    dragEvents.push(callback);
}

function fireClickEvent(e) {
    _notifySubscribers(clickEvents, e);
}

function fireMoveEvent(e) {
    _notifySubscribers(dragEvents, e);
}

function _notifySubscribers(event, e) {
    event.forEach((cb) => {
        cb(e);
    })
}

/**
 * Create a new canvas
 * 
 * @param {int} [w] The width of the canvas
 * @param {int} [h] THe height of the canvas
 */
function createCanvas(w, h) {
    //create a new canvas
    canvas = document.createElement("canvas");
    setCanvasSize(w, h);

    //disable right click
    canvas.setAttribute("oncontextmenu", "event.preventDefault()");

    //bind the click event
    canvas.onclick = fireClickEvent;
    canvas.onmousemove = fireMoveEvent;

    //add to the body
    document.getElementsByTagName("body")[0].appendChild(canvas);
}

/**
 * Set the canvas' size
 * 
 * @param {int} [w=window.innerWidth] The width of the canvas
 * @param {int} [h=window.innerHeight] THe height of the canvas
 */
function setCanvasSize(w = window.innerWidth, h = window.innerHeight) {
    canvas.setAttribute("width", w);
    canvas.setAttribute("height", h);
}
