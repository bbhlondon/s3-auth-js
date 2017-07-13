/**
 * This overly verbose module is designed to replicate the AWS signature generation
 * algorithm exactly, and to remain as easy to follow from the specification at
 * http://docs.aws.amazon.com/AmazonS3/latest/API/sig-v4-header-based-auth.html as possible
 */

import {
    ERROR_PARAM_REQUIRED,
    ERROR_PARAM_IS_NOT_ALLOWED,
    ERROR_PARAM_TYPE_IS_NOT_OBJECT,
    ERROR_PROPERTY_NOT_FOUND,
    HTTP_METHODS_ALLOWED,
} from '../consts';
import * as _ from './_aws';

/**
 * Returns an object with keys for each of the AWS required:
 * HTTPMethod, CanonicalURI, CanonicalQueryString, CanonicalHeaders, SignedHeaders, HashedPayload
 *
 * @export
 * @returns {object}
 */
export function createCanonicalRequest(request) {
    if (request === undefined) throw Error(ERROR_PARAM_REQUIRED);
    if (typeof request !== 'object') throw Error(ERROR_PARAM_TYPE_IS_NOT_OBJECT);
    if (!('method' in request)) throw Error(ERROR_PROPERTY_NOT_FOUND);
    if (!HTTP_METHODS_ALLOWED.includes(request.method)) throw Error(ERROR_PARAM_IS_NOT_ALLOWED);

    const url = new URL(request.url);

    return {
        HTTPMethod: request.method,
        CanonicalURI: url.pathname,
        CanonicalQueryString: _.encodeQueryStringParameters(url.searchParams).toString(),
        CanonicalHeaders: '',
        SignedHeaders: '',
        HashedPayload: '',
    };
}

export function createStringToSign() {

}
