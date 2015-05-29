import expect from 'expect.js';
import { AdapterManager } from '../';

class First {}
class Second extends First {}
class Third extends Second {}


class AdapterA {
    sayHello(){
        return 'A';
    }
}
class AdapterB extends AdapterA {
    constructor(options, obj, type) {
        super();
        this.options = options || {};
        this.obj = obj;
        this.adapterType = type; 
    }
    sayHello() {
        return 'B';
    }
}

describe('AdapterManager', function() {
    it('should manage class adapters', function() {
        let manager = new AdapterManager();
        manager.registerAdapter(First, AdapterA);
        let obj = new Third();
        let adapter = manager.getAdapter(obj, AdapterA);
        expect(adapter).to.not.be(null);
        expect(adapter).to.be(AdapterA);
    });
    it('should manage instance adapters (1)', function() {
        let manager = new AdapterManager();
        var a = new AdapterA();
        manager.registerAdapter(First, a);
        let obj = new Third();
        let adapter = manager.getAdapter(obj, AdapterA);
        expect(adapter).to.be(a);
    });
    it('should manage instance adapters (2)', function() {
        let manager = new AdapterManager();
        var b = new AdapterB();
        manager.registerAdapter(First, AdapterA, b);
        let obj = new Third();
        let adapter = manager.getAdapter(obj, AdapterA);
        expect(adapter).to.be(b);
    });
    it('should be able to unregister adapter', function() {
        let manager = new AdapterManager();
        let obj = new Third();
        var b = new AdapterB();
        manager.registerAdapter(First, AdapterA, b);
        let adapter = manager.getAdapter(obj, AdapterA);
        expect(adapter).to.be(b);
        manager.removeAdapter(First, AdapterA);
        adapter = manager.getAdapter(obj, AdapterA);
        expect(adapter).to.be(undefined);
    });
    it('should be able to instantiate adapters', function() {
        let manager = new AdapterManager();
        let obj = new Third();
        manager.registerAdapter(First, AdapterA, AdapterB);
        let adapter = manager.newAdapter(obj, AdapterA, { foo: 'Bar '});
        expect(adapter).to.not.be.empty();
        expect(adapter.options).to.be.eql({ foo: 'Bar '});
        expect(adapter.obj).to.be(obj);
        expect(adapter.adapterType).to.be(AdapterA);
        expect(adapter.sayHello()).to.be('B');
    });
    it('should be able manage adapters by string keys', function() {
        let manager = new AdapterManager();
        let obj = new Third();
        manager.registerAdapter(First, 'toto', AdapterB);
        let adapter = manager.newAdapter(obj, 'toto/titi/tata', { foo: 'Bar '});
        expect(adapter).to.not.be.empty();
        expect(adapter.options).to.be.eql({ foo: 'Bar '});
        expect(adapter.obj).to.be(obj);
        expect(adapter.adapterType).to.be('toto/titi/tata');
        expect(adapter.sayHello()).to.be('B');
    });
    it('should manage class inheritance', function() {
        let manager = new AdapterManager();
        manager.registerAdapter(First, AdapterA);
        manager.registerAdapter(Second, AdapterA, AdapterB);
        expect(manager.newAdapter(new First(), AdapterA)).to.be.an(AdapterA);
        expect(manager.newAdapter(new Second(), AdapterA)).to.be.an(AdapterB);
        expect(manager.newAdapter(new Third(), AdapterA)).to.be.an(AdapterB);
    });
    
});
