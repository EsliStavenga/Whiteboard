class Segment {

    constructor(xStart, xEnd, yStart, yEnd, lineWidth = 3, color = "#000000") {
        this.xStart = xStart;
        this.xEnd = xEnd;
        this.yStart = yStart;
        this.yEnd = yEnd;
        this.lineWidth = lineWidth;
        this.color = color;
    }

    draw(ctx) {
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.color;


        ctx.beginPath();
        ctx.moveTo(this.xStart, this.yStart);
        ctx.lineTo(this.xEnd, this.yEnd);
        ctx.stroke();

    }
}