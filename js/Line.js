class Line {

    /**
     * Create a new Line
     */
    constructor() {
        this._segments = [];
    }

    draw(ctx) {
        this._segments.forEach((segment) => {
            segment.draw(ctx);
        })
    }

    /**
     *Add a new segment to the line
     */
    add(segment) {
        this._segments.push(segment);
    }

    /**
     * Clone the line
     */
    clone() {
        return this._segments;
    }
}