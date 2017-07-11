/* eslint no-console: ["error", { allow: ["warn", "error","info"] }] */
import canLog from './_index';

export default class Logger {
    static log(message) {
        if (canLog()) console.info(message);
    }

    static error(message) {
        if (canLog()) console.error(message);
    }
}

