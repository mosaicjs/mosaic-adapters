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
        let fromType = TypeKey.for(from);
        let toType = TypeKey.for(to); 
        toType.forEach(function(t){
            let key = this._getAdapterKey(fromType, t);
            let slot = this._adapters[key];
            if (slot && slot.direct)
                return false;
            this._adapters[key] = {
                adapter : adapter,
                direct : (t === toType)
            };
        }, this);
        this._cache = {};
    }

    
    /** Removes an adapter from one type to another. */
    removeAdapter(from, to) {
        let fromType = TypeKey.getTypeKey(from);
        let toType = TypeKey.getTypeKey(to);
        let result;
        toType.forEach(function(t){
            let key = this._getAdapterKey(fromType, t);
            let slot = this._adapters[key];
            if (slot) {
                let remove;
                if (t === toType) {
                    result = slot.adapter;
                    remove = true;
                } else {
                    if (slot.direct)
                        return false;
                    remove = (slot.adapter === result);
                }
                if (remove) {
                    delete this._adapters[key];
                }
            }
        }, this);
        this._cache = {};
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
        let fromType = TypeKey.getTypeKey(from);
        let toType = TypeKey.getTypeKey(to);
        let cacheKey = this._getAdapterKey(fromType, toType);
        let result = this._cache[cacheKey];
        if (!result && !(cacheKey in this._cache)) {
            fromType.forEach(function(f) {
                let key = this._getAdapterKey(f, toType);
                let slot = this._adapters[key];
                result = slot ? slot.adapter : undefined;
                if (result) return false;
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
        let key = from.id + ':' + to.id;
        return key;
    }
    
}