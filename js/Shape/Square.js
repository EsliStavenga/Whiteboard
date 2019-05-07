class Square extends Shape {

    /**
     * 
     * @param {int} x The x position of the square
     * @param {int} y The y position of the square
     * @param {int} size The size of each side of the square
     * @param {String} fillStyle The square's color
     */
    constructor(x, y, size, fillStyle) {
        super(x, y);
        this.points = [];
        this.calculateLines(x, y, size);
        this.fillStyle = fillStyle;
    }

    draw(ctx) {

        //ctx.strokeStyle = this.fillStyle;
        ctx.fillStyle = this.fillStyle;

        ctx.beginPath();
        this.points.forEach((seg, i) => {
            if (i == 0) {
                ctx.moveTo(seg.xStart, seg.yStart);
            } else {
                ctx.lineTo(seg.xStart, seg.yStart);
            }

            // seg.draw(ctx);
        })

        ctx.closePath();
        ctx.fill();
    }

    calculateLines(x, y, size) {

        this.points.push(new Segment(
            x, //- size,
            x + size,
            y, //- size,
            y //- size
        ));
        this.points.push(new Segment(
            x + size,
            x + size,
            y, //- size,
            y + size
        ));
        this.points.push(new Segment(
            x + size,
            x, // - size,
            y + size,
            y + size
        ));
        this.points.push(new Segment(
            x,//- size,
            x,// - size,
            y + size,
            y// - size
        ));
    }

}