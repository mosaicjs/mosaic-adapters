import expect from 'expect.js';
import { TypeKey } from '../';

describe('TypeKey', function() {
    beforeEach(function(){
        TypeKey.reset();
    });
    describe('TypeKey.getClassKey', function(){
        it('should be able to generate and maintain unique type identifiers', function(){
            let f = function(){
                return 'Hello, there';
            }
            let firstKey = TypeKey.getClassKey(f);
            let secondKey = TypeKey.getClassKey(f);
            expect(firstKey).to.be(secondKey);
        });
       it('should be able to generate different identifiers for functions with the same name', function(){
           let FirstType = (function(msg){
               function MyType(){
                   return 'First-' + msg;
               }
               return MyType;
           })('1');
           let SecondType = (function(msg){
               function MyType(){
                   return 'Second-' + msg;
               }
               return MyType;
           })('2');
           
           let firstKey = TypeKey.getClassKey(FirstType);
           let firstId = TypeKey.getClassId(FirstType);
           let secondKey = TypeKey.getClassKey(SecondType);
           let secondId = TypeKey.getClassId(SecondType);
           expect(!!firstId).to.be(true);
           expect(+firstId > 0).to.be(true);
           expect(!!secondId).to.be(true);
           expect(+secondId > 0).to.be(true);
           expect(firstId !== secondId).to.be(true);
           
           expect(firstKey).to.be('MyType');
           expect(secondKey).to.be('MyType1');
           expect(firstKey !== secondKey).to.be(true);
       }); 
       it('should be able to generate identifiers for anonymous functions', function(){
           let key = TypeKey.getClassKey(function(){
               return 'Hello, there';
           });
           expect(!!key).to.be(true);
           expect(key.indexOf('Type')).to.be(0);
       });
    });
    describe('TypeKey.for', function() {
        class First{}
        class Second extends First{}
        class Third extends Second{}
        it('Key generation for instances', function() {
            let obj = new Third();
            let key = TypeKey.for(obj);
            expect(key.key).to.be('Object/First/Second/Third');
        });
        it('Type key generation for classes', function() {
            let key = TypeKey.for(Third);
            expect(key.key).to.be('Object/First/Second/Third');
        });
        it('Key generation for the Object basic class', function() {
            let key = TypeKey.for(Object);
            expect(key.key).to.be('Object');
        });
        it('Key generation for an Object instance', function() {
            let key = TypeKey.for({});
            expect(key.key).to.be('Object');
        });
        it('Key generation for the String basic type', function() {
            let key = TypeKey.for(String);
            expect(key.key).to.be('Object/String');
        });
        it('Key generation for a string', function() {
            let key = TypeKey.for('Hello/World');
            expect(key.key).to.be('Hello/World');
        });
        it('Key generation for the Date basic type', function() {
            let key = TypeKey.for(Date);
            expect(key.key).to.be('Object/Date');
        });
        it('Key generation for a Date instance', function() {
            let key = TypeKey.for(new Date());
            expect(key.key).to.be('Object/Date');
        });
        it('Usage of the getTypeKey method defined on a plain JS object', function() {
            let obj = {
                getTypeKey(){
                    return TypeKey.for('Toto/Titi/Tata'); 
                }
            };
            let key = TypeKey.for(obj);
            expect(key.key).to.be('Toto/Titi/Tata');
        })
        it('Explicit attachment of the getTypeKey method to the instance', function() {
            // Explicit attachment of the getTypeKey method to the instance
            let obj = new Third();
            obj.getTypeKey = TypeKey.getTypeKey;
            let key = TypeKey.for(obj);
            expect(key.key).to.be('Object/First/Second/Third');
        });
        it('Define the getTypeKey method in the super-class', function() {
            Second.prototype.getTypeKey = function(){
                return TypeKey.for('Hello/World');
            };
            let obj = new Third();
            let key = TypeKey.for(obj);
            expect(key.key).to.be('Hello/World');
        });
        it('Remove the getTypeKey method from the parent class', function() {
            delete Second.prototype.getTypeKey;
            let obj = new Third();
            let key = TypeKey.for(obj);
            expect(key.key).to.be('Object/First/Second/Third');
        });
        it('Define the getTypeKey method in the super-class', function() {
            let handled = false;
            Second.prototype.getTypeKey = function(){
                handled = true;
                return TypeKey.getTypeKey.call(this);
            };
            let obj = new Third();
            expect(handled).to.eql(false);
            let key = TypeKey.for(obj);
            expect(handled).to.eql(true);
            expect(key.key).to.be('Object/First/Second/Third');
        });
        it('Use the getTypeKey method defined object classes', function(){
            class First {
                constructor(type){
                    if (type){
                        this.typeKey = TypeKey.for(type);
                    }
                }
                getTypeKey(){
                    if (this.typeKey) {
                        return this.typeKey;
                    }
                    let key = TypeKey.getTypeKey.call(this);
                    let result = key.getChildKey('toto');
                    return result;
                }
            }
            class Second extends First {
            }
            class Third extends Second {}
            
            let key;
            let first = new First();
            key = TypeKey.for(first);
            expect(key.key).to.be('Object/First/toto');
            
            first = new First('hello');
            let firstKey = first.getTypeKey();
            expect(firstKey.key).to.be('hello');
            expect(firstKey).to.be(TypeKey.for('hello'));
            
            let third = new Third('world');
            let thirdKey = third.getTypeKey();
            expect(thirdKey.key).to.be('world');
            expect(thirdKey).to.be(TypeKey.for('world'));
            
            third = new Third();
            thirdKey = third.getTypeKey();
            expect(thirdKey.key).to.be('Object/First/Second/Third/toto');
            expect(thirdKey).to.be(TypeKey.for('Object/First/Second/Third/toto'));
            
        });
    });
    describe('TypeKey.getParentTypeKey', function() {
        class First{}
        class Second extends First{}
        class Third extends Second{}
        it('Get parent type keys', function() {
            let obj = new Third();
            let key = TypeKey.for(obj);
            expect(key.key).to.be('Object/First/Second/Third');
    
            let parentKey = key.parent;
            expect(parentKey.key).to.be('Object/First/Second');
            expect(parentKey).to.be(TypeKey.for('Object/First/Second'));
        });
        it('Parent key for the Object type should be null', function() {
            let key = TypeKey.for({});
            expect(key.key).to.be('Object');
            let parentKey = key.parent;
            expect(parentKey).to.be(null);
        });
    });
    describe('TypeKey.forEachKey', function() {
        class First{}
        class Second extends First{}
        class Third extends Second{}
        let obj = TypeKey.for(Object);
        let first = TypeKey.for(First);
        let second = TypeKey.for(Second);
        let third = TypeKey.for(Third);
        it('Should iterate over all key hierarchy', function(){
           let array = [];
           let positions = [];
           third.forEach(function(key, pos){
               array.push(key.key);
               positions.push(pos);
           });
           expect(array).to.eql([
               third.key,
               second.key,
               first.key,
               obj.key
           ]);
           expect(positions).to.eql([0, 1, 2, 3]);
       });
        it('Should stop iterations when it receives the "false" as response', function(){
            let array = [];
            let positions = [];
            third.forEach(function(key, pos){
                array.push(key.key);
                positions.push(pos);
                if (pos === 1)
                    return false;
            });
            expect(array).to.eql([
                third.key,
                second.key
            ]);
            expect(positions).to.eql([0, 1]);
        }); 
    });
});