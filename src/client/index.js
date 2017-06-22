import Logger from '../logger/logger';

const logger = new Logger();

export default function registerServiceWorker(swPath) {
    if (!('serviceWorker' in navigator)) {
        logger.log('[Page] This browser doesn\'t support service workers');
        return false;
    }

    if (navigator.serviceWorker.controller) {
        if (navigator.serviceWorker.controller.scriptURL.indexOf(swPath) >= 0) {
            logger.log('[Client] The service worker is already active');
            
        } else {
            logger.error(`[Client] The page already has another service worker: ${navigator.serviceWorker.controller.scriptURL}`);
        }
        return true;
    }

    logger.log('[Client] The service worker needs to be installed');
    window.addEventListener('load', () => {
        navigator.serviceWorker.register(swPath).then((registration) => {
            // Registration was successful
            logger.log(`[Client] ServiceWorker registration successful with scope: ${registration.scope}`);
        }, (err) => {
            // registration failed :(
            logger.log(`[Client] ServiceWorker registration failed: ${err}`);
        });
    });
}

function sendMessage(message) {
    return new Promise((resolve, reject) => {
        navigator.serviceWorker.controller.postMessage(message);
        window.serviceWorker.onMessage = function (e) {
            resolve(e.data);
        };
    });
}

registerServiceWorker('worker.js');
