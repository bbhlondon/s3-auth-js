import Logger from '../logger';
import registerServiceWorker from './register';
import { initializeForm, displayMessage } from './form';
import sendMessage from './messaging';
import makeMessage from '../utils';
import { MESSAGE_SET_CREDENTIALS, AUTH_AWS4_SIGNED_HEADERS } from '../consts';


/**
 * Initialize client
 * 
 * @param {any} swPath Path to service worker
 */
function initialize(swPath) {
    registerServiceWorker(swPath).then(() => {
        initializeForm(document.querySelector('#form'), ({ name, password }) => {
            Logger.log('Submit form');
            sendMessage(makeMessage(MESSAGE_SET_CREDENTIALS, {
                type: AUTH_AWS4_SIGNED_HEADERS,
                key: name,
                secret: password,
            })).then(() => {
                Logger.log('ACK');
            });
        });
    }, (error) => {
        displayMessage(error);
    });
}


export default {
    initialize,
};
