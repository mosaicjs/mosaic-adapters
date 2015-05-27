import TypeKey from './TypeKey';

/**
 * An adapter manager used to register/retrieve objects corresponding to the
 * types of adaptable object and the types of the target object. This object is
 * used by views to get view adapters.
 */
export default class AdapterManager {
    
    constructor(options){
        options = options || {};
        this._adapters = {};
        this._cache = {};
    }
    
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
    registerAdapter(from, to, adapter) {
        if (adapter === undefined){
            adapter = to;
        }
        var key = this._getKey(from, to);
        this._adapters[key] = adapter || to;
        this._cache = {};
    }
    
    /** Removes an adapter from one type to another. */
    removeAdapter(from, to) {
        var key = this._getKey(from, to);
        var result = this._adapters[key];
        delete this._adapters[key];
        delete this._cache[key];
        return result;
    }

    /** Returns an adapter of one object type to another type. */
    getAdapter(from, to) {
        let cacheKey = this._getKey(from, to);
        let result = this._cache[cacheKey];
        if (!result && !(cacheKey in this._cache)) {
            this._forEachKey(from, function(f) {
                this._forEachKey(to, function(t) {
                    let key = this._getKey(f, t);
                    result = this._adapters[key];
                    return !result;
                });
                return !result;
            });
            this._cache[cacheKey] = result;
        }
        return result;
    }

    /**
     * Creates and returns a new adapter from one type to another. If the
     * registered adapter is a function then it is used as constructor to create
     * a new object.
     */
    newAdapter(from, to, options) {
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
    
    
    /**
     * Returns a key used to find adapters of one type to another.
     * 
     * @param from
     *            the type of the adaptable object
     * @param to
     *            type of the target object
     */
    _getKey(from, to) {
        var fromType = TypeKey.getTypeKey(from);
        var toType = TypeKey.getTypeKey(to);
        return Symbol.keyFor(fromType) + '::' + Symbol.keyFor(toType);
    }
    
    /**
     * Calls the specified function starting from the given to the top
     */
    _forEachKey(key, action){
        let i = 0;
        key = TypeKey.getTypeKey(key);
        let result;
        while (key) {
            result = action.call(this, key, i++);
            if (result === false)
                break;
            key = TypeKey.getParentTypeKey(key);
        }
        return result;
    }
    
    /**
     * Checks if option values are valid using validation methods on the
     * specified object
     */
    _checkValidity(obj, options) {
        if (typeof obj.isValid !== 'function')
            return true;
        var result = obj.isValid(options);
        return result;
    }

}