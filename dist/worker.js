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

var Logger = function () {
    function Logger() {
        classCallCheck(this, Logger);

        this._debug = false;
    }

    createClass(Logger, null, [{
        key: "log",
        value: function log(message) {
            if (this.debug) {
                console.info(message);
            }
        }
    }, {
        key: "error",
        value: function error(message) {
            console.error(message);
        }
    }, {
        key: "debug",
        get: function get$$1() {
            return this._debug;
        },
        set: function set$$1(newValue) {
            this._debug = newValue;
        }
    }]);
    return Logger;
}();

self.addEventListener('activate', function (event) {
    Logger.log('[Service worker] Activated');
});

})));
