import { withStore } from './_index';


/**
 * Get key value
 *
 * @param {String} key
 * @returns {Promise}
 */
function storeGet(key) {
    return withStore('readonly', store => store.get(key));
}


/**
 * Set key value
 *
 * @param {String} key
 * @param {String} value
 * @returns {Promise}
 */
function storeSet(key, value) {
    return withStore('readwrite', store => store.put(value, key));
}

/**
 * Delete key
 *
 * @param {String} key
 * @returns {Promise}
 */
function storeDelete(key) {
    return withStore('readwrite', store => store.delete(key));
}

export { storeGet, storeSet, storeDelete };

