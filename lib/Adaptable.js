import TypeKey from './TypeKey';

/**
 * A super-class for all adaptable object. Objects of this type use an internal
 * adapter manager to instantiate adapters and store them in an internal cache.
 */
export default class Adaptable {

    /**
     * Constructor of this class.
     * 
     * @param options.adapters
     *            a mandatory instance of the "AdapterManager" class
     */
    constructor(options){
        if (options){
            this.adapters = options.adapters;
        }
    }
    
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
    setAdapter(adapterType, adapter) {
        let cache = this._getAdaptersCache();
        if (adapter) {
            let key = TypeKey.getTypeKey(adapterType);
            cache[key] = adapter;
        }
        return this;
    }
    
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
    getAdapter(adapterType, options) {
        let cache = this._getAdaptersCache();
        let key = TypeKey.getTypeKey(adapterType);
        let result = cache[key];
        if (!result && !(key in cache)) {
            result = this.newAdapter(adapterType, options);
            cache[key] = result;
        }
        return result;
    }
    
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
    newAdapter(adapterType, options) {
        let result = this.adapters.newAdapter(this, adapterType, options);
        return result;
    }
    
    /**
     * This method removes object adapters of the specified types. If types are
     * not defined then all cached adapters are removed.
     * 
     * @param adapterTypes
     *            a list of adapter types to remove from the cache
     */
    clearAdapters(adapterTypes){
        if (!this.__adapters)
            return ;
        if (!adapterTypes || !adapterTypes.length) {
            delete this.__adapters;
        } else {
            for (let i = 0; i < adapterTypes.length; i++) {
                let adapterType = adapterTypes[i]; 
                let key = TypeKey.getTypeKey(adapterType);
                delete this.__adapters[key];
            }
        }
        return this;
    }
    
    /** Returns an internal object-specific adapters cache. */ 
    _getAdaptersCache(){
        return this.__adapters = this.__adapters  || {};
    }
    
}

Adaptable.prototype.getTypeKey = TypeKey.getTypeKey;