/**
 * This overly verbose module is designed to replicate the AWS signature generation
 * algorithm exactly, and to remain as easy to follow from the specification at
 * http://docs.aws.amazon.com/AmazonS3/latest/API/sig-v4-header-based-auth.html as possible
 */

import {
    ERROR_INPUT_PARAM_REQUIRED,
    ERROR_INPUT_PARAM_STRING,
    ERROR_INPUT_PARAM_BOOLEAN,
} from './consts';
import {
    pad,
    hex,
} from './utils';
import {
    sha256Hash,
    hmacSha256,
} from './hash';

/**
 * Returns ISO8601 timestamp e.g. "20130524T000000Z"
 *
 * @export
 * @returns {string}
 */
export function getAWSTimestamp() {
    const now = new Date();
    return now.getUTCFullYear() +
        pad(now.getUTCMonth() + 1) +
        pad(now.getUTCDate()) + 'T' +
        pad(now.getUTCHours()) +
        pad(now.getUTCMinutes()) +
        pad(now.getUTCSeconds()) + 'Z';
}

/**
 * URI encode every byte. UriEncode() must enforce the following rules:
 *
 * - URI encode every byte except the unreserved characters:
 *   'A'-'Z', 'a'-'z', '0'-'9', '-', '.', '_', and '~'.
 * - The space character is a reserved character and must be encoded as "%20" (and not as "+").
 * - Each URI encoded byte is formed by a '%' and the two-digit hexadecimal value of the byte.
 * - Letters in the hexadecimal value must be uppercase, for example "%1A".
 * - Encode the forward slash character, '/', everywhere except in the object key name.
 * For example, if the object key name is photos/Jan/sample.jpg, the forward slash in the
 *   key name is not encoded.
 *
 * @export
 * @returns {string}
 */
export function AWSURIEncode(input, encodeSlash) {
    if (input === undefined) throw Error(ERROR_INPUT_PARAM_REQUIRED);
    if (encodeSlash === undefined) throw Error(ERROR_INPUT_PARAM_REQUIRED);
    if (typeof input !== 'string') throw Error(ERROR_INPUT_PARAM_STRING);
    if (typeof encodeSlash !== 'boolean') throw Error(ERROR_INPUT_PARAM_BOOLEAN);

    let ch;
    let i;
    let result = '';
    for (i = 0; i < input.length; i += 1) {
        ch = input[i];
        if ((ch >= 'A' && ch <= 'Z') || (ch >= 'a' && ch <= 'z') || (ch >= '0' && ch <= '9') || ch === '_' || ch === '-' || ch === '~' || ch === '.') {
            result += ch;
        } else if (ch === ' ') {
            result += '%20';
        } else if (ch === '/') {
            result += encodeSlash ? '%2F' : ch;
        } else {
            result += '%' + hex(ch).toUpperCase();
        }
    }
    return result;
}
