var Backbone = require('backbone'),
    _ = require('underscore')

_.extend(Backbone.Model.prototype, {
    // nest a collection in a model
    nest: function(name, object) {
        if (!_.has(this, '_nested')) {
            this._nested = {}
        }

        // save object
        this._nested[name] = object

        // make accessible
        Object.defineProperty(this, name, {
            get: function() {
                return this._nested[name]
            }
        })

        // bubble events back to parent
        this.listenTo(
            this._nested[name],
            'all',
            _.bind(this.nestedEventEmitter, this, name)
        )
    },

    // event emitter for nested object. Will allow for events to bubble up parent(s)
    nestedEventEmitter: function(name, event) {
        var args = [name + '.' + event].concat(_.rest(arguments, 2))
        this.trigger.apply(this, args)
    },
    setAll: function(data) {
        // call nested collections with nested data
        _.each(this._nested, function(nested, name){
            if (_.has(data, name)) {
                nested.setAll(data[name])
            }
        })
    },
    parse: function(data) {
        return _.omit(data, 'nested')
    }
})
