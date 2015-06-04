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

	var _libAdapter = __webpack_require__(3);

	var _libAdapter2 = _interopRequireDefault(_libAdapter);

	var _libAdaptable = __webpack_require__(4);

	var _libAdaptable2 = _interopRequireDefault(_libAdaptable);

	exports['default'] = {
	    TypeKey: _libTypeKey2['default'],
	    AdapterManager: _libAdapterManager2['default'],
	    Adapter: _libAdapter2['default'],
	    Adaptable: _libAdaptable2['default']
	};
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * This object contains utility mix-in methods returning object types as a
	 * TypeKey instance. The main method in the mixin is "getTypeKey" which returns
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

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var typeCounter = 0;
	var keyCounter = 0;
	var keyIndex = {};
	var typeIndex = {};

	var TypeKey = (function () {
	    function TypeKey(str) {
	        _classCallCheck(this, TypeKey);

	        this.id = typeCounter++;
	        this.key = str ? str + '' : '';
	    }

	    _createClass(TypeKey, [{
	        key: 'segments',

	        /**
	         * Returns an array of string segments of this key
	         */
	        get: function () {
	            return getKeySegmentsFromString(this.key);
	        }
	    }, {
	        key: 'parent',

	        /**
	         * Returns a key for the parent type.
	         */
	        get: function () {
	            return this.getParentKey();
	        }
	    }, {
	        key: 'getParentKey',
	        value: function getParentKey() {
	            var segments = this.segments;
	            segments.pop();
	            var key = getKeyFromSegments(segments);
	            return key;
	        }
	    }, {
	        key: 'getChildKey',

	        /**
	         * Returns a type key for a child type.
	         */
	        value: function getChildKey(segments) {
	            var array = getKeySegmentsFromString(segments);
	            if (!array.length) return null;
	            array = this.segments.concat(array);
	            var key = getKeyFromSegments(array);
	            return key;
	        }
	    }, {
	        key: 'forEach',

	        /**
	         * Calls the specified function starting from the given to the top. If the
	         * specified action returns the "false" value then this method interrupt
	         * iterations.
	         * 
	         * @param return
	         *            the result of the last call to the action
	         */
	        value: function forEach(action, context) {
	            var i = 0;
	            var array = this.segments;
	            var result = undefined;
	            while (array.length) {
	                var k = i === 0 ? this : getKeyFromSegments(array);
	                result = action.call(context, k, i++);
	                if (result === false) break;
	                array.pop();
	            }
	            return result;
	        }
	    }], [{
	        key: 'fromString',

	        // ---------------------------------------------------------------------
	        // Public static methods and fields
	        // ---------------------------------------------------------------------

	        value: function fromString(str) {
	            if (!str) return null;
	            var key = keyIndex[str];
	            if (!key) {
	                key = keyIndex[str] = new TypeKey(str);
	            }
	            return key;
	        }
	    }, {
	        key: 'for',

	        /**
	         * Returns the type for the specified object. If the object is not defined
	         * then this method uses 'this' instead. If the specified parameter is a
	         * function then the key type is defined for the hierarchy of classes. If
	         * the given object contains a 'getTypeKey' method then it is used instead.
	         */
	        value: function _for(obj) {
	            return TypeKey.getTypeKey(obj);
	        }
	    }, {
	        key: 'getTypeKey',
	        value: function getTypeKey(obj) {
	            if (!obj) {
	                obj = this;
	            } else if (typeof obj.getTypeKey === 'function') {
	                return obj.getTypeKey();
	            }
	            var key = undefined;
	            if (obj instanceof TypeKey) {
	                key = obj.key;
	            } else if (typeof obj === 'string') {
	                key = obj;
	            } else {
	                var proto = undefined;
	                if (typeof obj === 'function') {
	                    proto = obj.prototype;
	                } else {
	                    proto = Object.getPrototypeOf(obj);
	                }
	                var array = [];
	                while (proto) {
	                    var classKey = TypeKey.getClassKey(proto.constructor);
	                    array.push(classKey);
	                    proto = Object.getPrototypeOf(proto);
	                }
	                array.reverse();
	                key = array.join('/');
	            }
	            return TypeKey.fromString(key);
	        }
	    }, {
	        key: 'getClassId',

	        /**
	         * Returns a unique identifier of this class.
	         */
	        value: function getClassId(cls, create) {
	            var typeId = cls.__type_id;
	            if (!typeId && create !== false) {
	                typeId = cls.__type_id = ++typeCounter;
	            }
	            return typeId;
	        }
	    }, {
	        key: 'getClassKey',

	        /**
	         * Returns a unique string key for the specified type (JS function).
	         */
	        value: function getClassKey(cls) {
	            var typeId = TypeKey.getClassId(cls);
	            var key = cls.name;
	            if (!key) {
	                // If the specified function do not have a name then we generate
	                // a unique type key using the type identifier.
	                key = 'Type-' + typeId;
	            } else {
	                // The specified function has a name.
	                // We have to check that this name is unique and there is no
	                // collision with an another function. Another function has
	                // a different type identifier.
	                var ids = typeIndex[key] = typeIndex[key] || [];
	                // Use a binary search to find our type ID in the list of existing.
	                // We can use a binary search because the ids array is ordered.
	                var pos = binarySearch(ids, typeId);
	                if (pos < 0) {
	                    pos = ids.length;
	                    ids.push(typeId);
	                }
	                if (pos !== 0) {
	                    key = key + '-' + pos;
	                }
	            }
	            return key;
	        }
	    }, {
	        key: 'reset',

	        /**
	         * This method resets the internal index of types. It is used only for
	         * debugging and test purposes.
	         */
	        value: function reset() {
	            typeIndex = {};
	        }
	    }]);

	    return TypeKey;
	})();

	exports['default'] = TypeKey;

	function binarySearch(array, value) {
	    var min = 0;
	    var max = array.length - 1;
	    var idx = undefined;
	    var val = undefined;
	    while (min <= max) {
	        idx = min + max >> 1;
	        val = array[idx];
	        if (val < value) {
	            min = idx + 1;
	        } else if (val > value) {
	            max = idx - 1;
	        } else {
	            return idx;
	        }
	    }
	    return -1;
	}

	/**
	 * Returns a new type key by joining all segments from the specified array.
	 */
	function getKeyFromSegments(array) {
	    var str = array.join('/');
	    return str ? TypeKey.fromString(str) : null;
	}

	/**
	 * Returns an array of key segments
	 */
	function getKeySegmentsFromString(key) {
	    if (!key) return [];
	    return (key + '').split('/');
	}
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

	    /**
	     * Constructor of this class. Initializes index of adapters and an internal
	     * cache.
	     */

	    function AdapterManager() {
	        _classCallCheck(this, AdapterManager);

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
	            var fromType = _TypeKey2['default']['for'](from);
	            var toType = _TypeKey2['default']['for'](to);
	            toType.forEach(function (t) {
	                var key = this._getAdapterKey(fromType, t);
	                var slot = this._adapters[key];
	                if (slot && slot.direct) return false;
	                this._adapters[key] = {
	                    adapter: adapter,
	                    direct: t === toType
	                };
	            }, this);
	            this._cache = {};
	        }
	    }, {
	        key: 'removeAdapter',

	        /** Removes an adapter from one type to another. */
	        value: function removeAdapter(from, to) {
	            var fromType = _TypeKey2['default'].getTypeKey(from);
	            var toType = _TypeKey2['default'].getTypeKey(to);
	            var result = undefined;
	            toType.forEach(function (t) {
	                var key = this._getAdapterKey(fromType, t);
	                var slot = this._adapters[key];
	                if (slot) {
	                    var remove = undefined;
	                    if (t === toType) {
	                        result = slot.adapter;
	                        remove = true;
	                    } else {
	                        if (slot.direct) return false;
	                        remove = slot.adapter === result;
	                    }
	                    if (remove) {
	                        delete this._adapters[key];
	                    }
	                }
	            }, this);
	            this._cache = {};
	            return result;
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
	            var fromType = _TypeKey2['default'].getTypeKey(from);
	            var toType = _TypeKey2['default'].getTypeKey(to);
	            var cacheKey = this._getAdapterKey(fromType, toType);
	            var result = this._cache[cacheKey];
	            if (!result && !(cacheKey in this._cache)) {
	                fromType.forEach(function (f) {
	                    var key = this._getAdapterKey(f, toType);
	                    var slot = this._adapters[key];
	                    result = slot ? slot.adapter : undefined;
	                    if (result) return false;
	                }, this);
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
	            var key = from.id + ':' + to.id;
	            return key;
	        }
	    }]);

	    return AdapterManager;
	})();

	exports['default'] = AdapterManager;
	module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * A super-class for adapters.
	 */
	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var KEY_FROM = Symbol['for']('_from');
	var KEY_TO = Symbol['for']('_to');

	var Adapter = (function () {

	    /**
	     * Constructor of this class.
	     * 
	     * @param options
	     * @param from
	     *            the adapter object
	     * @param to
	     *            the type of the adapter; this instance is used as an adapter
	     *            for the specified type
	     */

	    function Adapter(options, from, to) {
	        _classCallCheck(this, Adapter);

	        this.adaptable = from;
	        this.adapterType = to;
	    }

	    _createClass(Adapter, [{
	        key: 'adaptable',

	        /**
	         * Returns reference to the main adapted object.
	         */
	        get: function () {
	            return this[KEY_FROM];
	        },

	        /**
	         * Sets a new adaptable object
	         */
	        set: function (adaptable) {
	            if (adaptable !== undefined) {
	                this[KEY_FROM] = adaptable;
	            } else {
	                delete this[KEY_FROM];
	            }
	        }
	    }, {
	        key: 'adapterType',

	        /**
	         * Returns the adaptable type.
	         */
	        get: function () {
	            return this[KEY_TO];
	        },

	        /**
	         * Sets a new adaptable object
	         */
	        set: function (type) {
	            if (!!type) {
	                this[KEY_TO] = type;
	            } else {
	                delete this[KEY_TO];
	            }
	        }
	    }]);

	    return Adapter;
	})();

	exports['default'] = Adapter;
	module.exports = exports['default'];

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

	var _TypeKey = __webpack_require__(1);

	var _TypeKey2 = _interopRequireDefault(_TypeKey);

	var _Adapter2 = __webpack_require__(3);

	var _Adapter3 = _interopRequireDefault(_Adapter2);

	/**
	 * A super-class for all adaptable object. Objects of this type use an internal
	 * adapter manager to instantiate adapters and store them in an internal cache.
	 */
	var ADAPTERS = Symbol['for']('adapters');

	var Adaptable = (function (_Adapter) {

	    /**
	     * Constructor of this class.
	     * 
	     * @param options.adapters
	     *            a mandatory instance of the "AdapterManager" class
	     * @param from
	     *            optional parent adaptable object; this parameter is defined
	     *            only if this instance is used as an adapter itself for another
	     *            object
	     * @param to
	     *            optional adapter type for the parent object; this parameter is
	     *            defined only if this instance is used as an adapter itself for
	     *            another object
	     */

	    function Adaptable(options) {
	        var _get2;

	        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	            args[_key - 1] = arguments[_key];
	        }

	        _classCallCheck(this, Adaptable);

	        (_get2 = _get(Object.getPrototypeOf(Adaptable.prototype), 'constructor', this)).call.apply(_get2, [this, options].concat(args));
	        var adapters = undefined;
	        if (options) {
	            adapters = options.adapters;
	        }
	        if (!adapters) {
	            // This object is used as an adapter itself.
	            // So try to get the adapters from this parent object.
	            var adaptable = this.adaptable;
	            adapters = adaptable ? adaptable.adapters : undefined;
	        }
	        this.adapters = adapters;
	    }

	    _inherits(Adaptable, _Adapter);

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
	                cache[key.id] = adapter;
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
	            var result = cache[key.id];
	            if (!result && !(key.id in cache)) {
	                result = this.newAdapter(adapterType, options);
	                cache[key.id] = result;
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
	                    delete this.__adapters[key.id];
	                }
	                if (!Object.keys(this.__adapters).length) {
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
	                this.__adapters = {};
	            }
	            return this.__adapters;
	        }
	    }]);

	    return Adaptable;
	})(_Adapter3['default']);

	exports['default'] = Adaptable;

	Adaptable.prototype.getTypeKey = _TypeKey2['default'].getTypeKey;
	module.exports = exports['default'];

/***/ }
/******/ ])
});
;