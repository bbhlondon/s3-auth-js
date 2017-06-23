let db;

function createDb() {
    if (!db) {
        db = new Promise((resolve, reject) => {
            const openReq = indexedDB.open('keyval-store', 1);

            openReq.onerror = () => {
                reject(openReq.error);
            };

            openReq.onupgradeneeded = () => {
                // First time setup: create an empty object store
                openReq.result.createObjectStore('keyval');
            };

            openReq.onsuccess = () => {
                resolve(openReq.result);
            };
        });
    }
    return db;
}

function withStore(type, callback) {
    return createDb().then((db) => new Promise((resolve, reject) => {
        const transaction = db.transaction('keyval', type);
        transaction.oncomplete = () => {
            resolve();
        };
        transaction.onerror = () => {
            reject(transaction.error);
        };
        callback(transaction.objectStore('keyval'));
    }));
}

function storeGet(key) {
    let req;
    return withStore('readonly', (store) => {
        req = store.get(key);
    }).then(() => req.result);
}

function storeSet(key, value) {
    return withStore('readwrite', (store) => {
        store.put(value, key);
    });
}

function storeDelete(key) {
    return withStore('readwrite', (store) => {
        store.delete(key);
    });
}

export { storeGet as get, storeSet as set, storeDelete as delete };

