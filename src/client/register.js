import Logger from '../logger';
import { ERROR_SERVICE_WORKER_NOT_SUPPORTED, ERROR_SERVICE_WORKER_ALREADY_EXISTS, ERROR_SERVICE_WORKER_REGISTRATION_FAILED } from '../consts';


/**
 * Registers Service Worker
 * 
 * @param {String} swPath 
 * @returns {Promise}
 */
export default function registerServiceWorker(swPath) {
    return new Promise((resolve, reject) => {
        if (!('serviceWorker' in navigator)) {
            Logger.log('[Page] This browser doesn\'t support service workers');
            reject(ERROR_SERVICE_WORKER_NOT_SUPPORTED);
        }

        if (navigator.serviceWorker.controller) {
            if (navigator.serviceWorker.controller.scriptURL.indexOf(swPath) >= 0) {
                Logger.log('[Client] The service worker is already active');
                resolve();
            } else {
                Logger.error(`[Client] The page already has another service worker: ${navigator.serviceWorker.controller.scriptURL}`);
                reject(ERROR_SERVICE_WORKER_ALREADY_EXISTS);
            }
        }

        Logger.log('[Client] The service worker needs to be installed');

        window.addEventListener('load', () => {
            navigator.serviceWorker.register(swPath).then((registration) => {
                // Registration was successful
                Logger.log(`[Client] ServiceWorker registration successful with scope: ${registration.scope}`);

                resolve();
            }, (err) => {
                // registration failed :(
                Logger.log(`[Client] ServiceWorker registration failed: ${err}`);

                reject(ERROR_SERVICE_WORKER_REGISTRATION_FAILED);
            });
        });
    });
}
