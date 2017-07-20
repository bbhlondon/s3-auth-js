/* eslint-disable no-restricted-syntax */
import sha256 from 'crypto-js/sha256';
import hmacSHA256 from 'crypto-js/hmac-sha256';
import {
    ERROR_PARAM_REQUIRED,
    ERROR_PARAM_TYPE_IS_NOT_STRING,
    ERROR_PARAM_TYPE_IS_NOT_BOOLEAN,
    ERROR_PARAM_TYPE_IS_NOT_OBJECT,
    ERROR_PARAM_TYPE_IS_NOT_ARRAY,
    ERROR_REQUIRED_HEADER_NOT_FOUND,
    ERROR_PROPERTY_NOT_FOUND,
    ERROR_UNSUPPORTED_HTTP_VERB,
    AWS_REGION,
} from '../consts';
import {
    pad,
    hex,
} from './utils';


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
 * URI encode each parameter from a URL.searchParams object, returning a formatted querystring
 *
 * @export
 * @returns {string}
 */
export function encodeQueryStringParameters(params) {
    if (params === undefined) throw Error(ERROR_PARAM_REQUIRED);
    if (typeof params !== 'object') throw Error(ERROR_PARAM_TYPE_IS_NOT_OBJECT);
    if (!('set' in params)) throw Error(ERROR_PROPERTY_NOT_FOUND);
    if (!('delete' in params)) throw Error(ERROR_PROPERTY_NOT_FOUND);

    const output = [];
    for (const p of params) {
        output.push({
            name: exports.AWSURIEncode(p[0]),
            value: exports.AWSURIEncode(p[1]),
        });
    }

    // sort the headers alphabetically by header name
    output.sort((a, b) => {
        if (a.name < b.name) {
            return -1;
        }
        if (a.name > b.name) {
            return 1;
        }
        return 0;
    });

    let result = '';
    output.forEach((x) => { result += `&${x.name}=${x.value}`; });

    return result.slice(1);
}

/**
 * returns the Text BODY of the requrest, resolving promised if need be
 *
 * @export
 * @returns {string}
 */
export function getRequestBody(request) {
    if (request === undefined) throw Error(ERROR_PARAM_REQUIRED);
    if (typeof request !== 'object') throw Error(ERROR_PARAM_TYPE_IS_NOT_OBJECT);
    if (!('bodyUsed' in request)) throw Error(ERROR_PROPERTY_NOT_FOUND);
    if (!('text' in request)) throw Error(ERROR_PROPERTY_NOT_FOUND);

    if (request.bodyUsed) {
        // supporting this would require dealing with promises here,
        // which seems overkill right now as we only proxy GETs
        throw Error(ERROR_UNSUPPORTED_HTTP_VERB);
    }
    return '';
}

/**
 * verify that the required headers are present, ingesting an array and returning a boolean
 *
 * @export
 * @returns {boolean}
 */
export function verifyHeaderRequirements(headers) {
    if (headers === undefined) throw Error(ERROR_PARAM_REQUIRED);
    if (!Array.isArray(headers)) throw Error(ERROR_PARAM_TYPE_IS_NOT_ARRAY);

    return headers.some(el => el.name && el.name.toLowerCase() === 'host');
}

/**
 * ensure the right headers are present and calculate signed ones a needed.
 * Takes a URL.headers object and returns an array of objects
 *
 * @export
 * @returns {array}
 */
export function processHeaders(request, body, authMethod = 'AWS4_SIGNED_HEADERS') {
    if (request === undefined) throw Error(ERROR_PARAM_REQUIRED);
    if (body === undefined) throw Error(ERROR_PARAM_REQUIRED);
    if (typeof request !== 'object') throw Error(ERROR_PARAM_TYPE_IS_NOT_OBJECT);
    if (typeof body !== 'string') throw Error(ERROR_PARAM_TYPE_IS_NOT_STRING);
    if (!('headers' in request)) throw Error(ERROR_PROPERTY_NOT_FOUND);
    if (!('entries' in request.headers)) throw Error(ERROR_PROPERTY_NOT_FOUND);

    const headers = [];
    for (const entry of request.headers.entries()) {
        headers.push({
            name: entry[0],
            value: entry[1],
        });
    }

    if (!exports.verifyHeaderRequirements(headers)) {
        throw Error(ERROR_REQUIRED_HEADER_NOT_FOUND);
    }

    if (authMethod === 'AWS4_SIGNED_HEADERS') {
        headers.push({
            name: 'x-amz-content-sha256',
            value: sha256(body).toString(),
        });
    }

    // sort the headers alphabetically by header name
    headers.sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    });

    return headers;
}

/**
 * ensure the headers are all formatted in the way AWS insists on,
 * ingesting a URL.headers object and returning a string
 *
 * @export
 * @returns {Object}
 */
export function formatCanonicalHeaders(headers) {
    if (headers === undefined) throw Error(ERROR_PARAM_REQUIRED);
    if (!Array.isArray(headers)) throw Error(ERROR_PARAM_TYPE_IS_NOT_ARRAY);
    if (headers.length > 0 && typeof headers[0] !== 'object') throw Error(ERROR_PARAM_TYPE_IS_NOT_OBJECT);
    if (headers.length > 0 && !('name' in headers[0])) throw Error(ERROR_PROPERTY_NOT_FOUND);
    if (headers.length > 0 && !('value' in headers[0])) throw Error(ERROR_PROPERTY_NOT_FOUND);

    let response = '';
    headers.forEach((entry) => {
        response += `${entry.name.toLowerCase()}:${entry.value.trim()}\n`;
    });

    return response;
}

/**
 * ensure the headers are all formatted in the way AWS insists on,
 * ingesting a URL.headers object and returning a string
 *
 * @export
 * @returns {Object}
 */
export function formatSignedHeaders(headers) {
    if (headers === undefined) throw Error(ERROR_PARAM_REQUIRED);
    if (!Array.isArray(headers)) throw Error(ERROR_PARAM_TYPE_IS_NOT_ARRAY);
    if (headers.length > 0 && typeof headers[0] !== 'object') throw Error(ERROR_PARAM_TYPE_IS_NOT_OBJECT);
    if (headers.length > 0 && !('name' in headers[0])) throw Error(ERROR_PROPERTY_NOT_FOUND);

    let response = '';

    headers.forEach((entry) => {
        response += `${entry.name.toLowerCase()};`;
    });

    return response.slice(0, -1);
}


/**
 * Returns date in formay YYYYMMDD
 * 
 * @export
 * @returns {String}
 */
export function getShortDate() {
    const now = new Date();
    return `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}`;
}


/**
 * Creates Scope object for signed string i.e. "20130606/us-east-1/s3/aws4_request"
 * 
 * @export
 * @returns {String}
 */
export function createScope() {
    return `${getShortDate()}/${AWS_REGION}/s3/aws4_request`;
}


/**
 * Performs HmacSHA256 encryption
 * 
 * @export
 * @param {any} message 
 * @param {any} key 
 * @returns {String}
 */
export function toHmacSHA256(message, key) {
    return hmacSHA256(message, key);
}
