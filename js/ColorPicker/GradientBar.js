class GradientBar extends GenericObject {

    get height() {
        return this.h;
    }

    get width() {
        return this.w;
    }

    get boundingClientRect() {
        return this.gradientBar.getBoundingClientRect();
    }

    get indicatorTop() {
        return this.indicator.top;
    }

    constructor(w, h) {
        super();

        this.w = w;
        this.h = h;
        this.colorOffset = (255 / 300);
        this.createGradientBar();
        this.createIndicator();
        this.bindAllEventsToObject(this.gradientBar);
        this.bindDragEvent(this);
        this.bindDragEvent(this.indicator);

        this.colorChanged = new Event();
    }

    bindDragEvent(elem) {
        elem.bindEvent(elem.EVENTS.MOUSEMOVE, (e) => {
            if (e.buttons == 1) {
                //firefox still uses layerY, the new browsers switched to offsetY
                this.y = MathExtensions.clamp(e.clientY - this.boundingClientRect.top, 0, parseInt(this.height) - parseInt(this.indicator.height));
                //this.setBackground(this.getRGB(y));
                this.indicator.top = this.y + "px";
                //notify the subscribers the color has changed
                this.colorChanged.call(this.getRGB(false));
            }
        })
    }

    /**
     * Creates the actual gradient bar
     * @private
     */
    createGradientBar() {
        this.gradientBar = document.createElement("div");
        this.gradientBar.classList.add("gradient-bar");

        this.gradientBar.style.height = this.h;
        this.gradientBar.style.width = this.w;
    }

    /**
     * Creates the gradient bar's indicator
     * @private
     */
    createIndicator() {
        this.y = parseInt(this.height) / 2;
        this.indicator = new Indicator(0, this.y + "px", "gradientbar-indicator");
        this.indicator.appendTo(this.gradientBar);
    }

    /**
     * Get the RGB value of the current position of the indicator
     * 
     * @param {boolean} valueOnly Whether to get just the RGB(r,g,b) value or an array in the format [rgb(), r, g, b] 
     */
    getRGB(valueOnly = true) {
        //normalize the result and times the x limit (The limit of the x value of the cosine function)
        //I stuck with 6 because it's easiest to calculate since they all match up perfectly there

        //basicallly we expect the next full (255) color every 50 units
        //by dividing the result of the offset by the height / 300 (6 *  50) we normalize the result
        //Thus a gradientbar of 10 pixels high would work the same as one 1m pixels high
        let x = (((this.y * this.colorOffset) / 255) / (parseInt(this.height) / 300)) * 6;
        let leftHalfOfEquation = .75 * (.66666 * Math.PI * x);
        let blueCosine = this.calculateCosine(leftHalfOfEquation, 2);
        let greenCosine = this.calculateCosine(leftHalfOfEquation);

        //calculate the sine for blue and green
        let blue = (x < 2 ? 0 : blueCosine);
        let green = (x > 4 ? 0 : greenCosine);
        let red = 0;

        //red has the sine of blue until 2, between 2 and 4 nothing, then it has the sine of green
        //as illustrated in my beautiful picture (/img/rgb.psd)

        //turn red off unless this x < 2 or x > 4
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
        let rgb = Converters.rgbToArray(red * 255, green * 255, blue * 255);

        return (valueOnly ? rgb[0] : rgb);
    }

    calculateCosine(leftHalf, piMultiply = 1) {
        return 2 * Math.cos(leftHalf + piMultiply * Math.PI) + 2;
    }

    appendTo(querySelector) {
        this._appendTo(querySelector, this.gradientBar);
    }

}
