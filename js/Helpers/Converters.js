class Converters {

    /**
     * Convert r, g or b to hex, apply padding where necessary
     * 
     * @param {*} c The value to convert to hex
     * @private
     */
    static componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    /**
     * Convert RGB values to hex
     * 
     * @param {int} r The red value 
     * @param {int} g The green value
     * @param {int} b The blue value
     */
    static rgbToHex(r, g, b) {
        return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
    }

    static rgbToArray(r, g, b) {
        return [`rgb(${r}, ${g}, ${b})`, r, g, b];
    }

}