/**
 * Sends message to Service Worker
 * 
 * @param {any} message 
 * @returns 
 */
export default function sendMessage(message) {
    return new Promise((resolve, reject) => {
        const messageChannel = new MessageChannel();
        messageChannel.port1.onmessage = (event) => {
            if (event.data.error) {
                reject(event.data.error);
            } else {
                resolve(event.data);
            }
        };


        navigator.serviceWorker.controller.postMessage(message, [messageChannel.port2]);
    });
}
