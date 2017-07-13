/**
 * Is request whitelisted
 *
 * @param {Request} request
 * @returns {Boolean}
 */
export function isBypassed(bypassedUrls, request) {
    return bypassedUrls.find(item => request.url.indexOf(item) !== -1) !== undefined;
}

/**
 * Is Gateway request
 *
 * @param {Request} request
 * @returns {Boolean}
 */
export function isGateway(gatewayUrl, request) {
    return request.url.indexOf(gatewayUrl) !== -1;
}

