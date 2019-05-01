class Canvas {

    /**
     * JavaScript's idea of an ENUM
     */
    static get EVENTS() {
        return {
            MOUSEUP: 1,
            MOUSEMOVE: 2,
            CLICK: 3
        }
    }

    static get SEGMENT_TYPES() {
        return {
            LINE: 1,
            CIRCLE: 2
        }
    }

    /**
     * Create a new canvas/Whiteboard
     * 
     * @param {int} [w=window.innerWidth] The width of the canvas. 
     * @param {int} [h=window.innerHeight] The height of the canvas.
     * @param {bool} [enableResize=true] Whether to resize the canvas whenever the window resizes.
     */
    constructor(w = window.innerWidth, h = window.innerHeight, enableResize = true) {
        //create a new canvas and create some events
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.clickEvent = new Event();
        this.mouseMoveEvent = new Event();
        this.mouseUpEvent = new Event();
        this._objects = [];
        this._currentObject = [];

        //else this will be broken sadly
        this.canvas.onclick = (e) => { this._handleEvent(e); }; //this.fireClick;
        this.canvas.onmousemove = (e) => { this._handleEvent(e); };//this.fireMove;
        this.canvas.onmouseup = (e) => { this._handleEvent(e); };//this.fireMove;

        //every drawn object will be saved as a different object.
        //the different segments from the line will be bundled together into one object
        this.bindEvent(this.constructor.EVENTS.MOUSEUP, (e) => { this._saveObject(); });

        //set the canvas size and add it to the body
        this._setCanvasSize(w, h);
        document.getElementsByTagName("body")[0].appendChild(this.canvas);

        //if the user wants to resize the canvas on window resize
        if (enableResize) {
            window.onresize = (e) => {
                this._setCanvasSize();
            }
        }

        this.requestAnimationFrame();
    }

    requestAnimationFrame() {
        window.requestAnimationFrame((e) => { this._draw(); });
    }

    _draw(ms) {

        //clear the canvas
        ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        //draw all stored objects
        //without this the lines look jagged
        //but with this the eraser won't work
        //we could do it the disgusting way and make the eraser white

        this._objects.forEach((object) => {

            this.drawObject(object);

        });

        //draw the object currently being drawn
        this.drawObject(this._currentObject);
        this.requestAnimationFrame();
    }

    drawObject(object) {
        //draw all the segments
        object.forEach((segment) => {
            let prevLineWidth = this.ctx.lineWidth;
            let prevStrokeStyle = this.ctx.strokeStyle;

            segment.draw(this.ctx);

            this.ctx.lineWidth = prevLineWidth;
            this.ctx.strokeStyle = prevStrokeStyle;
        });
    }

    /**
     * Add the object currently being drawn to the saved objects
     */
    _saveObject() {
        this._objects.push(this._currentObject);
        this._currentObject = [];
    }

    /**
     * Draw a line
     * 
     * @param {int} x1 The x start position of the line 
     * @param {int} y1 The y start position of the line
     * @param {int} x2 The x end position of the line
     * @param {int} y2 The y end position of the line
     * @param {int} [lineWidth=3] The width of the line
     * @param {String} [color="#000000"] The color of the line
     */
    drawLine(x1, y1, x2, y2, lineWidth = 3, color = "#000000") {

        this._currentObject.push(new Segment(
            x1,
            x2,
            y1,
            y2,
            lineWidth,
            color
        ));
    }

    /**
     * Handle all events
     * 
     * @param {event} e The event. 
     */
    _handleEvent(e) {
        switch (e.type) {
            case "click":
                this.clickEvent.call(e);
                break;
            case "mousemove":
                this.mouseMoveEvent.call(e);
                break;
            case "mouseup":
                this.mouseUpEvent.call(e);
                break;
            default:
                break;
        }
    }

    /**
     * Bind an event to a method. Every event can have multiple binds.
     * 
     * @param {int} event The event number, use the static getters e.g. MOUSEMOVE and CLICK. 
     * @param {function} callback The function to call.
     */
    bindEvent(event, callback) {
        let events = this.constructor.EVENTS;
        switch (event) {
            case events.CLICK:
                this.clickEvent.add(callback);
                break;
            case events.MOUSEMOVE:
                this.mouseMoveEvent.add(callback);
                break;
            case events.MOUSEUP:
                this.mouseUpEvent.add(callback);
                break;
            default:
                break;
        }
    }

    /**
     * Set the canvas' size.
     * 
     * @param {int} w 
     * @param {int} h 
     */
    _setCanvasSize(w = window.innerWidth, h = window.innerHeight) {
        this.canvas.setAttribute("width", w);
        this.canvas.setAttribute("height", h);
    }

}