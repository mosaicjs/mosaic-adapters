(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _libTypeKey = __webpack_require__(1);

	var _libTypeKey2 = _interopRequireDefault(_libTypeKey);

	var _libAdapterManager = __webpack_require__(2);

	var _libAdapterManager2 = _interopRequireDefault(_libAdapterManager);

	var _libAdaptable = __webpack_require__(3);

	var _libAdaptable2 = _interopRequireDefault(_libAdaptable);

	exports['default'] = {
	    TypeKey: _libTypeKey2['default'],
	    AdapterManager: _libAdapterManager2['default'],
	    Adaptable: _libAdaptable2['default']
	};
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * This object contains utility mix-in methods returning object types as a
	 * Symbol instance. The main method in the mixin is "getTypeKey" which returns
	 * type keys for classes, objects and strings. To build a type key for a class
	 * this method uses class names of the specified class and all their parents.
	 * For objects (class instances) this method uses the "getTypeKey" method if it
	 * is defined on the object. If there is no such a method then the object type
	 * (class) is used to get the key. The "getTypeKey" method can be used to
	 * transform strings to type keys. Type keys form hierarchies using the "/"
	 * symbol as a separator between individual type keys (Example:
	 * "Art/AbstractArt/Cubism" is a child of "Art/AbstractArt"). The
	 * TypeKey.getTypeParentKey method can be used to get parent type key.
	 */
	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	var TypeKey = {

	    /**
	     * Returns the type for the specified object. If the object is not defined
	     * then this method uses 'this' instead. If the specified parameter is a
	     * function then the key type is defined for the hierarchy of classes. If
	     * the given object contains a 'getTypeKey' method then it is used instead.
	     */
	    getTypeKey: function getTypeKey(obj) {
	        if (!obj) {
	            obj = this;
	        } else if (typeof obj.getTypeKey === 'function') {
	            return obj.getTypeKey();
	        }
	        if (obj instanceof Symbol) return obj;
	        var key = undefined;
	        if (typeof obj === 'string') {
	            key = obj;
	        } else {
	            var proto;
	            if (typeof obj === 'function') {
	                proto = obj.prototype;
	            } else {
	                proto = Object.getPrototypeOf(obj);
	            }
	            var array = [];
	            while (proto) {
	                array.push(proto.constructor.name);
	                proto = Object.getPrototypeOf(proto);
	            }
	            array.reverse();
	            key = array.join('/');
	        }
	        return Symbol['for'](key);
	    },

	    /**
	     * Returns a key for the parent type.
	     */
	    getParentTypeKey: function getParentTypeKey(key) {
	        if (!(key instanceof Symbol)) {
	            key = TypeKey.getTypeKey.apply(this, key);
	        }
	        var str = Symbol.keyFor(key);
	        var array = str.split('/');
	        array.pop();
	        str = array.join('/');
	        return str ? Symbol['for'](str) : null;
	    }
	};
	exports['default'] = TypeKey;
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _TypeKey = __webpack_require__(1);

	var _TypeKey2 = _interopRequireDefault(_TypeKey);

	/**
	 * An adapter manager used to register/retrieve objects corresponding to the
	 * types of adaptable object and the types of the target object.
	 */

	var AdapterManager = (function () {
	    function AdapterManager(options) {
	        _classCallCheck(this, AdapterManager);

	        options = options || {};
	        this._adapters = {};
	        this._cache = {};
	    }

	    _createClass(AdapterManager, [{
	        key: 'registerAdapter',

	        /**
	         * Registers a new adapter from one type to another.
	         * 
	         * @param from
	         *            the type of the adaptable object
	         * @param to
	         *            type of the target object
	         * @param adapter
	         *            the adapter type
	         */
	        value: function registerAdapter(from, to, adapter) {
	            if (adapter === undefined) {
	                adapter = to;
	            }
	            var key = this._getKey(from, to);
	            this._adapters[key] = adapter || to;
	            this._cache = {};
	        }
	    }, {
	        key: 'removeAdapter',

	        /** Removes an adapter from one type to another. */
	        value: function removeAdapter(from, to) {
	            var key = this._getKey(from, to);
	            var result = this._adapters[key];
	            delete this._adapters[key];
	            this._cache = {};
	            return result;
	        }
	    }, {
	        key: 'getAdapter',

	        /** Returns an adapter of one object type to another type. */
	        value: function getAdapter(from, to) {
	            var cacheKey = this._getKey(from, to);
	            var result = this._cache[cacheKey];
	            if (!result && !(cacheKey in this._cache)) {
	                this._forEachKey(from, function (f) {
	                    this._forEachKey(to, function (t) {
	                        var key = this._getKey(f, t);
	                        result = this._adapters[key];
	                        return !result;
	                    });
	                    return !result;
	                });
	                this._cache[cacheKey] = result;
	            }
	            return result;
	        }
	    }, {
	        key: 'newAdapter',

	        /**
	         * Creates and returns a new adapter from one type to another. If the
	         * registered adapter is a function then it is used as constructor to create
	         * a new object.
	         */
	        value: function newAdapter(from, to, options) {
	            var result = null;
	            var AdapterType = this.getAdapter(from, to);
	            if (typeof AdapterType === 'function') {
	                options = options || {};
	                result = new AdapterType(options, from, to);
	            } else {
	                result = AdapterType;
	            }
	            return result;
	        }
	    }, {
	        key: '_getKey',

	        /**
	         * Returns a key used to find adapters of one type to another.
	         * 
	         * @param from
	         *            the type of the adaptable object
	         * @param to
	         *            type of the target object
	         */
	        value: function _getKey(from, to) {
	            var fromType = _TypeKey2['default'].getTypeKey(from);
	            var toType = _TypeKey2['default'].getTypeKey(to);
	            return Symbol.keyFor(fromType) + '::' + Symbol.keyFor(toType);
	        }
	    }, {
	        key: '_forEachKey',

	        /**
	         * Calls the specified function starting from the given to the top
	         */
	        value: function _forEachKey(key, action) {
	            var i = 0;
	            key = _TypeKey2['default'].getTypeKey(key);
	            var result = undefined;
	            while (key) {
	                result = action.call(this, key, i++);
	                if (result === false) break;
	                key = _TypeKey2['default'].getParentTypeKey(key);
	            }
	            return result;
	        }
	    }]);

	    return AdapterManager;
	})();

	exports['default'] = AdapterManager;
	module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _TypeKey = __webpack_require__(1);

	var _TypeKey2 = _interopRequireDefault(_TypeKey);

	var Adaptable = (function () {
	    function Adaptable(options) {
	        _classCallCheck(this, Adaptable);

	        options = options || {};
	        this.adapters = options.adapters;
	    }

	    _createClass(Adaptable, [{
	        key: 'adapters',
	        set: function (adapters) {
	            this._adapters = adapters;
	        },
	        get: function () {
	            return this._adapters;
	        }
	    }, {
	        key: 'setAdapter',
	        value: function setAdapter(adapterType, adapter) {
	            var cache = this.__adapters = this.__adapters || {};
	            if (adapter) {
	                var key = _TypeKey2['default'].getTypeKey(adapterType);
	                cache[key] = adapter;
	            }
	            return this;
	        }
	    }, {
	        key: 'getAdapter',
	        value: function getAdapter(adapterType, options) {
	            var cache = this.__adapters = this.__adapters || {};
	            var key = _TypeKey2['default'].getTypeKey(adapterType);
	            var result = cache[key];
	            if (!result) {
	                result = this.newAdapter(adapterType, options);
	                cache[key] = result;
	            }
	            return result;
	        }
	    }, {
	        key: 'newAdapter',
	        value: function newAdapter(adapterType, options) {
	            var result = this.adapters.newAdapter(this, adapterType, options);
	            return result;
	        }
	    }]);

	    return Adaptable;
	})();

	exports['default'] = Adaptable;

	Adaptable.prototype.getTypeKey = _TypeKey2['default'].getTypeKey;
	module.exports = exports['default'];

/***/ }
/******/ ])
});
;