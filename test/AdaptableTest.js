import expect from 'expect.js';
import { AdapterManager, Adaptable } from '../';

class First extends Adaptable {}
class Second extends First {}
class Third extends Second {}

var counter = 0;
class AdapterA {
    constructor(options, obj, type) {
        this.id = counter++;
        this.options = options || {};
        this.obj = obj;
        this.adapterType = type; 
    }
    sayHello(){
        return 'A';
    }
}
class AdapterB extends AdapterA {
    sayHello() {
        return 'B';
    }
}
describe('Symbol', function() {
   it('should be used as an object key', function(){
       let first = Symbol.for('f/i/r::s.t');  
       let second = Symbol.for('s/e/c::o.n.d');
       var obj = {};
       obj[first] = 'First';
       obj[second] = 'Second';
       expect(obj[first]).to.eql('First');
       expect(obj[second]).to.eql('Second');
       expect(obj[Symbol.for('s/e/c::o.n.d')]).to.be('Second');
   });
});

describe('Adaptable', function() {
    it('should manage class adapters', function() {
        let manager = new AdapterManager();
        manager.registerAdapter(First, AdapterA);
        manager.registerAdapter(Second, AdapterA, AdapterB);
        let obj = new Third({ adapters : manager });
        let adapter = obj.getAdapter(AdapterA);
        expect(adapter).to.not.empty();
        expect(adapter).to.be.an(AdapterB);
        
        let secondAdapter = obj.getAdapter(AdapterA);
        expect(secondAdapter).to.be(adapter);

        secondAdapter = obj.clearAdapters().getAdapter(AdapterA);
        expect(secondAdapter).to.not.be(adapter);
        expect(secondAdapter.id).to.be.eql(adapter.id + 1);
        
    });

});
