import Logger from '../logger';
import { respondWithRedirectToGateway, respondWithRequestedItem, repondWithRedirectToIndex } from './responses';
import { isBypassed, isGateway, shouldInterceptRequest, respond } from './_handlers';
import makeMessage from '../utils';
import { isAuthorized, initializeState, setCredentials, deleteCredentials } from './state';
import { BYPASSED_URLS, GATEWAY_URL, MESSAGE_SET_CREDENTIALS, MESSAGE_CREDENTIALS_SET, MESSAGE_DELETE_CREDENTIALS, MESSAGE_CREDENTIALS_DELETED } from '../consts';


/**
 * Handle Install Event
 * 
 * @export
 * @param {any} event 
 */
export function handleInstall(event) {
    Logger.log(`[Service worker] Installing: ${event}`);
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
        initializeState().then(() => {
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

        const port = event.ports[0];
        const { type, payload } = event.data;

        switch (type) {
        case MESSAGE_SET_CREDENTIALS:
            setCredentials(payload).then(() => {
                port.postMessage(makeMessage(MESSAGE_CREDENTIALS_SET));
            });
            break;
        case MESSAGE_DELETE_CREDENTIALS:
            deleteCredentials().then(() => {
                port.postMessage(makeMessage(MESSAGE_CREDENTIALS_DELETED));
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


    if (shouldInterceptRequest(event.request) && !isBypassed(BYPASSED_URLS, event.request)) {
        let newRequest;

        if (isAuthorized()) {
            if (isGateway(GATEWAY_URL, event.request)) {
                newRequest = repondWithRedirectToIndex(event);
            } else {
                newRequest = respondWithRequestedItem(event);
            }
        } else {
            newRequest = respondWithRedirectToGateway(event);
        }

        try {
            respond(event, newRequest);
        } catch (e) {
            Logger.log('[Service worker] Not a FetchEvent');
        }
    }
}

