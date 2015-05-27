import expect from 'expect.js';
import { TypeKey } from '../';

describe('TypeKey.getTypeKey', function() {
    class First{}
    class Second extends First{}
    class Third extends Second{}
    it('Key generation for instances', function() {
        var obj = new Third();
        var key = TypeKey.getTypeKey(obj);
        expect(Symbol.keyFor(key)).to.be('Object/First/Second/Third');
        expect(key).to.be(Symbol.for('Object/First/Second/Third'));
    });
    it('Type key generation for classes', function() {
        var key = TypeKey.getTypeKey(Third);
        expect(Symbol.keyFor(key)).to.be('Object/First/Second/Third');
        expect(key).to.be(Symbol.for('Object/First/Second/Third'));
    });
    it('Key generation for the Object basic class', function() {
        let key = TypeKey.getTypeKey(Object);
        expect(Symbol.keyFor(key)).to.be('Object');
        expect(key).to.be(Symbol.for('Object'));
    });
    it('Key generation for an Object instance', function() {
        let key = TypeKey.getTypeKey({});
        expect(Symbol.keyFor(key)).to.be('Object');
        expect(key).to.be(Symbol.for('Object'));
    });
    it('Key generation for the String basic type', function() {
        let key = TypeKey.getTypeKey(String);
        expect(Symbol.keyFor(key)).to.be('Object/String');
        expect(key).to.be(Symbol.for('Object/String'));
    });
    it('Key generation for a string', function() {
        let key = TypeKey.getTypeKey('Hello/World');
        expect(Symbol.keyFor(key)).to.be('Hello/World');
        expect(key).to.be(Symbol.for('Hello/World'));
    });
    it('Key generation for the Date basic type', function() {
        let key = TypeKey.getTypeKey(Date);
        expect(Symbol.keyFor(key)).to.be('Object/Date');
        expect(key).to.be(Symbol.for('Object/Date'));
    });
    it('Key generation for a Date instance', function() {
        let key = TypeKey.getTypeKey(new Date());
        expect(Symbol.keyFor(key)).to.be('Object/Date');
        expect(key).to.be(Symbol.for('Object/Date'));
    });
    it('Usage of the getTypeKey method defined on a plain JS object', function() {
        let obj = {
            getTypeKey(){
                return Symbol.for('Toto/Titi/Tata'); 
            }
        };
        let key = TypeKey.getTypeKey(obj);
        expect(Symbol.keyFor(key)).to.be('Toto/Titi/Tata');
        expect(key).to.be(Symbol.for('Toto/Titi/Tata'));
    })
    it('Explicit attachment of the getTypeKey method to the instance', function() {
        // Explicit attachment of the getTypeKey method to the instance
        let obj = new Third();
        obj.getTypeKey = TypeKey.getTypeKey;
        let key = TypeKey.getTypeKey(obj);
        expect(Symbol.keyFor(key)).to.be('Object/First/Second/Third');
        expect(key).to.be(Symbol.for('Object/First/Second/Third'));
    });
    it('Define the getTypeKey method in the super-class', function() {
        Second.prototype.getTypeKey = function(){
            return Symbol.for('Hello/World');
        };
        let obj = new Third();
        let key = TypeKey.getTypeKey(obj);
        expect(Symbol.keyFor(key)).to.be('Hello/World');
        expect(key).to.be(Symbol.for('Hello/World'));
    });
    it('Remove the getTypeKey method from the parent class', function() {
        delete Second.prototype.getTypeKey;
        let obj = new Third();
        let key = TypeKey.getTypeKey(obj);
        expect(Symbol.keyFor(key)).to.be('Object/First/Second/Third');
        expect(key).to.be(Symbol.for('Object/First/Second/Third'));
    });
    it('Define the getTypeKey method in the super-class', function() {
        var handled = false;
        Second.prototype.getTypeKey = function(){
            handled = true;
            return TypeKey.getTypeKey.call(this);
        };
        let obj = new Third();
        expect(handled).to.eql(false);
        let key = TypeKey.getTypeKey(obj);
        expect(handled).to.eql(true);
        expect(Symbol.keyFor(key)).to.be('Object/First/Second/Third');
        expect(key).to.be(Symbol.for('Object/First/Second/Third'));
    });
    it('Use the getTypeKey method defined object classes', function(){
        class First {
            constructor(type){
                if (type){
                    this.typeKey = TypeKey.getTypeKey(type);
                }
            }
            getTypeKey(){
                if (this.typeKey) {
                    return this.typeKey;
                }
                var key = TypeKey.getTypeKey.call(this);
                var result = Symbol.for(Symbol.keyFor(key) + '/toto');
                return result;
            }
        }
        class Second extends First {
        }
        class Third extends Second {}
        
        let key;
        let first = new First();
        key = TypeKey.getTypeKey(first);
        expect(Symbol.keyFor(key)).to.be('Object/First/toto');
        expect(key).to.be(Symbol.for('Object/First/toto'));
        
        first = new First('hello');
        expect(Symbol.keyFor(first.getTypeKey())).to.be('hello');
        expect(first.getTypeKey()).to.be(Symbol.for('hello'));
        
        let third = new Third('world');
        expect(Symbol.keyFor(third.getTypeKey())).to.be('world');
        expect(third.getTypeKey()).to.be(Symbol.for('world'));
        
        third = new Third();
        expect(Symbol.keyFor(third.getTypeKey())).to.be('Object/First/Second/Third/toto');
        expect(third.getTypeKey()).to.be(Symbol.for('Object/First/Second/Third/toto'));
        
    });
});
describe('TypeKey.getParentTypeKey', function() {
    class First{}
    class Second extends First{}
    class Third extends Second{}
    it('Get parent type keys', function() {
        var obj = new Third();
        var key = TypeKey.getTypeKey(obj);
        expect(Symbol.keyFor(key)).to.be('Object/First/Second/Third');
        expect(key).to.be(Symbol.for('Object/First/Second/Third'));

        var parentKey = TypeKey.getParentTypeKey(key);
        expect(Symbol.keyFor(parentKey)).to.be('Object/First/Second');
        expect(parentKey).to.be(Symbol.for('Object/First/Second'));
    });
    it('Parent key for the Object type should be null', function() {
        var key = TypeKey.getTypeKey({});
        expect(Symbol.keyFor(key)).to.be('Object');
        expect(key).to.be(Symbol.for('Object'));
        var parentKey = TypeKey.getParentTypeKey(key);
        expect(parentKey).to.be(null);
    });
    it('Get the parent type for objects', function() {
        var obj = new Third();
        obj.getParentTypeKey = TypeKey.getParentTypeKey;
        var parentKey = obj.getParentTypeKey();
        expect(Symbol.keyFor(parentKey)).to.be('Object/First/Second');
        expect(parentKey).to.be(Symbol.for('Object/First/Second'));
    });
});
