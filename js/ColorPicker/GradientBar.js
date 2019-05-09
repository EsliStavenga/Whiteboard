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
                this.y = clamp(e.clientY - this.boundingClientRect.top, 0, parseInt(this.height) - parseInt(this.indicator.height));
                //this.setBackground(this.getRGB(y));
                this.indicator.top = this.y + "px";
                //notify the subscribers the color has changed
                this.colorChanged.call(this.getRGB());
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
     * @param {int} y The y position of the indicator 
     */
    getRGB() {
        //normalize the result and times the x limit (The limit of the x value of the cosine function)
        //I stuck with 6 because it's easiest to calculate since they all match up perfectly there
        let x = ((this.y * colorOffset) / 255) * 6;
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

    appendTo(querySelector) {
        this._appendTo(querySelector, this.gradientBar);
    }

}
