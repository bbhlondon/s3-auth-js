import Logger from '../logger/logger';
import { getToken, setToken } from './storage';
import { GATEWAY_URL, INDEX_URL, WHITELISTED_URLS } from './config';

// Logger
const logger = new Logger();
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
function isWhitelisted(request) {
    return WHITELISTED_URLS.find(item => request.url.indexOf(item) !== -1);
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

export function handleActivate(event) {
    event.waitUntil(
        getToken().then((storedToken) => {
            token = storedToken;
            logger.log(`[Service worker] Activated with token: ${token}`);
        }),
    );
}

export function handleMessage(event) {
  

    if (event.data && event.data.type) {
        logger.log(`[Service worker] Message recieved: ${event.data}`);

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

    }
    else {
        logger.log('[Service worker] Un-catched message:');
    }
}

export function handleFetch(event) {
    logger.log(`[Service worker] Fetch event: ${event.request.url}`);

    if (isAuthorized() || isWhitelisted(event.request)) {
        if (isGateway(event.request)) {
            event.respondWith(
                fetch(new Request(INDEX_URL)).then((response) => {
                    logger.log('[Service worker] Redirect to index');
                    return response;
                }),
            );
        } else {
            event.respondWith(
                fetch(new Request(event.request)).then((response) => {
                    logger.log('[Service worker] Response received');
                    return response;
                }),
            );
        }
    } else {
        event.respondWith(
            fetch(new Request(GATEWAY_URL)).then((response) => {
                logger.log('[Service worker] Redirect to gateway');
                return response;
            }),
        );
    }
}
