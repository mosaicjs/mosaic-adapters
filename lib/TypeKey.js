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
const TypeKey = {
        
    /**
     * Returns the type for the specified object. If the object is not defined
     * then this method uses 'this' instead. If the specified parameter is a
     * function then the key type is defined for the hierarchy of classes. If
     * the given object contains a 'getTypeKey' method then it is used instead.
     */
    getTypeKey(obj){
        if (!obj) {
            obj = this;
        } else if (typeof obj.getTypeKey === 'function'){
            return obj.getTypeKey();
        }
        if (obj instanceof Symbol)
            return obj;
        let key;
        if (typeof obj === 'string') {
            key = obj;
        } else {
            var proto;
            if (typeof obj === 'function') {
                proto = obj.prototype; 
            } else  {
                proto = Object.getPrototypeOf(obj)
            }
            var array = [];
            while (proto) {
                array.push(proto.constructor.name);
                proto = Object.getPrototypeOf(proto);
            }
            array.reverse();
            key = array.join('/');
        }
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
    },
    
    /**
     * Calls the specified function starting from the given to the top. If the
     * specified action returns the "false" value then this method interrupt
     * iterations.
     * 
     * @param return
     *            the result of the last call to the action
     */
    forEachKey(key, action, context){
        context = context || this;
        let i = 0;
        key = TypeKey.getTypeKey(key);
        let result;
        while (key) {
            result = action.call(context, key, i++);
            if (result === false)
                break;
            key = TypeKey.getParentTypeKey(key);
        }
        return result;
    }
    
}
export default TypeKey;
