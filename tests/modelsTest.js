var should = require('should'),
    nest = require('../src'),
    Backbone = require('backbone')

describe('Models', function(){
    it('Should ignore "nested" attribute when parsing', function(){
        var data = {
            foo: 'bar',
            nested: {}
        }
        Backbone.Model.prototype.parse(data).should.have.key('foo')
        Backbone.Model.prototype.parse(data).should.not.have.key('nested')
    }) 

    it('Should nest a collection', function(){
        var c = new Backbone.Collection()
        var m = new Backbone.Model()

        m.nest('foo', c)

        m.foo.should.be.instanceof(Backbone.Collection)
    })

    it('Events should bubble up', function(done){
        var c = new Backbone.Collection()
        var m = new Backbone.Model()

        m.nest('foo', c)

        m.on('foo.add', function(){
            done()
        })
        
        c.add({})
    })

    it('setAll() should set set nested collections', function(){
        var c = new Backbone.Collection()
        var m = new Backbone.Model()
        var data = {
            foo: [
                {color: 'green'}
            ]
        }
        m.nest('foo', c)
        
        m.setAll(data)

        m.foo.at(0).get('color').should.eql('green')
    })
})
