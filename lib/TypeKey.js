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
let typeCounter = 0;
let keyCounter = 0;
let keyIndex = {};
let typeIndex = {};
export default class TypeKey {

    constructor(str){
        this.id = typeCounter++; 
        this.key = str ? str + '' : '';
    }
    
    /**
     * Returns an array of string segments of this key
     */
    get segments(){
        return getKeySegmentsFromString(this.key);
    }
    
    /**
     * Returns a key for the parent type.
     */
    get parent() { return this.getParentKey(); }
    getParentKey(){
        let segments = this.segments;
        segments.pop();
        let key = getKeyFromSegments(segments);
        return key;
    } 
    
    /**
     * Returns a type key for a child type.
     */  
    getChildKey(segments){
        let array = getKeySegmentsFromString(segments);
        if (!array.length)
            return null;
        array = this.segments.concat(array);
        let key = getKeyFromSegments(array);
        return key;
    }

    /**
     * Calls the specified function starting from the given to the top. If the
     * specified action returns the "false" value then this method interrupt
     * iterations.
     * 
     * @param return
     *            the result of the last call to the action
     */
    forEach(action, context) {
        let i = 0;
        let array = this.segments;
        let result;
        while (array.length) {
            let k = i === 0 ? this : getKeyFromSegments(array);
            result = action.call(context, k, i++);
            if (result === false)
                break;
            array.pop();
        }
        return result;
    }
        
    // ---------------------------------------------------------------------
    // Public static methods and fields
    // ---------------------------------------------------------------------

    static fromString(str){
        if (!str)
            return null;
        let key = keyIndex[str];
        if (!key){
            key  = keyIndex[str] = new TypeKey(str);
        }
        return key;
    }
    
    /**
     * Returns the type for the specified object. If the object is not defined
     * then this method uses 'this' instead. If the specified parameter is a
     * function then the key type is defined for the hierarchy of classes. If
     * the given object contains a 'getTypeKey' method then it is used instead.
     */
    static for(obj){ return TypeKey.getTypeKey(obj); }
    static getTypeKey(obj){
        if (!obj) {
            obj = this;
        } else if (typeof obj.getTypeKey === 'function'){
            return obj.getTypeKey();
        }
        let key;
        if (obj instanceof TypeKey) {
            key = obj.key;
        } else if (typeof obj === 'string') {
            key = obj;
        } else {
            let proto;
            if (typeof obj === 'function') {
                proto = obj.prototype; 
            } else  {
                proto = Object.getPrototypeOf(obj)
            }
            let array = [];
            while (proto) {
                let classKey = TypeKey.getClassKey(proto.constructor);
                array.push(classKey);
                proto = Object.getPrototypeOf(proto);
            }
            array.reverse();
            key = array.join('/');
        }
        return TypeKey.fromString(key); 
    }
    
    /**
     * Returns a unique identifier of this class.
     */
    static getClassId(cls,create) {
        let typeId = cls.__type_id; 
        if (!typeId && create !== false) {
            typeId = cls.__type_id = ++typeCounter;
        }
        return typeId;
    }
    
    /**
     * Returns a unique string key for the specified type (JS function).
     */
    static getClassKey(cls) {
        let typeId = TypeKey.getClassId(cls);
        let key = cls.name;
        if (!key) {
            // If the specified function do not have a name then we generate
            // a unique type key using the type identifier.
            key = 'Type-' + typeId;
        } else {
            // The specified function has a name.
            // We have to check that this name is unique and there is no
            // collision with an another function. Another function has
            // a different type identifier.
            let ids = typeIndex[key] = typeIndex[key] || [];
            // Use a binary search to find our type ID in the list of existing.
            // We can use a binary search because the ids array is ordered.
            let pos = binarySearch(ids, typeId);
            if (pos < 0) {
                pos = ids.length;
                ids.push(typeId);
            }
            if (pos !== 0) {
                key = key + '-' + pos;
            }
        }
        return key;
    }
    
    /**
     * This method resets the internal index of types. It is used only for
     * debugging and test purposes.
     */ 
    static reset(){
        typeIndex = {};
    }

}

function binarySearch(array, value) {
    let min = 0;
    let max = array.length - 1;
    let idx;
    let val;
    while (min <= max) {
        idx = (min + max) >> 1;
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
function getKeyFromSegments(array){
    let str = array.join('/');
    return str ? TypeKey.fromString(str) : null;
}

/**
 * Returns an array of key segments
 */
function getKeySegmentsFromString(key){
    if (!key) return [];
    return (key + '').split('/')
}


