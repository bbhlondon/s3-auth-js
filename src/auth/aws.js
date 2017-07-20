/**
 * This overly verbose module is designed to replicate the AWS signature generation
 * algorithm exactly, and to remain as easy to follow from the specification at
 * http://docs.aws.amazon.com/AmazonS3/latest/API/sig-v4-header-based-auth.html as possible
 */
import sha256 from 'crypto-js/sha256';
import {
    ERROR_PARAM_REQUIRED,
    ERROR_PARAM_TYPE_IS_NOT_OBJECT,
    ERROR_PROPERTY_NOT_FOUND,
    ERROR_PARAM_IS_NOT_ALLOWED,
    ERROR_PARAM_TYPE_IS_NOT_STRING,
    HTTP_METHODS_ALLOWED,
    AWS_REGION,
    AUTH_IDENTIFIER_HEADER,
} from '../consts';
import * as _ from './_aws';
import { hex } from './utils';


/**
 * Returns a string in the format AWS requires, with 'keys' for:
 * HTTPMethod, CanonicalURI, CanonicalQueryString, CanonicalHeaders, SignedHeaders, HashedPayload
 *
 * @export
 * @returns {string}
 */
export function createCanonicalRequest(request) {
    if (request === undefined) throw Error(ERROR_PARAM_REQUIRED);
    if (typeof request !== 'object') throw Error(ERROR_PARAM_TYPE_IS_NOT_OBJECT);
    if (!('method' in request)) throw Error(ERROR_PROPERTY_NOT_FOUND);
    if (!HTTP_METHODS_ALLOWED.includes(request.method)) throw Error(ERROR_PARAM_IS_NOT_ALLOWED);


    const url = new URL(request.url);
    const body = _.getRequestBody(request);
    const headers = _.processHeaders(request, body);

    const CanonicalRequestObj = {
        HTTPMethod: request.method,
        CanonicalURI: url.pathname,
        CanonicalQueryString: _.encodeQueryStringParameters(url.searchParams),
        CanonicalHeaders: _.formatCanonicalHeaders(headers),
        SignedHeaders: _.formatSignedHeaders(headers),
        HashedPayload: hex(sha256(body)),
    };

    return `${CanonicalRequestObj.HTTPMethod}\n${CanonicalRequestObj.CanonicalURI}\n${CanonicalRequestObj.CanonicalQueryString}\n${CanonicalRequestObj.CanonicalHeaders}\n${CanonicalRequestObj.SignedHeaders}\n${CanonicalRequestObj.HashedPayload}\n`;
}


/**
 * Returns string to sign
 * 
 * @export
 * @param {any} canonicalRequest 
 * @returns 
 */
export function createStringToSign(canonicalRequest) {
    if (!canonicalRequest) throw Error(ERROR_PARAM_REQUIRED);
    if (typeof canonicalRequest !== 'string') throw Error(ERROR_PARAM_TYPE_IS_NOT_STRING);

    const timeStampISO8601Format = _.getAWSTimestamp();
    const scope = _.createScope();
    const request = hex(sha256(canonicalRequest).toString());

    return `${AUTH_IDENTIFIER_HEADER}\n${timeStampISO8601Format}\n${scope}\n${request}`;
}

/**
 * Returns Signing key
 * 
 * @export
 * @param {any} awsSecretKey 
 * @param {any} awsRegion 
 * @returns {String}
 */
export function createSigningKey(awsSecretKey, awsRegion) {
    if (!awsSecretKey) throw Error(ERROR_PARAM_REQUIRED);
    if (typeof awsSecretKey !== 'string') throw Error(ERROR_PARAM_TYPE_IS_NOT_STRING);
    if (!awsRegion) throw Error(ERROR_PARAM_REQUIRED);
    if (typeof awsRegion !== 'string') throw Error(ERROR_PARAM_TYPE_IS_NOT_STRING);

    return _.toHmacSHA256(_.toHmacSHA256(_.toHmacSHA256(_.toHmacSHA256(`AWS4${awsSecretKey}`, _.getShortDate()), awsRegion), 's3'), 'aws4_request');
}

/**
 * Returns signature
 * 
 * @export
 * @param {any} signingKey 
 * @param {any} stringToSign 
 * @returns {String}
 */
export function createSignature(signingKey, stringToSign) {
    if (!signingKey) throw Error(ERROR_PARAM_REQUIRED);
    if (typeof signingKey !== 'string') throw Error(ERROR_PARAM_TYPE_IS_NOT_STRING);
    if (!stringToSign) throw Error(ERROR_PARAM_REQUIRED);
    if (typeof stringToSign !== 'string') throw Error(ERROR_PARAM_TYPE_IS_NOT_STRING);

    return _.toHmacSHA256(signingKey, stringToSign);
}


/**
 * Returns Authorization header
 * 
 * @export
 * @param {any} awsAccessKey 
 * @param {any} awsRegion 
 * @param {any} signature 
 * @returns {String}
 */
export function createAuthorizationHeader(awsAccessKey, awsRegion, signature) {
    if (!awsAccessKey) throw Error(ERROR_PARAM_REQUIRED);
    if (typeof awsAccessKey !== 'string') throw Error(ERROR_PARAM_TYPE_IS_NOT_STRING);
    if (!awsRegion) throw Error(ERROR_PARAM_REQUIRED);
    if (typeof awsRegion !== 'string') throw Error(ERROR_PARAM_TYPE_IS_NOT_STRING);
    if (!signature) throw Error(ERROR_PARAM_REQUIRED);
    if (typeof signature !== 'string') throw Error(ERROR_PARAM_TYPE_IS_NOT_STRING);

    return `${AUTH_IDENTIFIER_HEADER} Credential=${awsAccessKey}/${_.getShortDate()}/${awsRegion}/s3/aws4_request,SignedHeaders=host;range;x-amz-content-sha256;x-amz-date,Signature=${signature}`;
}

/**
 * Returns x-amz-content-sha256 header
 * 
 * @export
 * @returns 
 */
export function createXAmzContentSha256Header() {
    return sha256('').toString();
}


/**
 * Returns x-amz-date header
 * 
 * @export
 * @returns 
 */
export function createXZmzDateHeader() {
    return _.getAWSTimestamp();
}
