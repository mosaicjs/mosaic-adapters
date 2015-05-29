import TypeKey from './TypeKey';
import TypeIndex from './TypeIndex';

/**
 * An adapter manager used to register/retrieve objects corresponding to the
 * types of adaptable object and the types of the target object.
 */
export default class AdapterManager {
    
    /**
     * Constructor of this class. Initializes index of adapters and an internal
     * cache.
     */  
    constructor(){
        this._adapters = new TypeIndex();
        this._cache = new TypeIndex();
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
        var key = this._getAdapterKey(from, to);
        this._adapters.set(key, adapter || to);
        this._cache.clear();
    }

    
    /** Removes an adapter from one type to another. */
    removeAdapter(from, to) {
        var key = this._getAdapterKey(from, to);
        var result = this._adapters.del(key);
        this._cache.clear();
        return result;
    }

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
    getAdapter(from, to) {
        let cacheKey = this._getAdapterKey(from, to);
        let result = this._cache.get(cacheKey);
        if (!result && !this._cache.has(cacheKey)) {
            TypeKey.forEachKey(from, function(f) {
                return TypeKey.forEachKey(to, function(t) {
                    let key = this._getAdapterKey(f, t);
                    result = this._adapters.get(key);
                    return !result;
                }, this);
            }, this);
            this._cache.set(cacheKey, result);
        }
        return result;
    }

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
     * Returns a key used to find adapters from one type to another.
     * 
     * @param from
     *            the type of the adaptable object
     * @param to
     *            type of the target object
     * @return a new adapter key
     */
    _getAdapterKey(from, to) {
        var fromType = TypeKey.getTypeKey(from);
        var toType = TypeKey.getTypeKey(to);
        var key = Symbol.keyFor(fromType) + '::' + Symbol.keyFor(toType);
        return Symbol.for(key);
    }
    
}