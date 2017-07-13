import Logger from '../logger';
import { respondWithRedirectToGateway, respondWithRequestedItem, repondWithRedirectToIndex } from './responses';
import { isBypassed, isGateway, makeMessage } from './_handlers';
import { isAuthorized, setCredentials, getCredentials, deleteCredentials } from './state';
import { BYPASSED_URLS, GATEWAY_URL } from './config';
import { MESSAGE_SET_CREDENTIALS, MESSAGE_CREDENTIALS_SET, MESSAGE_DELETE_CREDENTIALS, MESSAGE_CREDENTIALS_DELETED } from './consts';


/**
 * Handle Install Event
 * 
 * @export
 * @param {any} event 
 */
export function handleInstall(event) {
    Logger.log('[Service worker] Installing');
}


/**
 * Handles Activate Event
 *
 * @export
 * @param {any} event
 */
export function handleActivate(event) {
    self.clients.claim();

    event.waitUntil(
        getCredentials().then((token) => {
            Logger.log(`[Service worker] Activated; isAuthorized: ${isAuthorized()}`);
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
        case MESSAGE_SET_CREDENTIALS:
            setCredentials(payload.token).then(() => {
                client.postMessage(makeMessage(MESSAGE_CREDENTIALS_SET));
            });
            break;
        case MESSAGE_DELETE_CREDENTIALS:
            deleteCredentials().then(() => {
                client.postMessage(makeMessage(MESSAGE_CREDENTIALS_DELETED));
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
        if (isGateway(GATEWAY_URL, event.request)) {
            repondWithRedirectToIndex(event);
        } else {
            respondWithRequestedItem(event);
        }
    } else if (isBypassed(BYPASSED_URLS, event.request)) {
        respondWithRequestedItem(event);
    } else {
        respondWithRedirectToGateway(event);
    }
}

