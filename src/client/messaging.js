/**
 * Sends message to Service Worker
 * 
 * @param {any} message 
 * @returns 
 */
export default function sendMessage(message) {
    return new Promise((resolve, reject) => {
        navigator.serviceWorker.controller.postMessage(message);
        window.serviceWorker.onMessage = (e) => {
            resolve(e.data);
        };
    });
}