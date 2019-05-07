class Segment {

    /**
     * Create a new Line segment
     * 
     * @param {int} xStart The x start position of the line
     * @param {int} xEnd The x end position of the line
     * @param {int} yStart The y start position of the line
     * @param {int} yEnd The y end position of the line
     * @param {int} lineWidth The width of the line
     * @param {String} color The color of the line
     */
    constructor(xStart, xEnd, yStart, yEnd, lineWidth = 3, color = "#000000") {
        this.xStart = xStart;
        this.xEnd = xEnd;
        this.yStart = yStart;
        this.yEnd = yEnd;
        this.lineWidth = lineWidth;
        this.color = color;
    }

    /**
     * Draw a segment
     * 
     * @param {context} ctx The canvas' context to draw in 
     */
    draw(ctx) {
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.color;


        ctx.beginPath();
        ctx.moveTo(this.xStart, this.yStart);
        ctx.lineTo(this.xEnd, this.yEnd);
        ctx.stroke();

    }
}