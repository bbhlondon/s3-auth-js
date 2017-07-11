import { GATEWAY_URL, BYPASSED_URLS } from './config';

/**
 * Is request whitelisted
 *
 * @param {any} request
 * @returns {Boolean}
 */
export function isBypassed(request) {
    return BYPASSED_URLS.find(item => request.url.indexOf(item) !== -1);
}

/**
 * Is Gateway request
 *
 * @param {any} request
 * @returns {Boolean}
 */
export function isGateway(request) {
    return request.url.indexOf(GATEWAY_URL) !== -1;
}