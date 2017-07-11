import {
    ERROR_INPUT_PARAM_REQUIRED,
    ERROR_INPUT_PARAM_STRING,
} from './consts';


/**
 * Returns two-digit string of number
 *
 * @export
 * @returns {string}
 */
export function pad(number) {
    if (number === undefined) throw Error(ERROR_INPUT_PARAM_REQUIRED);

    if (number < 10) {
        return '0' + number;
    }
    return number;
}

/**
 * Lowercase base 16 encoding.
 * from https://stackoverflow.com/a/21648161
 *
 * @export
 * @returns {string}
 */
export function hex(input) {
    if (input === undefined) throw Error(ERROR_INPUT_PARAM_REQUIRED);
    if (typeof input !== 'string') throw Error(ERROR_INPUT_PARAM_STRING);

    let hexVal;
    let i;
    let result = '';
    for (i = 0; i < input.length; i += 1) {
        hexVal = input.charCodeAt(i).toString(16);
        result += pad(hexVal);
    }

    return result;
}