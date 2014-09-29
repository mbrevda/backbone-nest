var should = require('should'),
    nest = require('../src'),
    Backbone = require('backbone')

Backbone.$ = global.window.$
describe('Collections', function(){
    it('fetchAll() should cause nested collections to fetch', function(done){
        var c = new Backbone.Collection()
        var m = c.add({})
	    
	    m.nest('foo', new Backbone.Collection())

        m.foo.fetch = function() {
            done()
        }

        c.fetch = function(){
            var def = new Backbone.$.Deferred()
            setImmediate(function(){
                def.resolve({})
            })
        }

        c.fetchAll()
    }) 
    
    it('setAll() should do nothing if it isnt passed any data', function(){
        var c = new Backbone.Collection()
        
        c.setAll().should.be.ok
    })

    it('setAll() should set nested data', function(){
        var M = Backbone.Model.extend({
            initialize: function(){
                this.nest('capitals', new Backbone.Collection())
            }
        })
        var C = Backbone.Collection.extend({
            model: M
        })
        var c = new C()
        var data = {
                foo: 'bar',
                id: 2,
                nested: {
                    capitals: [
                        {usa: 'dc'},
                        {uk: 'london'}
                    ]
                }
            }

        c.setAll([data])
        
        c.get(2).get('foo').should.eql('bar')

        c.get(2).capitals.at(0).get('usa').should.eql('dc')
    })
})
