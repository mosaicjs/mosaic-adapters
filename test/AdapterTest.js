import expect from 'expect.js';
import { AdapterManager, Adapter } from '../';

class First{}
class Second extends First {}
class Third extends Second {}

var counter = 0;
class AdapterA extends Adapter {
    constructor(...args) {
        super(...args);
        this.id = counter++;
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

describe('Adapter', function() {
    it('should automatically retrieve the adaptable object ' + 
        'as well as the adapter type in its constructor', function() {
        let adapters = new AdapterManager();
        adapters.registerAdapter(First, AdapterA);
        adapters.registerAdapter(Second, AdapterA, AdapterB);

        let obj = new Third({adapters});
        let adapter = adapters.newAdapter(obj, AdapterA);
        expect(adapter).to.not.empty();
        expect(adapter).to.be.an(AdapterB);
        expect(adapter.adaptable).to.be(obj);
        expect(adapter.adapterType).to.be(AdapterA);

        obj = new First({adapters});
        adapter = adapters.newAdapter(obj, AdapterA);
        expect(adapter).to.not.empty();
        expect(adapter).to.be.an(AdapterA);
        expect(adapter.adaptable).to.be(obj);
        expect(adapter.adapterType).to.be(AdapterA);

    });
});


