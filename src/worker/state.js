import { getToken, setToken, deleteToken } from './storage';

// Token
let token = null;

/**
 * Is User authorized
 *
 * @returns {Boolean}
 */
export function isAuthorized() {
    return !!token;
}

/**
 * Set credentials
 *
 * @export
 * @param {any} newValue
 * @returns {Promise}
 */
export function setCredentials(newValue) {
    token = newValue;

    return setToken(newValue);
}

/**
 * Get credentials
 *
 * @export
 * @returns {Promise}
 */
export function getCredentials() {
    if (token) { return Promise.resolve(token); }
    return getToken();
}

/**
 * Delete credentials
 *
 * @export
 * @returns {Promise}
 */
export function deleteCredentials() {
    token = null;

    return deleteToken();
}
