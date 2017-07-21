/* eslint no-unused-vars: 0 */
import Logger from '../logger';
import { GATEWAY_URL, INDEX_URL } from '../consts';


/**
 * Redirect to Gateway page
 * 
 * @export
 * @param {any} event 
 * @returns {Request}
 */
export function respondWithRedirectToGateway(event) {
    Logger.log('[Service worker] Redirect to gateway');
    return new Request(GATEWAY_URL);
}

/**
 * Responds with requested item
 * 
 * @export
 * @param {any} event 
 * @returns {Request}
 */
export function respondWithRequestedItem(event) {
    Logger.log('[Service worker] Response received');

    // TODO: Amend request
    return new Request(event.request);
}


/**
 * Redirect to Index page
 * 
 * @export
 * @param {any} event 
 * @returns {Request}
 */
export function repondWithRedirectToIndex(event) {
    Logger.log('[Service worker] Redirect to index');
    return new Request(INDEX_URL);
}
