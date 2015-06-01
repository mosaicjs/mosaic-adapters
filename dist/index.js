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

	var _libAdaptable = __webpack_require__(4);

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
	    },

	    /**
	     * Calls the specified function starting from the given to the top. If the
	     * specified action returns the "false" value then this method interrupt
	     * iterations.
	     * 
	     * @param return
	     *            the result of the last call to the action
	     */
	    forEachKey: function forEachKey(key, action, context) {
	        context = context || this;
	        var i = 0;
	        key = TypeKey.getTypeKey(key);
	        var result = undefined;
	        while (key) {
	            result = action.call(context, key, i++);
	            if (result === false) break;
	            key = TypeKey.getParentTypeKey(key);
	        }
	        return result;
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

	var _TypeIndex = __webpack_require__(3);

	var _TypeIndex2 = _interopRequireDefault(_TypeIndex);

	/**
	 * An adapter manager used to register/retrieve objects corresponding to the
	 * types of adaptable object and the types of the target object.
	 */

	var AdapterManager = (function () {

	    /**
	     * Constructor of this class. Initializes index of adapters and an internal
	     * cache.
	     */

	    function AdapterManager() {
	        _classCallCheck(this, AdapterManager);

	        this._adapters = new _TypeIndex2['default']();
	        this._cache = new _TypeIndex2['default']();
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
	            _TypeKey2['default'].forEachKey(to, function (t) {
	                var key = this._getAdapterKey(from, t);
	                var slot = this._adapters.get(key);
	                if (slot && slot.direct) return false;
	                this._adapters.set(key, {
	                    adapter: adapter,
	                    direct: t === to
	                });
	            }, this);
	            this._cache.clear();
	        }
	    }, {
	        key: 'removeAdapter',

	        /** Removes an adapter from one type to another. */
	        value: function removeAdapter(from, to) {
	            var key = this._getAdapterKey(from, to);
	            var slot = this._adapters.del(key);
	            this._cache.clear();
	            return slot ? slot.adapter : undefined;
	        }
	    }, {
	        key: 'getAdapter',

	        /**
	         * Returns an adapter of one type to another type. This method caches
	         * adapter for each unique combination of keys.
	         * 
	         * @param from
	         *            the type of the adaptable object
	         * @param to
	         *            type of the adapter
	         * @return
	         */
	        value: function getAdapter(from, to) {
	            var cacheKey = this._getAdapterKey(from, to);
	            var result = this._cache.get(cacheKey);
	            if (!result && !this._cache.has(cacheKey)) {
	                _TypeKey2['default'].forEachKey(from, function (f) {
	                    var key = this._getAdapterKey(f, to);
	                    var slot = this._adapters.get(key);
	                    result = slot ? slot.adapter : undefined;
	                    return !result;
	                }, this);
	                this._cache.set(cacheKey, result);
	            }
	            return result;
	        }
	    }, {
	        key: 'newAdapter',

	        /**
	         * Creates and returns a new adapter from one type to another. If the
	         * registered adapter is a function then it is used as constructor to create
	         * a new object.
	         * 
	         * @param from
	         *            key of the type of the object for which we want to find an
	         *            adapter
	         * @param to
	         *            the key of the adapter
	         * @param a
	         *            new adapter instance
	         */
	        value: function newAdapter(from, to, options) {
	            var result = null;
	            var adapter = this.getAdapter(from, to);
	            var AdapterType = adapter || to;
	            if (typeof AdapterType === 'function') {
	                options = options || {};
	                result = new AdapterType(options, from, to);
	            } else {
	                result = adapter;
	            }
	            return result;
	        }
	    }, {
	        key: '_getAdapterKey',

	        /**
	         * Returns a key used to find adapters from one type to another.
	         * 
	         * @param from
	         *            the type of the adaptable object
	         * @param to
	         *            type of the target object
	         * @return a new adapter key
	         */
	        value: function _getAdapterKey(from, to) {
	            var fromType = _TypeKey2['default'].getTypeKey(from);
	            var toType = _TypeKey2['default'].getTypeKey(to);
	            var key = Symbol.keyFor(fromType) + '::' + Symbol.keyFor(toType);
	            return Symbol['for'](key);
	        }
	    }]);

	    return AdapterManager;
	})();

	exports['default'] = AdapterManager;
	module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var UNDEFINED = Symbol();
	var NULL = Symbol();

	var TypeIndex = (function () {
	    function TypeIndex() {
	        _classCallCheck(this, TypeIndex);

	        this.index = {};
	    }

	    _createClass(TypeIndex, [{
	        key: "set",
	        value: function set(key, value) {
	            if (!key) return this;
	            this.index[key] = value === undefined ? UNDEFINED : value === null ? NULL : value;
	            return this;
	        }
	    }, {
	        key: "get",
	        value: function get(key) {
	            if (!key) return;
	            var value = this.index[key];
	            value = value === UNDEFINED ? undefined : value === NULL ? null : value;
	            return value;
	        }
	    }, {
	        key: "del",
	        value: function del(key) {
	            if (!key) return;
	            var value = this.get(key);
	            delete this.index[key];
	            return value;
	        }
	    }, {
	        key: "has",
	        value: function has(key) {
	            if (!key) return false;
	            var val = this.index[key];
	            return !!val;
	        }
	    }, {
	        key: "clear",
	        value: function clear() {
	            this.index = {};
	            return this;
	        }
	    }, {
	        key: "keys",
	        value: function keys() {
	            return this.index.getOwnPropertySymbols();
	        }
	    }, {
	        key: "empty",
	        value: function empty() {
	            var keys = this.keys();
	            return !keys.length;
	        }
	    }]);

	    return TypeIndex;
	})();

	exports["default"] = TypeIndex;
	module.exports = exports["default"];

