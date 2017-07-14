/**
 * Is Servie Worker supported
 * 
 * @export
 * @returns {Boolean}
 */
export function supportsServiceWorker() {
    return ('serviceWorker' in navigator);
}

/**
 * Is page already controlled by Service Worker
 * 
 * @export
 * @param {String} swPath 
 * @returns {Boolean}
 */
export function hasServiceWorker(swPath) {
    return navigator.serviceWorker.controller.scriptURL.indexOf(swPath) >= 0;
}
