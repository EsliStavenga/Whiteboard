class Canvas extends GenericObject {
    static get SEGMENT_TYPES() {
        return {
            LINE: 1,
            CIRCLE: 2
        }
    }

    get width() {
        return this.canvas.width;
    }

    get height() {
        return this.canvas.height;
    }

    get boundingClientRect() {
        return this.canvas.getBoundingClientRect();
    }

    /**
     * Create a new canvas/Whiteboard
     * 
     * @param {int} [w=window.innerWidth] The width of the canvas. 
     * @param {int} [h=window.innerHeight] The height of the canvas.
     * @param {bool} [enableResize=true] Whether to resize the canvas whenever the window resizes.
     */
    constructor(w = window.innerWidth, h = window.innerHeight) {
        super();

        //create a new canvas and create some events
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        this._objects = [];
        this._currentObject = new Line();
        this.loopEnabled = false;
        this.fillStyle = "#000000";

        //else this will be broken sadly
        this.bindAllEventsToObject(this.canvas);

        //every drawn object will be saved as a different object.
        //the different segments from the line will be bundled together into one object
        this.bindEvent(this.constructor.EVENTS.MOUSEUP, (e) => { this._saveObject(); });

        //set the canvas size and add it to the body
        this._setCanvasSize(w, h);
    }

    /**
     * Add the object to a specific element
     *
     * @param {String/Object} querySelector The queryselector
     */
    appendTo(querySelector) {
        this._appendTo(querySelector, this.canvas);
    }

    /**
     * Set the next drawing fillStyle
     * 
     * @param {String} fillStyle The CSS color to set draw the next object in
     */
    setFillstyle(fillStyle = "#000000") {
        this.fillStyle = fillStyle;
    }

    /**
     * Enable the canvas to resize on every screen resize
     * 
     * @param {int} [w=window.innerWidth] The width of the canvas.
     * @param {int} [h=window.innerHeight] The height of the canvas.
     */
    enableResize(w = window.innerWidth, h = window.innerHeight) {
        window.onresize = (e) => {
            this._setCanvasSize(w, h);
        }
    }

    /**
     * Enable the requestAnimationFrame function stuff
     * 
     */
    loop() {
        this.loopEnabled = true;
        this._requestAnimationFrame();
    }

    /**
     * Request the next animation frame and then draw
     * @private
     */
    _requestAnimationFrame() {
        window.requestAnimationFrame((e) => { this.draw(); });
    }

    /**
     * Draw all the saved lines
     * @param {float} [ms] The ms the script has been running
     */
    draw(ms) {

        //clear the canvas
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        //draw all stored objects
        //without this the lines look jagged
        //but with this the eraser won't work
        //we could do it the disgusting way and make the eraser white


        this._objects.forEach((object) => {

            let prevLineWidth = this.ctx.lineWidth;
            let prevStrokeStyle = this.ctx.strokeStyle;

            object.draw(this.ctx);
            //this._drawObject(object);

            this.ctx.lineWidth = prevLineWidth;
            this.ctx.strokeStyle = prevStrokeStyle;
        });

        //draw the object currently being drawn
        this._currentObject.draw(this.ctx);
        //this._drawObject(this._currentObject);

        if (this.loopEnabled) {
            this._requestAnimationFrame();
        }
    }

    /**
     * Draw a line's segments
     * @param {Line} object The line to draw
     * @orivate
     */
    _drawObject(object) {
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
     * @private
     */
    _saveObject() {
        if (!this._currentObject.containsSegments()) return;

        this._objects.push(this._currentObject);
        this._currentObject = new Line();
    }

    /**
     * Draw a line
     * 
     * @param {int} x1 The x start position of the line 
     * @param {int} y1 The y start position of the line
     * @param {int} x2 The x end position of the line
     * @param {int} y2 The y end position of the line
     * @param {int} [lineWidth=3] The width of the line
     */
    drawLine(x1, y1, x2, y2, lineWidth = 3) {

        this._currentObject.add(new Segment(
            x1,
            x2,
            y1,
            y2,
            lineWidth,
            this.fillStyle
        ));
    }

    /**
     * Draw a square, drawn from the top left
     * 
     * @param {int} [x=0] The X coordinate of the square
     * @param {int} [y=0] The Y coordinate of the square
     * @param {int} size The size of the square in px
     */
    drawSquare(x = 0, y = 0, size) {
        this._objects.push(new Square(x, y, size, this.fillStyle));
    }

    /**
     * Remove all objects from the canvas
     */
    clearObjects() {
        this._objects = [];
        this._currentObject = new Line();
    }

    /**
     * Set the canvas' size.
     * 
     * @param {int} w 
     * @param {int} h 
     * @private
     */
    _setCanvasSize(w = window.innerWidth, h = window.innerHeight) {
        this.canvas.setAttribute("width", w);
        this.canvas.setAttribute("height", h);
    }

}