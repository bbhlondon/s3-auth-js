var client = (function () {
'use strict';

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

var logger = new Logger();

function registerServiceWorker(swPath) {
    if (!('serviceWorker' in navigator)) {
        logger.log('[Page] This browser doesn\'t support service workers');
        return false;
    }

    if (navigator.serviceWorker.controller) {
        if (navigator.serviceWorker.controller.scriptURL.indexOf(swPath) >= 0) {
            logger.log('[Client] The service worker is already active');
        } else {
            logger.error('[Client] The page already has another service worker: ' + navigator.serviceWorker.controller.scriptURL);
        }
        return true;
    }

    logger.log('[Client] The service worker needs to be installed');
    window.addEventListener('load', function () {
        navigator.serviceWorker.register(swPath).then(function (registration) {
            // Registration was successful
            logger.log('[Client] ServiceWorker registration successful with scope: ' + registration.scope);
        }, function (err) {
            // registration failed :(
            logger.log('[Client] ServiceWorker registration failed: ' + err);
        });
    });
    return true;
}

registerServiceWorker('worker.js');

return registerServiceWorker;

}());
