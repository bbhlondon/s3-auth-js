import Logger from '../logger';
import { respondWithRedirectToGateway, respondWithRequestedItem, repondWithRedirectToIndex } from './responses';
import { isBypassed, isGateway } from './_handlers';
import { isAuthorized, setCredentials, getCredentials } from './state';


/**
 * Handles Activate Event
 *
 * @export
 * @param {any} event
 */
export function handleActivate(event) {
    event.waitUntil(
        getCredentials().then((token) => {
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
            setCredentials(payload.token).then(() => {
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

    if (isAuthorized()) {
        if (isGateway(event.request)) {
            repondWithRedirectToIndex(event);
        } else {
            respondWithRequestedItem(event);
        }
    } else if (isBypassed(event.request)) {
        respondWithRequestedItem(event);
    } else {
        respondWithRedirectToGateway(event);
    }
}

