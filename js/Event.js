class Event {

    constructor() {
        this.events = [];
    }

    add(callback) {
        this.events.push(callback);
    }

    call(e) {
        this.events.forEach((event) => {
            event(e);
        })
    }

}