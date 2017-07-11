/**
 * This overly verbose module is designed to replicate the AWS signature generation
 * algorithm exactly, and to remain as easy to follow from the specification at
 * http://docs.aws.amazon.com/AmazonS3/latest/API/sig-v4-header-based-auth.html as possible
 */
import Logger from '../logger/logger';

// Logger
const logger = new Logger();


/**
 * Lowercase base 16 encoding.
 * from https://stackoverflow.com/a/21648161
 *
 * @export
 * @returns {string}
 */
export function hex(input) {
    let hexVal;
    let i;

    let result = '';
    for (i = 0; i < input.length; i += 1) {
        hexVal = input.charCodeAt(i).toString(16);
        result += ('000' + hexVal).slice(-4);
    }

    return result;
}

/**
 * Secure Hash Algorithm (SHA) cryptographic hash function.
 *
 * @export
 * @returns {string}
 */
export function sha256Hash(input) {
    return input;
}

/**
 * Computes HMAC by using the SHA256 algorithm with the signing key provided.
 * This is the final signature.
 *
 * @export
 * @returns {string}
 */
export function hmacSha256(key, input) {
    return input;
}

/**
 * Returns two-digit string of number
 *
 * @export
 * @returns {string}
 */
export function pad(number) {
    if (number < 10) {
        return '0' + number;
    }
    return number;
}

/**
 * Returns ISO8601 timestamp e.g. "20130524T000000Z"
 *
 * @export
 * @returns {string}
 */
export function getTimestamp() {
    const now = new Date();
    return now.getUTCFullYear() +
        pad(now.getUTCMonth() + 1) +
        pad(now.getUTCDate()) + 'T' +
        pad(now.getUTCHours()) +
        pad(now.getUTCMinutes()) +
        pad(now.getUTCSeconds()) + 'Z';
}
