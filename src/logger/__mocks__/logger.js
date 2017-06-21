let instance = null;

export default class Logger {
    constructor() {
        if (!instance) {
            instance = this;
        }
        return instance;
    }

    log = jest.fn();
    error = jest.fn();
}