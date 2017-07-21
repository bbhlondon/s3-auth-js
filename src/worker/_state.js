import { getToken, setToken, deleteToken } from './storage';

/**
 * Retrive credentials
 *
 * @export
 * @returns {Promise}
 */
export function retriveCredentials() {
    return getToken();
}

/**
 * Store credentials
 *
 * @export
 * @param {any} newValue
 * @returns {Promise}
 */
export function storeCredentials({ type, payload }) {
    return setToken({ type, payload });
}


/**
 * Delete credentials
 *
 * @export
 * @returns {Promise}
 */
export function deleteCredentials() {
    return deleteToken();
}
