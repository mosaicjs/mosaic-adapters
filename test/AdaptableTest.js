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

describe('Adaptable', function() {
    it('should manage class adapters', function() {
        let adapters = new AdapterManager();
        adapters.registerAdapter(First, AdapterA);
        adapters.registerAdapter(Second, AdapterA, AdapterB);
        let obj = new Third({adapters});
        let adapter = obj.getAdapter(AdapterA);
        expect(adapter).to.not.empty();
        expect(adapter).to.be.an(AdapterB);
        
        let secondAdapter = obj.getAdapter(AdapterA);
        expect(secondAdapter).to.be(adapter);

        secondAdapter = obj.clearAdapters().getAdapter(AdapterA);
        expect(secondAdapter).to.not.be(adapter);
        expect(secondAdapter.id).to.be.eql(adapter.id + 1);
    });
    it('should automatically create adapter instances from the adapter type', function(){
        let adapters = new AdapterManager();
        let third = new Third({adapters});
        let adapter = third.getAdapter(AdapterB);
        expect(adapter).to.be.an(AdapterB);
    });    
    it('should try to retrieve the most specific adapter first', function(){
        // Classes to adapt
        class GeoJsonResource extends Adaptable {}
        class Transport extends GeoJsonResource {}
        class Bus extends Transport{}
        class BusStop extends Bus {}
        class BusLine extends Bus {}
        // Adapters
        class MapLayer {}
        class MapMarker extends MapLayer {}
        class BusStopMarker extends MapMarker {}
        class MapLine extends MapLayer {}
        class BusMapLine extends MapLine {}
        
        let adapters = new AdapterManager();
        adapters.registerAdapter(GeoJsonResource, MapLayer);
        adapters.registerAdapter(BusStop, BusStopMarker);
        adapters.registerAdapter(BusLine, BusMapLine);
        
        let adapter;
        
        let r = new GeoJsonResource({adapters});
        adapter = r.getAdapter(MapLayer);
        expect(adapter).to.be.an(MapLayer);
        
        let busStop = new BusStop({adapters});
        adapter = busStop.getAdapter(MapLayer);
        expect(adapter).to.be.an(MapLayer);
        expect(adapter).to.be.an(BusStopMarker);
        
        let bus = new Bus({adapters});
        adapter = bus.getAdapter(MapLayer);
        expect(adapter).to.be.an(MapLayer);
        expect(adapter).to.not.be.an(BusStopMarker);

        let busLine = new BusLine({adapters});
        adapter = busLine.getAdapter(MapLayer);
        expect(adapter).to.be.an(MapLayer);
        expect(adapter).to.be.an(BusMapLine);
    });
    
    it('adaptable objects as adapter - ' + 
            'they should take adapters from the parent', function(){
        class AAdapter extends Adaptable {}
        class BAdapter extends Adaptable {}
        let adapters = new AdapterManager();
        let third = new Third({adapters});
        let a = third.getAdapter(AAdapter);
        expect(a.adapters).to.be(adapters);
    });
});


