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

var idbKeyval = require('idb-keyval');

var getFunc = idbKeyval.get;
var setFunc = idbKeyval.set;

var TOKEN_NAME = 'token';
var GATEWAY_URL = '/gateway.html';
var INDEX_URL = '/test.html';

var BYPASSED_URLS = [GATEWAY_URL, '/client.js', 'browser-sync'];

function getToken() {
  return getFunc(TOKEN_NAME);
}

/**
 * Set stored token
 *
 * @export
 * @returns {Promise}
 */
function setToken(value) {
  if (!value) throw Error('Value undefined');

  return setFunc(TOKEN_NAME, value).then(function () {
    return value;
  });
}

/**
 * Delete stored token
 *
 * @export
 * @returns {Promise}
 */

var logger = new Logger();
// Token
var token = null;

/**
 * Is User authorized
 *
 * @returns {Boolean}
 */
function isAuthorized() {
    return token;
}

/**
 * Is request whitelisted
 *
 * @param {any} request
 * @returns {Boolean}
 */
function isBypassed(request) {
    return BYPASSED_URLS.find(function (item) {
        return request.url.indexOf(item) !== -1;
    });
}

/**
 * Is Gateway request
 *
 * @param {any} request
 * @returns {Boolean}
 */
function isGateway(request) {
    return request.url.indexOf(GATEWAY_URL) !== -1;
}

/**
 * Handles Activate Event
 * 
 * @export
 * @param {any} event 
 */
function handleActivate(event) {
    event.waitUntil(getToken().then(function (storedToken) {
        token = storedToken;
        logger.log('[Service worker] Activated with token: ' + token);
    }));
}

/**
 * Handles Message Event
 * 
 * @export
 * @param {any} event 
 */
function handleMessage(event) {

    if (event.data && event.data.type) {
        logger.log('[Service worker] Message recieved: ' + event.data);

        var client = event.source;
        var _event$data = event.data,
            type = _event$data.type,
            payload = _event$data.payload;


        switch (type) {
            case 'SET_TOKEN':
                token = payload.token;
                setToken(token).then(function () {
                    client.postMessage({ type: 'TOKEN_SET' });
                });
                break;
            default:

        }
    } else {
        logger.log('[Service worker] Unhandeled message:');
    }
}

/**
 * Handles Fetch Event
 * 
 * @export
 * @param {any} event 
 */
function handleFetch(event) {
    logger.log('[Service worker] Fetch event: ' + event.request.url);

    if (isAuthorized() || isBypassed(event.request)) {
        if (isGateway(event.request)) {
            event.respondWith(fetch(new Request(INDEX_URL)).then(function (response) {
                logger.log('[Service worker] Redirect to index');
                return response;
            }));
        } else {
            event.respondWith(fetch(new Request(event.request)).then(function (response) {
                logger.log('[Service worker] Response received');
                return response;
            }));
        }
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
