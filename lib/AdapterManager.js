import TypeKey from './TypeKey';

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
        let fromKey = TypeKey.for(from);
        let toKey = TypeKey.for(to); 
        toKey.forEach(function(t){
            let key = this._getAdapterKey(fromKey, t);
            let slot = this._adapters[key];
            if (slot && slot.direct)
                return false;
            this._adapters[key] = {
                adapter : adapter,
                direct : (t === toKey)
            };
        }, this);
        this._cache = {};
    }

    
    /** Removes an adapter from one type to another. */
    removeAdapter(from, to) {
        let key = this._getAdapterKey(from, to);
        let slot = this._adapters[key];
        delete this._adapters[key];
        this._cache = {};
        return slot ? slot.adapter : undefined;
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
        let result = this._cache[cacheKey];
        if (!result && !(cacheKey in this._cache)) {
            let fromKey = TypeKey.for(from);
            let toKey = TypeKey.for(to);
            fromKey.forEach(function(f) {
                let key = this._getAdapterKey(f, toKey);
                let slot = this._adapters[key];
                result = slot ? slot.adapter : undefined;
                return !result;
            }, this);
            this._cache[cacheKey] = result;
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
        let result = null;
        let adapter = this.getAdapter(from, to);
        let AdapterType = adapter || to;
        if (typeof AdapterType === 'function') {
            options = options || {};
            result = new AdapterType(options, from, to);
        } else {
            result = adapter;
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
        let fromType = TypeKey.getTypeKey(from);
        let toType = TypeKey.getTypeKey(to);
        let key = fromType.id + ':' + toType.id;
        return key;
    }
    
}