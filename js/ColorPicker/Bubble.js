/**
 * You know that little bubble that indicates where the cursor is rn? That's this thingy
 */
class Bubble extends Indicator {

    /**
     * Create a new colorpicker buble
     * 
     * @param {String} x The x position for CSS 
     * @param {String} y The y position for CSS
     */
    constructor(x, y) {
        super(x, y, "colorpicker-bubble");
        this.bindAllEventsToObject(this.indicator);
        //this.top = `calc(${x} - ${this.halfWidth}px)`;
        //this.left = `calc(${y} - ${this.halfHeight}px)`;

    }

    appendTo(querySelector) {
        this._appendTo(querySelector, this.indicator);
    }

}