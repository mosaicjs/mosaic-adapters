const UNDEFINED = Symbol();
const NULL = Symbol();
export default class TypeIndex {
    constructor(){
        this.index = {};
    }
    set(key, value){
        if (!key)
            return this;
        this.index[key] = (
            (value === undefined) ? UNDEFINED : value === null ? NULL : value
        );
        return this;
    }
    get(key){
        if (!key)
            return ;
        let value = this.index[key];
        value = (
            (value === UNDEFINED) ? undefined : value === NULL ? null : value
        );
        return value;
    }
    del(key){
        if (!key)
            return ;
        let value = this.get(key);
        delete this.index[key];
        return value;
    }
    has(key){
        if (!key)
            return false;
        let val = this.index[key];
        return !!val;
    }
    clear(){
        this.index = {};
        return this;
    }
    keys(){
        return this.index.getOwnPropertySymbols(); 
    }
    empty(){
        let keys = this.keys();
        return !keys.length;
    }
}