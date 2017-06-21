(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var instance = null;

var Logger = function () {
    function Logger() {
        classCallCheck(this, Logger);

        if (!instance) {
            instance = this;
        }

        return instance;
    }

    createClass(Logger, [{
        key: "log",
        value: function log(message) {
            console.info(message);
        }
    }, {
        key: "error",
        value: function error(message) {
            console.error(message);
        }
    }]);
    return Logger;
}();

(function() {
  'use strict';
  var db;

  function getDB() {
    if (!db) {
      db = new Promise(function(resolve, reject) {
        var openreq = indexedDB.open('keyval-store', 1);

        openreq.onerror = function() {
          reject(openreq.error);
        };

        openreq.onupgradeneeded = function() {
          // First time setup: create an empty object store
          openreq.result.createObjectStore('keyval');
        };

        openreq.onsuccess = function() {
          resolve(openreq.result);
        };
      });
    }
    return db;
  }

  function withStore(type, callback) {
    return getDB().then(function(db) {
      return new Promise(function(resolve, reject) {
        var transaction = db.transaction('keyval', type);
        transaction.oncomplete = function() {
          resolve();
        };
        transaction.onerror = function() {
          reject(transaction.error);
        };
        callback(transaction.objectStore('keyval'));
      });
    });
  }

  var idbKeyval = {
    get: function(key) {
      var req;
      return withStore('readonly', function(store) {
        req = store.get(key);
      }).then(function() {
        return req.result;
      });
    },
    set: function(key, value) {
      return withStore('readwrite', function(store) {
        store.put(value, key);
      });
    },
    delete: function(key) {
      return withStore('readwrite', function(store) {
        store.delete(key);
      });
    },
    clear: function() {
      return withStore('readwrite', function(store) {
        store.clear();
      });
    },
    keys: function() {
      var keys = [];
      return withStore('readonly', function(store) {
        // This would be store.getAllKeys(), but it isn't supported by Edge or Safari.
        // And openKeyCursor isn't supported by Safari.
        (store.openKeyCursor || store.openCursor).call(store).onsuccess = function() {
          if (!this.result) return;
          keys.push(this.result.key);
          this.result.continue();
        };
      }).then(function() {
        return keys;
      });
    }
  };

  if (typeof module != 'undefined' && module.exports) {
    module.exports = idbKeyval;
  } else if (typeof define === 'function' && define.amd) {
    define('idbKeyval', [], function() {
      return idbKeyval;
    });
  } else {
    self.idbKeyval = idbKeyval;
  }
}());

var TOKEN_NAME = 'token';
var GATEWAY_URL = '/gateway.html';

var WHITELISTED_URLS = ['/gateway.html', '/client.js', 'browser-sync'];

function getToken() {
  return idbKeyval.get(TOKEN_NAME);
}

/**
 * Set stored token
 * 
 * @export
 * @returns {Promise}
 */


/**
 * Delete stored token
 * 
 * @export
 * @returns {Promise}
 */

var logger = new Logger();

var token = null;

function isAuthorized() {
    return token;
}

function isWhitelisted(request) {
    return WHITELISTED_URLS.find(function (item) {
        return request.url.indexOf(item) !== -1;
    });
}

function handleActivate(event) {
    event.waitUntil(getToken().then(function (storedToken) {
        token = storedToken;
        logger.log('[Service worker] Activated with token: ' + token);
    }));
}

function handleMessage(event) {
    logger.log('[Service worker] Message recieved: ' + event.data);
}

function handleFetch(event) {
    logger.log('[Service worker] Fetch event: ' + event.request.url);

    if (isAuthorized() || isWhitelisted(event.request)) {
        event.respondWith(fetch(new Request(event.request)).then(function (response) {
            logger.log('[Service worker] Response received');

            return response;
        }));
    } else {
        event.respondWith(fetch(new Request(GATEWAY_URL)).then(function (response) {
            logger.log('[Service worker] Redirect to gateway');

            return response;
        }));
    }
}

self.addEventListener('activate', function (event) {
  return handleActivate(event);
});

// Message
self.addEventListener('message', function (event) {
  return handleMessage(event);
});

// Fetch
self.addEventListener('fetch', function (event) {
  return handleFetch(event);
});

})));
