import { storeGet, storeSet, storeDelete } from './../idb';
import { ERROR_UNSUPPORTED_AUTH_TYPE, ERROR_PARAM_REQUIRED, AUTH_AWS4_SIGNED_HEADERS } from '../consts';

const TOKEN_NAME = 'token';

/**
 * Get stored token
 *
 * @export
 * @returns {Promise}
 */
export function getToken() {
    return storeGet(TOKEN_NAME).then((token) => {
        if (token) {
            const arr = token.split(':');
            const type = arr[0];

            switch (type) {
            case AUTH_AWS4_SIGNED_HEADERS:
                return { type: arr[0], key: arr[1], secret: arr[2] };
            default:
                return null;
            }
        } else {
            return null;
        }
    });
}


/**
 * Set stored token
 *
 * @export
 * @returns {Promise}
 */
export function setToken({ type = '', payload = null } = {}) {
    try {
        if (!type) throw new Error(ERROR_PARAM_REQUIRED);
        if (!payload) throw new Error(ERROR_PARAM_REQUIRED);

        let token;

        switch (type) {
        case AUTH_AWS4_SIGNED_HEADERS:
            token = `${type}:${payload.key}:${payload.secret}`;
            break;
        default:
            throw new Error(ERROR_UNSUPPORTED_AUTH_TYPE);
        }

        return storeSet(TOKEN_NAME, token).then(() => ({ type, payload }));
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
