import * as idb from './../idb';
import { TOKEN_NAME } from './config';

/**
 * Get stored token
 *
 * @export
 * @returns {Promise}
 */
export function getToken() {
    return idb.get(TOKEN_NAME);
}

/**
 * Set stored token
 *
 * @export
 * @returns {Promise}
 */
export function setToken(value) {
    if (!value) throw Error('Value undefined');

    return idb.set(TOKEN_NAME, value).then(() => value);
}

/**
 * Delete stored token
 *
 * @export
 * @returns {Promise}
 */
export function deleteToken() {
    return idb.delete(TOKEN_NAME);
}
