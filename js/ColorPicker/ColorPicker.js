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
     * @param {int} [x] The x position of the canvas element
     * @param {int} [y] The y position of the canvas element
     */
    constructor(h = undefined, w = undefined, x = 0, y = 0) {
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
        document.onmousemove = (e) => {
            if (this.dragging) {
                this.updateBubblePosition(e);
                this._notifyColorChanged();
            }
        }

        document.onmouseup = (e) => {
            this.dragging = false;
        }

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
            this.setBackground(color);
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
        this.canvas.drawSquare(0, 0, 300);
    }

    /*
    getRGB(y) {
        //normalize the result and times the x limit (The limit of the x value of the cosine function)
        //I stuck with 6 because it's easiest to calculate since they all match up perfectly there
        let x = ((y * colorOffset) / 255) * 6;
        let leftHalfOfEquation = .75 * (.66666 * Math.PI * x);
        let blueCosine = this.calculateCosine(leftHalfOfEquation, 2);
        let greenCosine = this.calculateCosine(leftHalfOfEquation);
    
        //calculate the sine for blue and green
        let blue = (x < 2 ? 0 : blueCosine);
        let green = (x > 4 ? 0 : greenCosine);
        let red = 0;
    
        //red has the sine of blue until 2, between 2 and 4 nothing, then it has the sine of green
        //as illustrated in my beautiful picture (/img/rgb.psd)
    
        //turn red off unless this if is true
        if (x < 2) {
            red = blueCosine;
        } else if (x > 4) {
            red = greenCosine;
        }
    
    
        //cap the result between 0 and 1
        red = Math.min(red, 1);
        green = Math.min(green, 1);
        blue = Math.min(blue, 1);
    
        //multiple the value by the limit of RGB (255)
        return `rgb(${red * 255}, ${green * 255}, ${blue * 255})`;
    }
    
    calculateCosine(leftHalf, piMultiply = 1) {
        return 2 * Math.cos(leftHalf + piMultiply * Math.PI) + 2;
    } */

    /**
     * Get the RGB value under the current bubble
     * 
     * @returns {array} An array. The first value being the RGB value, then follow the RGB values seperately
     */
    getRGB() {

        let halfBubbleHeight = this.bubble.halfHeight;
        let halfBubbleWidth = this.bubble.halfWidth;

        let x = parseFloat(this.bubble.left) + halfBubbleWidth
        let y = parseFloat(this.bubble.top) + halfBubbleHeight;

        //get the pixel data
        let pixel = this.canvas.ctx.getImageData(Math.min(this.canvas.width - 1, x), Math.min(this.canvas.height - 1, y), 1, 1).data;
        let r = pixel[0];
        let g = pixel[1];
        let b = pixel[2];
        return [`rgb(${r}, ${g}, ${b})`, r, g, b];

    }

    updateBubblePosition(e) {

        if (!e) return;

        let canvasBounds = this.canvas.boundingClientRect;
        //calculate the vertical/horizontal centerpoint
        let halfBubbleHeight = this.bubble.halfHeight;
        let halfBubbleWidth = this.bubble.halfWidth;

        //calculate the bubble's position by making the left of the canvas 0, then calculating the amount of pixels the user is from 0
        //clamp the value between -half the bubble and canvas size + half the bubble
        this.bubble.top = clamp((e.clientY - canvasBounds.top) - halfBubbleHeight, -halfBubbleHeight, this.canvas.height - halfBubbleHeight) + "px"; //Math.max(-bubble.offsetHeight / 2, Math.min((e.clientY - canvasBounds.top), 300 - bubble.offsetHeight / 2)) + "px";
        this.bubble.left = clamp((e.clientX - canvasBounds.left) - halfBubbleWidth, -halfBubbleWidth, this.canvas.width - halfBubbleWidth) + "px"; //Math.max(-bubble.offsetWidth / 2, Math.min(e.clientX - canvasBounds.left, 300 - bubble.offsetWidth / 2)) + "px";



        //parse the float and compensate for the earlier calculated offset
        //let x = parseFloat(this.bubble.style.left) + halfBubbleWidth
        //let y = parseFloat(this.bubble.style.top) + halfBubbleHeight;

        //get the pixel data
        //let pixel = this.canvas.ctx.getImageData(Math.min(this.canvas.width - 1, x), Math.min(this.canvas.height - 1, y), 1, 1).data;
        //body.style.background = (`rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`);

    }





}