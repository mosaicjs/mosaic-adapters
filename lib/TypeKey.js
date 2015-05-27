const TypeKey = {
        
    /**
     * Returns the type for the specified object. If the object is not defined
     * then this method uses 'this' instead. If the specified parameter is a
     * function then the key type is defined for the hierarchy of classes. If
     * the given object contains a 'getTypeKey' method then it is used instead.
     */
    getTypeKey(obj){
        var proto;
        if (typeof obj === 'function') {
            proto = obj.prototype; 
        } else {
            if (!obj) {
                obj = this;
            } else if (typeof obj.getTypeKey === 'function'){
                return obj.getTypeKey();
            }
            proto = Object.getPrototypeOf(obj)
        }
        var array = [];
        while (proto) {
            array.push(proto.constructor.name);
            proto = Object.getPrototypeOf(proto);
        }
        array.reverse();
        var key = array.join('/');
        return Symbol.for(key); 
    },
    
    /**
     * Returns a key for the parent type.
     */
    getParentTypeKey(key){
        if (!(key instanceof Symbol)) {
            key = TypeKey.getTypeKey.apply(this, key);
        }
        let str = Symbol.keyFor(key);
        let array = str.split('/');
        array.pop();
        str = array.join('/');
        return str ? Symbol.for(str) : null;
    }
}
export default TypeKey;
