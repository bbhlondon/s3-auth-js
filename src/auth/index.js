import { createCanonicalRequest, createStringToSign, createSigningKey, createSignature, createAuthorizationHeader, createXAmzContentSha256Header, createXZmzDateHeader } from './aws';
import {
    AWS_REGION,
    ERROR_PARAM_REQUIRED,
    ERROR_PARAM_TYPE_IS_NOT_OBJECT,
    ERROR_PROPERTY_NOT_FOUND,
    ERROR_PARAM_TYPE_IS_NOT_STRING,
} from '../consts';

export default function ammendRequest(request, awsAccessKey, awsSecretKey) {
    if (!request) throw Error(ERROR_PARAM_REQUIRED);
    if (typeof request !== 'object') throw Error(ERROR_PARAM_TYPE_IS_NOT_OBJECT);
    if (!awsAccessKey) throw Error(ERROR_PARAM_REQUIRED);
    if (typeof awsAccessKey !== 'string') throw Error(ERROR_PARAM_TYPE_IS_NOT_STRING);
    if (!awsSecretKey) throw Error(ERROR_PARAM_REQUIRED);
    if (typeof awsSecretKey !== 'string') throw Error(ERROR_PARAM_TYPE_IS_NOT_STRING);
    if (!('headers' in request)) throw Error(ERROR_PROPERTY_NOT_FOUND);
    if (!('entries' in request.headers)) throw Error(ERROR_PROPERTY_NOT_FOUND);

    const canonicalRequest = createCanonicalRequest(request);
    const stringToSign = createStringToSign(canonicalRequest);
    const signingKey = createSigningKey(awsSecretKey, AWS_REGION);
    const signature = createSignature(signingKey, stringToSign);
    const authHeader = createAuthorizationHeader(awsAccessKey, AWS_REGION, signature);
    const xAmzContentSha256Header = createXAmzContentSha256Header();
    const xZmzDateHeader = createXZmzDateHeader();

    request.headers.append('Authorization', authHeader);
    request.headers.append('x-amz-content-sha256', xAmzContentSha256Header);
    request.headers.append('x-amz-date', xZmzDateHeader);

    return request;
}
