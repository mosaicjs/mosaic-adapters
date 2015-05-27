export function getTypeKey(obj){
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
}