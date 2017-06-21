import Logger from '../logger/logger';
import { getToken } from './storage';
import { GATEWAY_URL, WHITELISTED_URLS } from './config';

// Logger
const logger = new Logger();

let token = null;

function isAuthorized() {
    return token;
}

function isWhitelisted(request) {
    return WHITELISTED_URLS.find(item => request.url.indexOf(item) !== -1);
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
    logger.log(`[Service worker] Message recieved: ${event.data}`);
}

export function handleFetch(event) {
    logger.log(`[Service worker] Fetch event: ${event.request.url}`);


    if (isAuthorized() || isWhitelisted(event.request)) {
        event.respondWith(
            fetch(new Request(event.request)).then((response) => {
                logger.log('[Service worker] Response received');

                return response;
            }),
        );
    } else {
        event.respondWith(
            fetch(new Request(GATEWAY_URL)).then((response) => {
                logger.log('[Service worker] Redirect to gateway');

                return response;
            }),
        );
    }
}
