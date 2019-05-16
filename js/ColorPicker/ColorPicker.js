class ColorPicker extends GenericObject {

    /**
     * Get the index of the current Colorpicker
     */
    static get INDEX() {
        if (!ColorPicker.index) {
            ColorPicker.index = 0;
        }

        return ColorPicker.index++;
    }

    /**
     * Create a new color picker.
     * The height of the gradient bar will be equal to this.
     * The width of the gradient bar will be calculated with the formula: (height / 6x)
     * 
     * @param {int} [h] The height of the canvas element 
     * @param {int} [w] The width of the canvas element
     */
    constructor(h = undefined, w = undefined) {
        super();

        this.canvas = new Canvas(w, h, false);
        this.index = this.constructor.INDEX;
        this.dragging = false;
        this.colorChanged = new Event();

        this._createGradients(this.canvas);
        this._createColorpicker();

        //the color picker always starts in the middle
        this.setBackground(this.gradientBar.getRGB());
        this._bindEvents();
    }

    appendTo(querySelector) {
        this._appendTo(querySelector, this._wrapper);
    }

    _createColorpicker() {
        this._wrapper = document.createElement("div");
        this._wrapper.classList.add("wrapper");
        let _canvasWrapper = document.createElement("div");
        _canvasWrapper.classList.add("canvas-wrapper");

        //create the gradient bar and it's indicator
        this.gradientBar = new GradientBar(this.canvas.width / 6 + "px", this.canvas.height + "px");

        //create the bubble, 50% doesn't work for some reason
        this.bubble = new Indicator(this.canvas.height / 2 + "px", this.canvas.width / 2 + "px", "colorpicker-bubble");

        //create a wrapper for both the canvas + bubble and the wrapper + gradient bar
        //add the canvas and bubble to the wrapper
        this.bubble.appendTo(_canvasWrapper);
        this.canvas.appendTo(_canvasWrapper);
        this._wrapper.appendChild(_canvasWrapper);

        //the gradient bar should be right
        this.gradientBar.appendTo(this._wrapper);
    }

    hide() {
        this._wrapper.classList.add("hide");
    }

    show() {
        this._wrapper.classList.remove("hide");
    }

    toggleDisplay() {
        this._wrapper.classList.toggle("hide");
    }

    _createGradients() {
        //left (white) to right (transparent)
        this.whiteGradient = this._createGradient("#fff", "transparent", this.canvas.width, 0);

        //bottom (black) to top (transparent)
        this.blackGradient = this._createGradient("#000", "transparent", 0, this.canvas.height);
    }

    /**
     * 
     * @param {String} startColor The starting color
     * @param {String} endColor The end color
     * @param {int} width The width of the gradient
     * @param {int} height The height of the gradient
     */
    _createGradient(startColor, endColor, width, height) {
        let gradient = this.canvas.ctx.createLinearGradient(0, height, width, 0);
        gradient.addColorStop(0, startColor);
        gradient.addColorStop(1, endColor);

        return gradient;
    }

    _bindEvents() {
        //the way it's setup people still control the bubble even outside the canvas
        //addEventListener allows multiple listeners unlike document.onmousemove
        document.addEventListener("mousemove", (e) => {
            if (this.dragging) {
                this.updateBubblePosition(e);
                this._notifyColorChanged();
            }
        });

        document.addEventListener("mouseup", (e) => {
            this.dragging = false;
        });

        this.canvas.bindEvent(this.canvas.EVENTS.MOUSEDOWN, (e) => {
            this.dragging = (e.buttons == 1);
            //immediately fire the updateBubblePosition event once
            this.updateBubblePosition(e);
            this._notifyColorChanged();
        });

        this.bubble.bindEvent(this.bubble.EVENTS.MOUSEDOWN, (e) => {
            this.dragging = (e.buttons == 1);
        });

        this.gradientBar.colorChanged.add((color) => {
            this.setBackground(color[0]);
            this._notifyColorChanged();
        })
        // this.gradientBarIndicator.bindEvent(this.gradientBarIndicator.EVENTS.MOUSEDOWN, (e) => {

        // })
    }

    /**
     * Notify all subscribers of the colorChanged property
     */
    _notifyColorChanged() {
        this.colorChanged.call(this.getRGB());
    }

    /**
     * Update the color picker's color
     * 
     * @param {String} color The color to change the color picker to
     */
    setBackground(color) {

        //clear the objects
        this.canvas.clearObjects();

        //add the three objects
        this.fillCanvas(color);
        this.fillCanvas(this.whiteGradient);
        this.fillCanvas(this.blackGradient);

        //draw the canvas
        this.canvas.draw();
        //this.fillCanvas(this.whiteGradient);
        //this.fillCanvas(this.blackGradient);

    }

    //fill the entire canvas with a specific style
    fillCanvas(fillStyle) {
        this.canvas.setFillstyle(fillStyle);
        this.canvas.drawSquare(0, 0, this.canvas.height);
    }

    /**
     * Get the RGB value of the current position of the indicator
     *
     * @param {boolean} valueOnly Whether to get just the RGB(r,g,b) value or an array in the format [rgb(), r, g, b]
     */
    getRGB(valueOnly = true) {

        let halfBubbleHeight = this.bubble.halfHeight;
        let halfBubbleWidth = this.bubble.halfWidth;

        let x = parseFloat(this.bubble.left) + halfBubbleWidth
        let y = parseFloat(this.bubble.top) + halfBubbleHeight;

        //get the pixel data
        let pixel = this.canvas.ctx.getImageData(Math.min(this.canvas.width - 1, x), Math.min(this.canvas.height - 1, y), 1, 1).data;
        let r = pixel[0];
        let g = pixel[1];
        let b = pixel[2];
        let rgb = Converters.rgbToArray(r, g, b);

        return (valueOnly ? rgb[0] : rgb);

    }

    updateBubblePosition(e) {

        if (!e) return;

        let canvasBounds = this.canvas.boundingClientRect;
        //calculate the vertical/horizontal centerpoint
        let halfBubbleHeight = this.bubble.halfHeight;
        let halfBubbleWidth = this.bubble.halfWidth;

        //calculate the bubble's position by making the left of the canvas 0, then calculating the amount of pixels the user is from 0
        //clamp the value between -half the bubble and canvas size + half the bubble
        this.bubble.top = MathExtensions.clamp((e.clientY - canvasBounds.top) - halfBubbleHeight, -halfBubbleHeight, this.canvas.height - halfBubbleHeight) + "px";
        this.bubble.left = MathExtensions.clamp((e.clientX - canvasBounds.left) - halfBubbleWidth, -halfBubbleWidth, this.canvas.width - halfBubbleWidth) + "px";
    }





}