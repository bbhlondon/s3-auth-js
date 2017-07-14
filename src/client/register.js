import Logger from '../logger';
import { ERROR_SERVICE_WORKER_NOT_SUPPORTED, ERROR_SERVICE_WORKER_ALREADY_EXISTS, ERROR_SERVICE_WORKER_REGISTRATION_FAILED } from '../consts';
import { supportsServiceWorker, hasServiceWorker } from './_register';


/**
 * Registers Service Worker
 * 
 * @param {String} swPath 
 * @returns {Promise}
 */
export default function registerServiceWorker(swPath) {
    return new Promise((resolve, reject) => {
        if (!supportsServiceWorker()) {
            Logger.log('[Page] This browser doesn\'t support service workers');
            return reject(ERROR_SERVICE_WORKER_NOT_SUPPORTED);
        }

        if (navigator.serviceWorker.controller) {
            if (hasServiceWorker(swPath)) {
                Logger.log('[Client] The service worker is already active');
                return resolve(true);
            }
            Logger.error(`[Client] The page already has another service worker: ${navigator.serviceWorker.controller.scriptURL}`);
            return reject(ERROR_SERVICE_WORKER_ALREADY_EXISTS);
        }

        window.addEventListener('load', () => {
            navigator.serviceWorker.register(swPath).then((registration) => {
                // Registration was successful
                Logger.log(`[Client] ServiceWorker registration successful with scope: ${registration.scope}`);

                return resolve(true);
            }, (err) => {
                // registration failed :(
                Logger.log(`[Client] ServiceWorker registration failed: ${err}`);

                return reject(ERROR_SERVICE_WORKER_REGISTRATION_FAILED);
            });
        });

        return null;
    });
}
