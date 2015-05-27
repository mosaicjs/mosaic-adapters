import TypeKey from './TypeKey';

export default class Adaptable {
    constructor(options){
        options = options || {};
        this.adapters = options.adapters;
    }
    set adapters(adapters) {
        this._adapters = adapters;
    }    
    get adapters() {
        return this._adapters;
    }
    setAdapter(adapterType, adapter) {
        var cache = this.__adapters = this.__adapters || {};
        if (adapter) {
            var key = TypeKey.getTypeKey(adapterType);
            cache[key] = adapter;
        }
        return this;
    }
    getAdapter(adapterType, options) {
        var cache = this.__adapters = this.__adapters || {};
        var key = TypeKey.getTypeKey(adapterType);
        var result = cache[key];
        if (!result) {
            result = this.newAdapter(adapterType, options);
            cache[key] = result;
        }
        return result;
    }
    newAdapter(adapterType, options) {
        let result = this.adapters.newAdapter(this, adapterType, options);
        return result;
    }
}
