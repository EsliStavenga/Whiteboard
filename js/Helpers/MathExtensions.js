class MathExtensions {

    /**
     * Clamp an integer/float value
     * 
     * @param {float} val The value to clamp 
     * @param {float} min The lower limit
     * @param {float} max The upper limit
     */
    static clamp(val, min, max) {
        return Math.max(min, Math.min(max, val));
    }

}