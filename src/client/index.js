import Logger from '../logger';
import { ERROR_SERVICE_WORKER_NOT_SUPPORTED, ERROR_SERVICE_WORKER_ALREADY_EXISTS } from './consts';


/**
 * Toggle form element
 * 
 * @param {boolean} [newValue=true] 
 */
function toggleForm(newValue = true) {
    document.querySelector('#form').classList.toggle('active', newValue);
}


/**
 * Registers Service Worker
 * 
 * @param {String} swPath 
 * @returns {Promise}
 */
function registerServiceWorker(swPath) {
    return new Promise((resolve, reject) => {
        if (!('serviceWorker' in navigator)) {
            Logger.log('[Page] This browser doesn\'t support service workers');
            reject(ERROR_SERVICE_WORKER_NOT_SUPPORTED);
        }

        if (navigator.serviceWorker.controller) {
            if (navigator.serviceWorker.controller.scriptURL.indexOf(swPath) >= 0) {
                Logger.log('[Client] The service worker is already active');
                resolve(true);
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

                resolve(true);
            }, (err) => {
                // registration failed :(
                Logger.log(`[Client] ServiceWorker registration failed: ${err}`);

                reject(false);
            });
        });
    });
}


/**
 * Initialize client
 * 
 * @param {any} swPath Path to service worker
 */
function initialize(swPath) {
    registerServiceWorker(swPath).then(() => {
        toggleForm();
    }, () => {

    });
}


export default {
    initialize,
};
