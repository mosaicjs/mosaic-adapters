import expect from 'expect.js';
import { getTypeKey } from '../';

describe('getTypeKey', function() {
    class First{}
    class Second extends First{}
    class Third extends Second{}
    it('Key generation for instances', function() {
        var obj = new Third();
        var key = getTypeKey(obj);
        expect(Symbol.keyFor(key)).to.be('Object/First/Second/Third');
        expect(key).to.be(Symbol.for('Object/First/Second/Third'));
    });
    it('Type key generation for classes', function() {
        var key = getTypeKey(Third);
        expect(Symbol.keyFor(key)).to.be('Object/First/Second/Third');
        expect(key).to.be(Symbol.for('Object/First/Second/Third'));
    });
    it('Key generation for the Object basic class', function() {
        let key = getTypeKey(Object);
        expect(Symbol.keyFor(key)).to.be('Object');
        expect(key).to.be(Symbol.for('Object'));
    });
    it('Key generation for an Object instance', function() {
        let key = getTypeKey({});
        expect(Symbol.keyFor(key)).to.be('Object');
        expect(key).to.be(Symbol.for('Object'));
    });
    it('Key generation for the String basic type', function() {
        let key = getTypeKey(String);
        expect(Symbol.keyFor(key)).to.be('Object/String');
        expect(key).to.be(Symbol.for('Object/String'));
    });
    it('Key generation for a string', function() {
        let key = getTypeKey('hello');
        expect(Symbol.keyFor(key)).to.be('Object/String');
        expect(key).to.be(Symbol.for('Object/String'));
    });
    it('Key generation for the Date basic type', function() {
        let key = getTypeKey(Date);
        expect(Symbol.keyFor(key)).to.be('Object/Date');
        expect(key).to.be(Symbol.for('Object/Date'));
    });
    it('Key generation for a Date instance', function() {
        let key = getTypeKey(new Date());
        expect(Symbol.keyFor(key)).to.be('Object/Date');
        expect(key).to.be(Symbol.for('Object/Date'));
    });
    it('Usage of the getTypeKey method defined on a plain JS object', function() {
        let obj = {
            getTypeKey(){
                return Symbol.for('Toto/Titi/Tata'); 
            }
        };
        let key = getTypeKey(obj);
        expect(Symbol.keyFor(key)).to.be('Toto/Titi/Tata');
        expect(key).to.be(Symbol.for('Toto/Titi/Tata'));
    })
    it('Explicit attachment of the getTypeKey method to the instance', function() {
        // Explicit attachment of the getTypeKey method to the instance
        let obj = new Third();
        obj.getTypeKey = getTypeKey;
        let key = getTypeKey(obj);
        expect(Symbol.keyFor(key)).to.be('Object/First/Second/Third');
        expect(key).to.be(Symbol.for('Object/First/Second/Third'));
    });
    it('Define the getTypeKey method in the super-class', function() {
        Second.prototype.getTypeKey = function(){
            return Symbol.for('Hello/World');
        };
        let obj = new Third();
        let key = getTypeKey(obj);
        expect(Symbol.keyFor(key)).to.be('Hello/World');
        expect(key).to.be(Symbol.for('Hello/World'));
    });
    it('Remove the getTypeKey method from the parent class', function() {
        delete Second.prototype.getTypeKey;
        let obj = new Third();
        let key = getTypeKey(obj);
        expect(Symbol.keyFor(key)).to.be('Object/First/Second/Third');
        expect(key).to.be(Symbol.for('Object/First/Second/Third'));
    });
    it('Define the getTypeKey method in the super-class', function() {
        var handled = false;
        Second.prototype.getTypeKey = function(){
            handled = true;
            return getTypeKey.call(this);
        };
        let obj = new Third();
        expect(handled).to.eql(false);
        let key = getTypeKey(obj);
        expect(handled).to.eql(true);
        expect(Symbol.keyFor(key)).to.be('Object/First/Second/Third');
        expect(key).to.be(Symbol.for('Object/First/Second/Third'));
    });    
});

