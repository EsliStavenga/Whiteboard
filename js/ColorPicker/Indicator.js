class Indicator extends GenericObject {

    set left(val) {
        this._left = val;
        this._setLeft();
    }

    get left() {
        return this._left;
    }

    set top(val) {
        this._top = val;
        this._setTop();
    }

    get top() {
        return this._top;
    }

    get height() {
        return this.indicator.offsetHeight;
    }

    get halfHeight() {
        return this.height / 2;
    }

    get width() {
        return this.indicator.offsetWidth;
    }

    get halfWidth() {
        return this.width / 2;
    }

    constructor(x, y, _class) {
        super();

        this.indicator = document.createElement("div");
        this.indicator.classList.add(_class);

        this.bindAllEventsToObject(this.indicator);
        this.left = x;
        this.top = y;
    }

    appendTo(querySelector) {
        this._appendTo(querySelector, this.indicator);
    }

    _setLeft() {
        this.indicator.style.left = this._left;
    }

    _setTop() {
        this.indicator.style.top = this._top;
    }
}