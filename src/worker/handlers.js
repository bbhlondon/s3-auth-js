import Logger from '../logger';
import { getToken, setToken } from './storage';
import { GATEWAY_URL, INDEX_URL, BYPASSED_URLS } from './config';

// Token
let token = null;

/**
 * Is User authorized
 *
 * @returns {Boolean}
 */
function isAuthorized() {
    return token;
}

/**
 * Is request whitelisted
 *
 * @param {any} request
 * @returns {Boolean}
 */
function isBypassed(request) {
    return BYPASSED_URLS.find(item => request.url.indexOf(item) !== -1);
}

/**
 * Is Gateway request
 *
 * @param {any} request
 * @returns {Boolean}
 */
function isGateway(request) {
    return request.url.indexOf(GATEWAY_URL) !== -1;
}

/**
 * Handles Activate Event
 *
 * @export
 * @param {any} event
 */
export function handleActivate(event) {
    event.waitUntil(
        getToken().then((storedToken) => {
            token = storedToken;
            Logger.log(`[Service worker] Activated with token: ${token}`);
        }),
    );
}

/**
 * Handles Message Event
 *
 * @export
 * @param {any} event
 */
export function handleMessage(event) {
    if (event.data && event.data.type) {
        Logger.log(`[Service worker] Message recieved: ${event.data}`);

        const client = event.source;
        const { type, payload } = event.data;

        switch (type) {
        case 'SET_TOKEN':
            token = payload.token;
            setToken(token).then(() => {
                client.postMessage({ type: 'TOKEN_SET' });
            });
            break;
        default:
        }
    } else {
        Logger.log('[Service worker] Unhandeled message:');
    }
}

/**
 * Handles Fetch Event
 *
 * @export
 * @param {any} event
 */
export function handleFetch(event) {
    Logger.log(`[Service worker] Fetch event: ${event.request.url}`);

    if (isAuthorized() || isBypassed(event.request)) {
        if (isGateway(event.request)) {
            event.respondWith(
                fetch(new Request(INDEX_URL)).then((response) => {
                    Logger.log('[Service worker] Redirect to index');
                    return response;
                }),
            );
        } else {
            event.respondWith(
                fetch(new Request(event.request)).then((response) => {
                    Logger.log('[Service worker] Response received');
                    return response;
                }),
            );
        }
    } else {
        event.respondWith(
            fetch(new Request(GATEWAY_URL)).then((response) => {
                Logger.log('[Service worker] Redirect to gateway');
                return response;
            }),
        );
    }
}
