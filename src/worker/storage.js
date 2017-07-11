import { storeGet, storeSet, storeDelete } from './../idb';
import { TOKEN_NAME } from './config';

/**
 * Get stored token
 *
 * @export
 * @returns {Promise}
 */
export function getToken() {
    return storeGet(TOKEN_NAME);
}

/**
 * Set stored token
 *
 * @export
 * @returns {Promise}
 */
export function setToken(value) {
    try {
        if (!value) throw Error('Value undefined');
        if (value && typeof value !== 'string') throw Error('Token must be a string');

        return storeSet(TOKEN_NAME, value).then(() => value);
    } catch (e) {
        return Promise.reject(e);
    }
}

/**
 * Delete stored token
 *
 * @export
 * @returns {Promise}
 */
export function deleteToken() {
    return storeDelete(TOKEN_NAME);
}
