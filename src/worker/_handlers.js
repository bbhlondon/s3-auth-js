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


/**
 * Returns current hostname
 * 
 * @export
 * @returns 
 */
export function getCurrentHostname() {
    return self.location.hostname;
}

/**
 * Checks if request has the same domain as service worker
 * 
 * @export
 * @param {any} request 
 * @returns 
 */
export function shouldInterceptRequest(request) {
    return getCurrentHostname() === new URL(request.url).hostname;
}


/**
 * Respond to FetchEvent
 * 
 * @export
 * @param {any} event 
 * @param {Request} newRequest 
 */
export function respond(event, newRequest) {
    event.respondWith(
        fetch(newRequest),
    );
}

