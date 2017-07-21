import * as _ from './_state';
import { ERROR_PARAM_REQUIRED } from '../consts';

// Credentials
let credentials;

/**
 * Is User authorized
 *
 * @returns {Boolean}
 */
export function isAuthorized() {
    return !!credentials;
}

/**
 * Initialize state
 * 
 * @export
 * @returns 
 */
export function initializeState() {
    return _.retriveCredentials().then((storedCredentials) => {
        credentials = storedCredentials;

        return credentials;
    });
}

/**
 * Get credentials
 *
 * @export
 * @returns {Object}
 */
export function getCredentials() {
    return credentials;
}


/**
 * Set credentials
 *
 * @export
 * @param {any} newValue
 * @returns {Promise}
 */
export function setCredentials({ type, payload }) {
    try {
        if (!type) throw new Error(ERROR_PARAM_REQUIRED);
        if (!payload) throw new Error(ERROR_PARAM_REQUIRED);

        return _.storeCredentials({ type, payload }).then((storedCredentials) => {
            credentials = storedCredentials;

            return credentials;
        });
    } catch (e) {
        return Promise.reject(e);
    }
}


/**
 * Delete credentials
 *
 * @export
 * @returns {Promise}
 */
export function deleteCredentials() {
    return _.deleteCredentials().then((storedToken) => {
        credentials = storedToken;

        return credentials;
    });
}
