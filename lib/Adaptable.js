import TypeKey from './TypeKey';
import TypeIndex from './TypeIndex';

/**
 * A super-class for all adaptable object. Objects of this type use an internal
 * adapter manager to instantiate adapters and store them in an internal cache.
 */
const ADAPTERS = Symbol.for('adapters');
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
     * Returns reference to the internal adapters manager.
     */
    get adapters(){
        return this[ADAPTERS];
    }
    
    /**
     * Sets a new adapter manager.
     */
    set adapters(adapters){
        this[ADAPTERS] = adapters;
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
        if (adapter) {
            let cache = this._getAdaptersCache();
            let key = TypeKey.getTypeKey(adapterType);
            cache.set(key, adapter);
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
        let result = cache.get(key);
        if (!result && !cache.has(key)) {
            result = this.newAdapter(adapterType, options);
            cache.set(key, result);
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
                this.__adapters.del(key);
            }
            if (this.__adapters.empty()) {
                delete this.__adapters;
            }
        }
        return this;
    }
    
    /** Returns an internal object-specific adapters cache. */ 
    _getAdaptersCache(){
        if (!this.__adapters){
            this.__adapters = new TypeIndex();
        }
        return this.__adapters;
    }
    
}

Adaptable.prototype.getTypeKey = TypeKey.getTypeKey;