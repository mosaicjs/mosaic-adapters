import expect from 'expect.js';
import { AdapterManager, Adaptable } from '../';

class First extends Adaptable {}
class Second extends First {}
class Third extends Second {}

class AdapterA {
    constructor(options, obj, type) {
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

describe('Adaptable', function() {
    it('should manage class adapters', function() {
        let manager = new AdapterManager();
        manager.registerAdapter(First, AdapterA);
        manager.registerAdapter(Second, AdapterA, AdapterB);
        let obj = new Third({ adapters : manager });
        let adapter = obj.getAdapter(AdapterA);
        expect(adapter).to.not.be(null);
        expect(adapter).to.be.an(AdapterB);
    });

});
