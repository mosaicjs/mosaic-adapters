/**
 * A super-class for adapters.
 */
const KEY_FROM = Symbol.for('_from');
const KEY_TO = Symbol.for('_to');
export default class Adapter {

    /**
     * Constructor of this class.
     * 
     * @param options
     * @param from
     *            the adapter object
     * @param to
     *            the type of the adapter; this instance is used as an adapter
     *            for the specified type
     */
    constructor(options, from, to){
        this.adaptable = from;
        this.adapterType = to; 
    }
    
    /**
     * Returns reference to the main adapted object.
     */
    get adaptable(){
        return this[KEY_FROM];
    }
    
    /**
     * Sets a new adaptable object
     */
    set adaptable(adaptable){
        if (adaptable !== undefined) {
            this[KEY_FROM] = adaptable;
        } else {
            delete this[KEY_FROM];
        }
    }
 
    /**
     * Returns the adaptable type.
     */
    get adapterType(){
        return this[KEY_TO];
    }
    
    /**
     * Sets a new adaptable object
     */
    set adapterType(type){
        if (!!type) {
            this[KEY_TO] = type;
        } else {
            delete this[KEY_TO];
        }
    }
 
}
