let idb;
const DB_NAME = 'keyval-store';
const STORE_NAME = 'keyval';

const ERROR_INVALID_OPERATION = '[IDB] Invalid operation';

/**
 * Creates IndexedDB
 *
 * @returns {Promise}
 */
function createDb() {
    if (!idb) {
        idb = new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, 1);

            request.onerror = () => {
                reject(request.error);
            };

            request.onupgradeneeded = () => {
                // First time setup: create an empty object store
                request.result.createObjectStore(STORE_NAME);
            };

            request.onsuccess = () => {
                resolve(request.result);
            };
        });
    }
    return idb;
}

/**
 * Get the store
 *
 * @param {String} type Transaction type
 * @param {Function} operation Function that returns IDBRequest
 * @returns {Promise}
 */
function withStore(type, operation) {
    try {
        if (!type) throw Error('[IDB] Transaction type undefined');
        if (typeof type !== 'string') throw Error('[IDB] Transaction type must be a string');

        if (!operation) throw Error('[IDB] Operation undefined');

        return createDb().then(db => new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, type);
            const objectStore = transaction.objectStore(STORE_NAME);
            const request = operation(objectStore);

            if (request instanceof IDBRequest) {
                request.onsuccess = () => {
                    resolve(request.result);
                };

                request.onerror = () => {
                    reject(request.error);
                };

                transaction.oncomplete = () => {
                };

                transaction.onerror = () => {
                    reject(transaction.error);
                };
            } else {
                throw Error(ERROR_INVALID_OPERATION);
            }
        }));
    } catch (e) {
        return Promise.reject(e);
    }
}

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

