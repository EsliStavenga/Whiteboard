class ColorPicker {

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
        this.canvas = new Canvas(w, h, false);
        this.index = this.constructor.INDEX;
        this.dragging = false;

        this._createGradients(this.canvas);
        this._createColorpicker();

        //the color picker always starts in the middle
        this.setBackground(this.getRGB(h / 2));
        this._bindEvents();
    }

    appendTo(querySelector = "body") {
        //FIXME perhaps
        if (typeof (querySelector) == "object") {
            querySelector.appendChild(this._canvasWrapper);
        } else {
            document.querySelector(querySelector).appendChild(this._canvasWrapper);
        }
    }

    _createColorpicker() {
        this._canvasWrapper = document.createElement("div");
        this._canvasWrapper.classList.add("canvas-wrapper");

        //create the bubble
        this.bubble = document.createElement("div");
        this.bubble.classList.add("color-bubble");

        //add the canvas and bubble to the wrapper
        this._canvasWrapper.appendChild(this.bubble);
        this.canvas.appendTo(this._canvasWrapper);
    }

    _createGradients() {
        //left (white) to right (transparent)
        this.whiteGradient = this.canvas.ctx.createLinearGradient(0, 0, this.canvas.width, 0);
        this.whiteGradient.addColorStop(0, "#fff");
        this.whiteGradient.addColorStop(1, "transparent");

        //bottom (black) to top (transparent)
        this.blackGradient = this.canvas.ctx.createLinearGradient(0, this.canvas.height, 0, 0);
        this.blackGradient.addColorStop(0, "#000");
        this.blackGradient.addColorStop(1, "transparent");

    }

    _bindEvents() {
        //the way it's setup people still control the bubble even outside the canvas
        document.onmousemove = (e) => {
            if (this.dragging) {
                this.colorChanged(e);
            }
        }

        document.onmouseup = (e) => {
            this.dragging = false;
        }

        this.canvas.bindEvent(this.canvas.EVENTS.MOUSEDOWN, (e) => {
            this.dragging = (e.buttons == 1);
            //immediately finre the colorChanged event once
            this.colorChanged(e);
        });

        this.bubble.onmousedown = (e) => {
            this.dragging = (e.buttons == 1);
        };
    }

    setBackground(color) {
        //clear canvas
        //this.fillCanvas("#000");

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
    }

    colorChanged(e) {
        //calculate the vertical/horizontal centerpoint
        let halfBubbleHeight = this.bubble.offsetHeight / 2;
        let halfBubbleWidth = this.bubble.offsetWidth / 2;

        if (e) {
            //calculate the bubble's position by making the left of the canvas 0, then calculating the amount of pixels the user is from 0
            //clamp the value between -half the bubble and canvas size + half the bubble
            this.bubble.style.top = clamp((e.clientY - canvasBounds.top) - halfBubbleHeight, -halfBubbleHeight, 300 - halfBubbleHeight) + "px"; //Math.max(-bubble.offsetHeight / 2, Math.min((e.clientY - canvasBounds.top), 300 - bubble.offsetHeight / 2)) + "px";
            this.bubble.style.left = clamp((e.clientX - canvasBounds.left) - halfBubbleWidth, -halfBubbleWidth, 300 - halfBubbleWidth) + "px"; //Math.max(-bubble.offsetWidth / 2, Math.min(e.clientX - canvasBounds.left, 300 - bubble.offsetWidth / 2)) + "px";

        }

        //parse the float and compensate for the earlier calculated offset
        let x = parseFloat(this.bubble.style.left) + halfBubbleWidth
        let y = parseFloat(this.bubble.style.top) + halfBubbleHeight;

        //get the pixel data
        let pixel = this.canvas.ctx.getImageData(Math.min(299, x), Math.min(299, y), 1, 1).data;
        body.style.background = (`rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`);

    }





}