/***/ },
/* 4 */
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

	var _TypeIndex = __webpack_require__(3);

	var _TypeIndex2 = _interopRequireDefault(_TypeIndex);

	/**
	 * A super-class for all adaptable object. Objects of this type use an internal
	 * adapter manager to instantiate adapters and store them in an internal cache.
	 */
	var ADAPTERS = Symbol['for']('adapters');

	var Adaptable = (function () {

	    /**
	     * Constructor of this class.
	     * 
	     * @param options.adapters
	     *            a mandatory instance of the "AdapterManager" class
	     */

	    function Adaptable(options) {
	        _classCallCheck(this, Adaptable);

	        if (options) {
	            this.adapters = options.adapters;
	        }
	    }

	    _createClass(Adaptable, [{
	        key: 'adapters',

	        /**
	         * Returns reference to the internal adapters manager.
	         */
	        get: function () {
	            return this[ADAPTERS];
	        },

	        /**
	         * Sets a new adapter manager.
	         */
	        set: function (adapters) {
	            this[ADAPTERS] = adapters;
	        }
	    }, {
	        key: 'setAdapter',

	        /**
	         * Sets a new object adapter. This adapter is stored in an internal object
	         * cache.
	         * 
	         * @param adapterType
	         *            the type of the adapter to set
	         * @param adapter
	         *            a new adapter to set
	         * @return this object
	         */
	        value: function setAdapter(adapterType, adapter) {
	            if (adapter) {
	                var cache = this._getAdaptersCache();
	                var key = _TypeKey2['default'].getTypeKey(adapterType);
	                cache.set(key, adapter);
	            }
	            return this;
	        }
	    }, {
	        key: 'getAdapter',

	        /**
	         * Returns an adapter for this object corresponding to the specified adapter
	         * type. The resulting adapter is stored in an internal object-specific
	         * adapter cache. To clear adapter cache use the "clearAdapters" method.
	         * 
	         * @param adapterType
	         *            the type of the adapter to return
	         * @param options
	         *            options used to create a new adapter; if an adapter already
	         *            exists then this parameter is ignored
	         * @return an adapter instance (if any)
	         */
	        value: function getAdapter(adapterType, options) {
	            var cache = this._getAdaptersCache();
	            var key = _TypeKey2['default'].getTypeKey(adapterType);
	            var result = cache.get(key);
	            if (!result && !cache.has(key)) {
	                result = this.newAdapter(adapterType, options);
	                cache.set(key, result);
	            }
	            return result;
	        }
	    }, {
	        key: 'newAdapter',

	        /**
	         * Creates and returns a new adapter for this object.
	         * 
	         * @param adapterType
	         *            the type of the adapter to create
	         * @param options
	         *            options used to create a new adapter; if an adapter already
	         *            exists then it does not take into account
	         * @return a newly created adapter instance
	         */
	        value: function newAdapter(adapterType, options) {
	            var result = this.adapters.newAdapter(this, adapterType, options);
	            return result;
	        }
	    }, {
	        key: 'clearAdapters',

	        /**
	         * This method removes object adapters of the specified types. If types are
	         * not defined then all cached adapters are removed.
	         * 
	         * @param adapterTypes
	         *            a list of adapter types to remove from the cache
	         */
	        value: function clearAdapters(adapterTypes) {
	            if (!this.__adapters) return;
	            if (!adapterTypes || !adapterTypes.length) {
	                delete this.__adapters;
	            } else {
	                for (var i = 0; i < adapterTypes.length; i++) {
	                    var adapterType = adapterTypes[i];
	                    var key = _TypeKey2['default'].getTypeKey(adapterType);
	                    this.__adapters.del(key);
	                }
	                if (this.__adapters.empty()) {
	                    delete this.__adapters;
	                }
	            }
	            return this;
	        }
	    }, {
	        key: '_getAdaptersCache',

	        /** Returns an internal object-specific adapters cache. */
	        value: function _getAdaptersCache() {
	            if (!this.__adapters) {
	                this.__adapters = new _TypeIndex2['default']();
	            }
	            return this.__adapters;
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