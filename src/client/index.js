import Logger from '../logger';

function toggleForm(newValue) {
    document.querySelector('#form').classList.toggle('active', newValue);
}

function alertUser(message) {

}

function sendMessage(message) {
    return new Promise((resolve, reject) => {
        navigator.serviceWorker.controller.postMessage(message);
        window.serviceWorker.onMessage = function (e) {
            resolve(e.data);
        };
    });
}

function registerServiceWorker(swPath) {
    if (!('serviceWorker' in navigator)) {
        Logger.log('[Page] This browser doesn\'t support service workers');
        return false;
    }

    if (navigator.serviceWorker.controller) {
        if (navigator.serviceWorker.controller.scriptURL.indexOf(swPath) >= 0) {
            Logger.log('[Client] The service worker is already active');
        } else {
            Logger.error(`[Client] The page already has another service worker: ${navigator.serviceWorker.controller.scriptURL}`);
        }
        return true;
    }

    Logger.log('[Client] The service worker needs to be installed');

    window.addEventListener('load', () => {
        navigator.serviceWorker.register(swPath).then((registration) => {
            // Registration was successful
            Logger.log(`[Client] ServiceWorker registration successful with scope: ${registration.scope}`);

            return true;

        }, (err) => {
            // registration failed :(
            Logger.log(`[Client] ServiceWorker registration failed: ${err}`);

            return false;
        });
    });

}


/**
 * Initialize client
 * 
 * @param {any} swPath Path to service worker
 */
function initialize(swPath) {
    toggleForm(registerServiceWorker(swPath));
}


export default {
    initialize,
};
