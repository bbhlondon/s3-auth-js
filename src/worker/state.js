import { getToken, setToken, deleteToken } from './storage';

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
 * Set credentials
 *
 * @export
 * @param {any} newValue
 * @returns {Promise}
 */
export function setCredentials(newValue) {
    return setToken(newValue).then((storedToken) => {
        credentials = storedToken;

        return credentials;
    });
}

/**
 * Get credentials
 *
 * @export
 * @returns {Promise}
 */
export function getCredentials() {
    if (credentials) { return Promise.resolve(credentials); }
    return getToken();
}

/**
 * Delete credentials
 *
 * @export
 * @returns {Promise}
 */
export function deleteCredentials() {
    return deleteToken().then((storedToken) => {
        credentials = storedToken;

        return credentials;
    });
}
