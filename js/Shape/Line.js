class Line {

    /**
     * Create a new Line
     */
    constructor() {
        this._segments = [];
    }

    containsSegments() {
        return (this._segments.length > 0);
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
        return JSON.parse(JSON.stringify(this));
    }
}