import {
    ERROR_PARAM_REQUIRED,
    ERROR_PARAM_TYPE_IS_NOT_STRING,
    ERROR_PARAM_TYPE_IS_NOT_BOOLEAN,
    ERROR_PARAM_TYPE_IS_NOT_OBJECT,
} from './consts';
import {
    pad,
    hex,
} from './utils';
// import {
//     sha256Hash,
//     hmacSha256,
// } from './hash';

/**
 * Returns ISO8601 timestamp e.g. "20130524T000000Z"
 *
 * @export
 * @returns {string}
 */
export function getAWSTimestamp() {
    const now = new Date();
    return `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}T${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}Z`;
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
    if (input === undefined) throw Error(ERROR_PARAM_REQUIRED);
    if (encodeSlash === undefined) throw Error(ERROR_PARAM_REQUIRED);
    if (typeof input !== 'string') throw Error(ERROR_PARAM_TYPE_IS_NOT_STRING);
    if (typeof encodeSlash !== 'boolean') throw Error(ERROR_PARAM_TYPE_IS_NOT_BOOLEAN);

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
            result += `%${hex(ch).toUpperCase()}`;
        }
    }
    return result;
}

/**
 * URI encode each parameter from a URL.searchParams object, returning a modified object
 *
 * @export
 * @returns {object}
 */
export function encodeQueryStringParameters(params) {
    if (params === undefined) throw Error(ERROR_PARAM_REQUIRED);
    if (typeof input !== 'object') throw Error(ERROR_PARAM_TYPE_IS_NOT_OBJECT);

    Object.keys(params).forEach((key) => {
        params.set(AWSURIEncode(key), AWSURIEncode(params[key]));
        params.delete(key);
    });

    return params;
}
