import Logger from '../logger';
import registerServiceWorker from './register';
import initializeForm from './form';
import sendMessage from './messaging';
import { makeMessage } from '../utils';
import { MESSAGE_SET_CREDENTIALS } from '../consts';


/**
 * Initialize client
 * 
 * @param {any} swPath Path to service worker
 */
function initialize(swPath) {
    registerServiceWorker(swPath).then(() => {
        initializeForm(document.querySelector('#form'), () => {
            Logger.log('Submit form');
            sendMessage(makeMessage(MESSAGE_SET_CREDENTIALS, { token: 'token' })).then(() => {
                Logger.log('ACK');
            });
        });
    }, (error) => {
        document.querySelector('#message').textContent = error;
    });
}


export default {
    initialize,
};
