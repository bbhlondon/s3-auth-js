import { ERROR_INVALID_OPERATION } from './consts';

let idb;

const DB_NAME = 'keyval-store';
const STORE_NAME = 'keyval';


/**

 * Creates IndexedDB
 *
 * @returns {Promise}
 */
export function createDb() {
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
export function withStore(type, operation) {
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
