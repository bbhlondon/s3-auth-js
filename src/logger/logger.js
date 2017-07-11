let instance = null;

export default class Logger {
    constructor() {
        if (!instance) {
            instance = this;
        }

        return instance;
    }

    log(message) {
        console.info(message);
    }

    error(message) {
        console.error(message);
    }
}

