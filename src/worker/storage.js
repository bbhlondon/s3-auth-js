import 'idb-keyval';
import { TOKEN_NAME } from './config';

/**
 * Get stored token
 * 
 * @export
 * @returns {Promise}
 */
export function getToken() {
    return idbKeyval.get(TOKEN_NAME);
}

/**
 * Set stored token
 * 
 * @export
 * @returns {Promise}
 */
export function setToken(value) {
    return idbKeyval.set(TOKEN_NAME, value);
}

/**
 * Delete stored token
 * 
 * @export
 * @returns {Promise}
 */
export function deleteToken() {
    return idbKeyval.delete(TOKEN_NAME);
}
