import Logger from '../logger';
import { GATEWAY_URL, INDEX_URL } from './config';



export function respondWithRedirectToGateway(event) {
    event.respondWith(
        fetch(new Request(GATEWAY_URL)).then((response) => {
            Logger.log('[Service worker] Redirect to gateway');
            return response;
        }),
    );
}

export function respondWithRequestedItem(event) {
    event.respondWith(
        fetch(new Request(event.request)).then((response) => {
            Logger.log('[Service worker] Response received');
            return response;
        }),
    );
}

export function repondWithRedirectToIndex(event) {
    event.respondWith(
        fetch(new Request(INDEX_URL)).then((response) => {
            Logger.log('[Service worker] Redirect to index');
            return response;
        }),
    );
}
