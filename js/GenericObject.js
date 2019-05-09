class GenericObject {

    /**
     * JavaScript's idea of an ENUM
     */
    static get EVENTS() {
        return {
            MOUSEUP: 1,
            MOUSEMOVE: 2,
            CLICK: 3,
            MOUSEDOWN: 4
        }
    }

    get EVENTS() {
        return this.constructor.EVENTS;
    }

    constructor() {
        this.clickEvent = new Event();
        this.mouseMoveEvent = new Event();
        this.mouseUpEvent = new Event();
        this.mouseDownEvent = new Event();
    }

    /**
     * Add the object to a specific element
     * 
     * @param {String/Object} querySelector The queryselector
     * @param {Object} obj The object to append
     */
    _appendTo(querySelector, obj) {
        let elem = querySelector;

        if (typeof (querySelector) != "object") {
            elem = document.querySelector(querySelector);
        }

        elem.appendChild(obj);

    }

    /**
     * Bind all defined events to an object
     * TODO don't forget this one!
     * 
     * @param {Object} obj The object to listen for
     */
    bindAllEventsToObject(obj) {
        obj.onclick = (e) => { this._handleEvent(e); }; //this.fireClick;
        obj.onmousemove = (e) => { this._handleEvent(e); };//this.fireMove;
        obj.onmouseup = (e) => { this._handleEvent(e); };//this.fireMove;
        obj.onmousedown = (e) => { this._handleEvent(e); };//this.fireMove;
    }

    /**
     * Bind a callback function to an event
     * 
     * @param {EVENTS} event The event to bind a callback to 
     * @param {function} callback The callback function
     */
    bindEvent(event, callback) {
        let events = this.constructor.EVENTS;
        switch (event) {
            case events.CLICK:
                this.clickEvent.add(callback);
                break;
            case events.MOUSEMOVE:
                this.mouseMoveEvent.add(callback);
                break;
            case events.MOUSEUP:
                this.mouseUpEvent.add(callback);
                break;
            case events.MOUSEDOWN:
                this.mouseDownEvent.add(callback);
                break;
            default:
                break;
        }
    }

    /**
     * Call all callback functions of an event
     * 
     * @param {EventArgs} e The event args.
     */
    _handleEvent(e) {
        switch (e.type) {
            case "click":
                this.clickEvent.call(e);
                break;
            case "mousemove":
                this.mouseMoveEvent.call(e);
                break;
            case "mouseup":
                this.mouseUpEvent.call(e);
                break;
            case "mousedown":
                this.mouseDownEvent.call(e);
                break;
            default:
                break;
        }
    }
}